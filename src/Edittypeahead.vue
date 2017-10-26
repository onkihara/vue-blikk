<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-typeahead" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)">
    
        <span ref="text" v-if="!editmode">
            <slot></slot>
        </span>

        <a v-if="!editmode" @click="edit" class="" v-show="isOver">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <typeahead 
            ref="input" 
            v-if="editmode" 
            @blur="leave" 
            @reset="reset"
            @keydown.esc.stop="reset"
            v-model="val"
            :async="async"
            :data="data"
            :async-key="asyncKey"
            :limit="limit"
            :delay="delay"
            :match-case="matchCase"
            :match-start="matchStart"
            :allow-new="allowNew"
            :on-hit="onHit"
            :template="template"
        ></typeahead>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Typeahead from './Typeahead.vue';

    const DELAY = 300;
    const FBDELAY = 1000;

    export default {

        components : {
            typeahead : Typeahead
        },

        props : {
            daoId : { type : String, default : '' },
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            fbdelay : { type : Number, default : FBDELAY },
            callbackdone : { type : Function, default : function(message) { /*console.log(message);*/ }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },            
            // typeahead-props
            async: {type: String},
            data: {type: Array},
            asyncKey: {type: String, default: null},
            limit: {type: Number, default: 8},
            delay: {type: Number, default: DELAY},
            matchCase: {type: Boolean, default: false},
            matchStart: {type: Boolean, default: false},
            allowNew : {type: Boolean, default: false},
            onHit: {
              type: Function,
              default (item) { return item }
            },
            template: {type: String},
            debug: {type: Boolean, default: false}
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
                if (this.debug) {
                    alert(this.val)
                }
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
                }, this.fbdelay, this);
            },
            cleardone : function () {
                _.delay(function (me) {
                    me.fbdone = false;
                }, this.fbdelay, this);
            },
            showEditicon(onoff) {
                if ( ! this.onHover ) return;
                this.isOver = onoff;
            }
        }

    }
</script>

<style lang="scss">

    .edit-typeahead {

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
            font-family:inherit;
            font-size:100%;
        }

    }

 </style>
