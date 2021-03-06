<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-line" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)">
    
        <span ref="text" v-if="!editmode && !isLink">
            <slot></slot>
        </span>

        <a :href="getLink" ref="text" v-if="!editmode && isLink">
            <slot></slot>
        </a>

        <a v-if="!editmode" @click.stop.prevent="edit" class="" v-show="isOver">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <span class="charlimiter" :class="runningOut" v-if="limitChars > 0 && editmode" v-text="limit"></span>

        <input 
            ref="input" 
            v-if="editmode" 
            type="text" 
            :placeholder="placeholder"
            @blur="leave" 
            @keydown.enter.stop="leave"
            @keydown.esc.stop="reset"
            @keyup="limitLength"
            v-model="val" 
        />


    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Limitlength from './mixins/MixinLimitlength.js';

    const DELAY = 1000;

    export default {

        mixins : [ Limitlength ],

        props : {
            daoId : { type : Number, default : null },
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            delay : { type : Number, default : DELAY },
            callbackdone : { type : Function, default : function(message) { /*console.log(message);*/ }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
            isLink : { type : Boolean, default: false },
            limitChars : { type : Number, default: 0 },
        },

        data : function() {
            return {
                val : '',
                old : '',
                text : '',
                editmode : false,
                fberror : false,
                fbdone : false,
                isOver : ! this.onHover,
                limit : this.limitChars,
            }
        },

        mounted : function() {
            this.val = this.old = this.$refs.text.textContent.trim();
            this.setPlaceholder();
        },

        computed : {
            getLink() {
                if (this.val.substring(0,3) == 'http') {
                    return this.val;
                } else if (/\S+@\S+\.\S+/.test(this.val)) {
                    return 'mailto:' + this.val;
                } else {
                    return 'http://' + this.val;
                }
            }
        },

         methods : {
            setPlaceholder : function() {
                if (this.val == '' && this.placeholder != '') {
                    this.$refs.text.innerHTML = '<span class="placeholder">'+this.placeholder+'</span>';
                }
            },
            edit : function() {
                this.editmode = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },
            leave : function() {
                // prevents double execution on blur
                if ( ! this.editmode) {
                    return;
                }
                this.editmode = false;
                this.$nextTick(function() {
                   this.$refs.text.textContent = this.val;
                   // store
                   this.store();
                   this.setPlaceholder();
                });
            },
            reset : function() {
                this.editmode = false;
                this.val = this.old;
                this.$nextTick(function() {
                   this.$refs.text.textContent = this.old;
                   this.setPlaceholder();
                });
            },
            store : function() {
                // save only changes
                if (this.val != this.old) {
                    // http-request
                    var data = {};
                    data.id = this.daoId;
                    data[this.name] = this.val;
                    var me = this;
                    Axios.put(this.href, data)
                        .then(function (response) {
                            me.fbdone = true;
                            me.cleardone();
                            // rember new
                            me.old = me.val;
                            me.callbackdone(response);
                        })
                        .catch(function (error) {
                            me.fberror = true;
                            me.clearerror();
                            // restore old
                            me.reset();
                            me.callbackerror(error);
                        });
                }
            },
            clearerror : function () {
                _.delay(function (me) {
                    me.fberror = false;
                }, this.delay, this);
            },
            cleardone : function () {
                _.delay(function (me) {
                    me.fbdone = false;
                }, this.delay, this);
            },
            showEditicon(onoff) {
                if ( ! this.onHover ) return;
                this.isOver = onoff;
            }
        }

    }
</script>

<style lang="scss">

    .edit-line {

        transition: background-color 0.5s;
        background-color:transparent;
        position:relative;

        &.done {
            background-color: #b0dac2;
        }

        &.error {
            background-color: #dab0c7;
        }

        .editicon {
            display:inline-block;
            font-size:60%;
            position:relative;
            top:-10px;
        }

        a {
            cursor:pointer;
        }

        input {
            width:100%;
            height:100%;
            font-size:100%;
        }

        .placeholder {
            color:lightgrey;
        }

        /* for MixinLimitlength */

        .charlimiter {
            background-color:lightgrey;
            max-width:50px;
            padding:5px;
            font-size:.6em;
            position:absolute;
            right:5px;
            top:1px;

            &.running-out {
                color:red;
            }

            &.ran-out {
                color:inherit;
                background-color:red;
            }

        }

    }

 </style>
