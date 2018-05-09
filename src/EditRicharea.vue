<template>
    <div :class="{ error : fberror, done : fbdone }" class="edit-area" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)">
    
        <div class="edit-area-text" ref="text" v-if="!editmode">
            <slot></slot>
        </div>

        <a v-if="!editmode" @click.stop.prevent="edit" class="editicon" v-show="isOver">
            <slot name="editicon"><span>[edit]</span></slot>
        </a>

        <span class="charlimiter" :class="runningOut" v-if="limitChars > 0 && editmode" v-text="limit"></span>

        <rich-area
            :noinit="true"
            :height="minHeight" 
            :width="width"
            :asset-url="assetUrl"
            :init="init"
            :save="save_callback"
            :file="file_callback"
            ref="input" 
            v-if="editmode" 
            :placeholder="placeholder"
            @blur="leave" 
            @esc="reset"
            @change="change"
         ></rich-area>

    </div>
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
            name : { type : String, default : 'rich-edit' },
            href : { type : String, default : '' },
            delay : { type : Number, default : DELAY },
            width : { type : String, default : '' },
            height : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // tinymce config vars
            assetUrl : { type : String, default : ''},          // base url for skins und langs
            init : { type: Object },                            // tinymce init-vars
            save : { default: null },                           // Callable oder Boolean (true => leave())
            file : { default : null },                          // Callable oder Boolean (true => getFile())
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
                save_callback : null,
                file_callback : null,
            }
        },

        mounted : function() {
            this.setText();
            this.old = this.val;
            this.$nextTick(function() {
                if (this.save === true) {
                    this.save_callback = this.leave;
                } else if (_.isFunction(this.save)) {
                    this.save_callback = this.save;
                }
                this.file_callback = this.file;
            });
        },

        methods : {
            setText(text) {
                if (text) {
                    this.val = text;
                    this.$refs.text.innerHTML = text;
                } else {
                    this.val = this.$refs.text.innerHTML || '';
                }
                if (this.val != '') { 
                    this.minheight = this.$refs.text.offsetHeight + 'px';
                } else {
                    this.$refs.text.innerHTML = '<span class="placeholder">'+this.placeholder+'</span>';
                    this.minHeight = this.height;
                }
                if (this.limitChars > 0) {
                    this.trimText();
                }
            },
            edit : function() {
                this.editmode = true;
                this.$nextTick(function() {
                    this.$refs.input.inittinymce();
                    this.$refs.input.setContent(this.val);
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
                this.val = this.old;
                this.editmode = false;
                this.$nextTick(function() {
                    this.setText(this.val);
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
            },
            getLength(content) {
                if (content) {
                    try {
                        var doc = new DOMParser().parseFromString(content, 'text/html');
                        return doc.body.textContent.length || 0;
                    } catch (error) {
                        return content.length;
                    }
                } 
                return this.$refs.text ? this.$refs.text.textContent.trim().length : 0;
            },
            trimText() {
                this.$refs.text.innerHTML = this.$refs.text.innerHTML.trim().substring(0,this.limitChars);
            },
            change(content,event) {
                this.val = content;
            },
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

        .edit-area-text {
            
        }

        a.editicon {
            display:block;
            font-size:60%;
            position:absolute;
            top:-15px;
            height:15px;
            line-height:15px;
            right:5px;
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
            z-index:1;

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
