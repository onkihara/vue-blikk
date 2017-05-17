<template>
    <span :class="status" :style="[styleerror, styledone]" class="edit-typeahead">
    
        <span ref="text" v-if="!editmode">
            <slot></slot>
        </span>

        <a v-if="!editmode" @click="edit" class="">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <typeahead 
            ref="input" 
            v-if="editmode" 
            @blur="leave" 
            @keydown.enter.stop="leave"
            @reset="reset"
            @keydown.esc.stop="reset"
            v-model="val"
            :async="async"
            :data="data"
            :asyncKey="asyncKey"
            :limit="limit"
            :matchCase="matchCase"
            :matchStart="matchStart"
            :onHit="onHit"
            :template="template"
        ></typeahead>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Typeahead from './Typeahead.vue';

    const DELAY = 1000;
    const COLOR_ERROR = '#dab0c7';
    const COLOR_DONE = '#b0dac2';

    export default {

        components : {
            typeahead : Typeahead
        },

        props : {
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            delay : { type : Number, default : DELAY },
            colorerror : { type : String, default : COLOR_ERROR },
            colordone : { type : String, default : COLOR_DONE },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            // typeahead-props
            async: {type: String},
            data: {type: Array},
            asyncKey: {type: String, default: null},
            limit: {type: Number, default: 8},
            matchCase: {type: Boolean, default: false},
            matchStart: {type: Boolean, default: false},
            onHit: {
              type: Function,
              default (item) { return item }
            },
            template: {type: String},
         },

        data : function() {
            return {
                val : '',
                old : '',
                text : '',
                editmode : false,
                styleerror : {},
                styledone : {},
                status : '',
                height : 0
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
                    this.setText(this.val);
                    // store
                    this.store();
                });
            },
            reset : function() {
                this.editmode = false;
                this.val = this.old;
                this.$nextTick(function() {
                    this.setText(this.old);
                });
            },
            store : function() {
                // save only changes
                if (this.val != this.old) {
                    // http-request
                    var data = {};
                    data[this.name] = this.br ? this.val.replace(/<br\s?\/?>/g,'\n') : this.val;
                    var me = this;
                    Axios.put(this.href, data)
                        .then(function (response) {
                            me.styleerror['backgroundColor'] = me.colordone;
                            me.status = 'done';
                            me.cleardone();
                            // remember new
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
            setText : function(value) {
                if (this.br) {
                    this.$refs.text.innerHTML = value.replace(/\n/g,'<br />');
                } else {
                    this.$refs.text.textContent = value;
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

    .edit-typeahead {

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
            font-family:inherit;
            font-size:100%;
        }

    }

 </style>
