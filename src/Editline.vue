<template>
    <span :class="status" :style="[styleerror, styledone]" class="edit-line">
    
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
    const COLOR_ERROR = '#dab0c7';
    const COLOR_DONE = '#b0dac2';

    export default {

        props : {
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            delay : { type : Number, default : DELAY },
            colorerror : { type : String, default : COLOR_ERROR },
            colordone : { type : String, default : COLOR_DONE },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }}
        },

        data : function() {
            return {
                val : '',
                old : '',
                text : '',
                editmode : false,
                styleerror : {},
                styledone : {},
                status : ''
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
                            me.styleerror['backgroundColor'] = me.colordone;
                            me.status = 'done';
                            me.cleardone();
                            // rember new
                            me.old = me.val;
                            me.callbackdone(response);
                        })
                        .catch(function (error) {
                            me.styleerror['backgroundColor'] = me.colorerror;
                            me.status = 'error';
                            me.clearerror();
                            // restore old
                            me.reset();
                            me.callbackerror(error);
                        });
                }
            },
            clearerror : function () {
                _.delay(function (me) {
                    me.styleerror['backgroundColor'] = 'transparent';
                    me.status = '';
                }, this.delay, this);
            },
            cleardone : function () {
                _.delay(function (me) {
                    me.styledone['backgroundColor'] = 'transparent';
                    me.status = '';
                }, this.delay, this);
            }
        }

    }
</script>

<style lang="scss">

    .edit-line {

        transition: background-color 0.5s;
        background-color:transparent;

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
