<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-line">
    
        <span ref="text" v-if="!editmode">
            <slot></slot>
        </span>

        <a v-if="!editmode" @click="edit" class="">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <input 
            ref="input" 
            v-if="editmode" 
            type="text" 
            @blur="leave" 
            @keydown.enter.stop="leave"
            @keydown.esc.stop="reset"
            v-model="val" 
        />

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';

    const DELAY = 1000;

    export default {

        props : {
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            delay : { type : Number, default : DELAY },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }}
        },

        data : function() {
            return {
                val : '',
                old : '',
                text : '',
                editmode : false,
                fberror : false,
                fbdone : false
            }
        },

        mounted : function() {
            this.val = this.old = this.$refs.text.textContent.trim();
        },

        methods : {
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
                });
            },
            reset : function() {
                this.editmode = false;
                this.val = this.old;
                this.$nextTick(function() {
                   this.$refs.text.textContent = this.old;
                });
            },
            store : function() {
                // save only changes
                if (this.val != this.old) {
                    // http-request
                    var data = {};
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
            }
        }

    }
</script>

<style lang="scss">

    .edit-line {

        transition: background-color 0.5s;
        background-color:transparent;

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

    }

 </style>
