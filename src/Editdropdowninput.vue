<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-dropdowninput" v-click-outside="leave" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)">
    
        <span v-if="!editmode" ref="content">{{ val }}</span>

        <a v-if="!editmode" @click.stop="edit" class="" v-show="isOver">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <dropdown-input 
            ref="input" 
            v-show="editmode" 
            :placeholder="placeholder"
            :btn-text="btnText"
            :data="data"
            :template="template"
            :disabled="disabled"
            :editable="editable"
            v-model="key"
            @esc="reset"
            @enter="leave"
            @selected="leave"
        >
            <slot></slot>
        </dropdown-input>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Dropdowninput from './Dropdowninput.vue';
    import ClickOutside from './directives/ClickOutside.js';

    const FBDELAY = 1000;

    export default {

        directives: {
            ClickOutside
        },

        components : {
            dropdownInput : Dropdowninput
        },

        props : {
            // dropdown
            daoId : { type: Number, default : null},
            btnText : { type: String, default : ''},
            data: {  }, // object or array or string (async-request-url)
            placeholder: {type: String},
            template: {type: String},
            value: {type: String, default: ''},
            disabled : {type: Boolean, default: false },
            editable : {type: Boolean, default: true },
            // edit-dropdown
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            fbdelay : { type : Number, default : FBDELAY },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
       },

        data : function() {
            return {
                key : this.value,
                old : this.value,
                val : '',
                editmode : false,
                fberror : false,
                fbdone : false,
                isOver : ! this.onHover,
            }
        },

        mounted : function() {
            this.val = this.$refs.input.getValue();
        },

        methods : {
            edit : function() {
                this.editmode = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },
            leave : function() {
                if ( ! this.editmode) {
                    return;
                }
                this.val = this.$refs.input.getValue();
                this.key = this.$refs.input.getKey();
                this.editmode = false;
                this.$nextTick(function() {
                    // store
                    this.store();
                });
            },
            reset : function() {
                this.editmode = false;
                this.key = this.old;
                this.$nextTick(function() {
                    this.val = this.$refs.input.getValue();
                });
            },
            store : function() {
                // save only changes
                if (this.key != this.old) {
                    // http-request
                    var data = {};
                    data['id'] = this.daoId;
                    data[this.name] = this.key;
                    if ( ! this.href ) {
                        console.log(data);
                        return;
                    }
                    Axios.put(this.href, data)
                        .then((response) => {
                            this.fbdone = true;
                            this.cleardone();
                            // rethismber new
                            this.old = this.key;
                            this.callbackdone(response);
                        })
                        .catch((error) => {
                            this.fberror = true;
                            this.clearerror();
                            // restore old
                            this.reset();
                            this.callbackerror(error);
                        });
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

    .edit-dropdowninput {

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
            font-family:inherit;
            font-size:100%;
        }

    }

 </style>
