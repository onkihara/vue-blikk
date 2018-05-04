<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-area" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)">
    
        <span ref="text" v-if="!editmode">
            <slot></slot>
        </span>

        <a v-if="!editmode" @click.stop.prevent="edit" class="" v-show="isOver">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <span class="charlimiter" :class="runningOut" v-if="limitChars > 0 && editmode" v-text="limit"></span>

        <rich-area
            :noinit="true"
            :height="minHeight" 
            :width="width"
            :asset-url="assetUrl"
            :init="init"
            ref="input" 
            v-if="editmode" 
            :placeholder="placeholder"
            @blur="leave" 
            @keydown.esc.stop="reset"
            @keyup="limitLength"
         ></rich-area>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Limitlength from './mixins/MixinLimitlength.js';
    import Richarea from './Richarea.vue';

    const DELAY = 1000;

    export default {

        mixins : [ Limitlength ],

        components : {
            'rich-area' : Richarea
        },

       props : {
            daoId : { type : Number, default : null },
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            delay : { type : Number, default : DELAY },
            width : { type : String, default : '' },
            height : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // tinymce config vars
            assetUrl : { type : String, default : ''},          // base url for skins und langs
            init : { type: Object },                            // tinymce init-vars
            callbackdone : { type : Function, default : function(message) { /*console.log(message);*/ }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
        },

        data : function() {
            return {
                val : '',
                old : '',
                text : '',
                editmode : false,
                fberror : false,
                fbdone : false,
                minHeight : '',
                isOver : ! this.onHover,
            }
        },

        mounted : function() {
            // adjust height
            this.val = this.$refs.text.innerHTML || '';
            if (this.val != '') { 
                this.minheight = this.$refs.text.offsetHeight + 'px';
            } else {
                this.$refs.text.innerHTML = '<span class="placeholder">'+this.placeholder+'</span>';
                this.minHeight = this.height;
            }
        },

        methods : {
            edit : function() {
                this.editmode = true;
                this.$nextTick(function() {
                    this.$refs.input.inittinymce();
                    this.$refs.input.setContent(this.val);
                    //this.$refs.input.style.minHeight = this.minheight + 'px';
                    //this.$refs.input.focus();
                });
            },
            leave : function() {
                // prevents double execution on blur
                if ( ! this.editmode) {
                    return;
                }
                this.editmode = false;
                this.$nextTick(function() {
                    this.setText(this.val);
                    // store
                    this.store();
                    this.setPlaceholder();
                });
            },
            reset : function() {
                this.editmode = false;
                this.val = this.old;
                this.$nextTick(function() {
                    this.setText(this.old);
                    this.setPlaceholder();
                });
            },
            store : function() {
                // save only changes
                if (this.val != this.old) {
                    // http-request
                    var data = {};
                    data.id = this.daoId;
                    data[this.name] = this.br ? this.val.replace(/<br\s?\/?>/g,'\n') : this.val;
                    var me = this;
                    Axios.put(this.href, data)
                        .then(function (response) {
                            me.fbdone = true;
                            me.cleardone();
                            // remember new
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
            setText : function(value) {
                if (this.br) {
                    this.$refs.text.innerHTML = value.replace(/\n/g,'<br />');
                } else {
                    this.$refs.text.textContent = value;
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

    .edit-area {

        transition: background-color 0.5s;
        background-color:transparent;
        position:relative;
        display:block;

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

        textarea {
            width:100%;
            height:100%;
            font-family:inherit;
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
            right:2px;
            top:8px;

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
