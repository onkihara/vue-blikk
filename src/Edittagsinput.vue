<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-tagsinput" v-click-outside="leave">
    
        <taglist v-if="!editmode" ref="taglist" :separator="separator" :quote="quote"><slot></slot></taglist>

        <a v-if="!editmode" @click.stop="edit" class="">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <tagsinput 
            ref="input" 
            v-if="editmode" 
            @reset="reset"
            @enter="leave"
            @keydown.esc.stop="reset"
            v-model="val"
            :quote="quote"
            :separator="separator"
            :async="async"
            :data="data"
            :async-key="asyncKey"
            :limit="limit"
            :delay="delay"
            :match-case="matchCase"
            :match-start="matchStart"
            :on-hit="onHit"
            :template="template"
            :allow-new="allowNew"
        ></tagsinput>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Tagsinput from './Tagsinput.vue';
    import Taglist from './Taglist.vue';
    import ClickOutside from './directives/ClickOutside.js';

    const DELAY = 300;
    const FBDELAY = 1000;
    const LIMIT = 8;

    export default {

        directives: {
            ClickOutside
        },

        components : {
            taglist : Taglist,
            tagsinput : Tagsinput
        },

        props : {
            name : { type : String, default : 'name' },
            href : { type : String, default : '' },
            fbdelay : { type : Number, default : FBDELAY },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            // taglist-props
            separator: {type: String, default: ','},
            quote: {type: Boolean, default: false},
            // tagsinput-props
            data: { type : Array },
            id: { type : String },
            name : { type : String },
            placeholder : {type: String },
            value :  { type : String, default : '' },
            allowNew : { type : Boolean, default : true },
            // typeahead
            onHit: {
                type: Function,
                default (item) { return item }
            },
            async : { type : String },
            data : { type : Array },
            delay : { type : Number, default : DELAY },
            asyncKey : { type : String, default : null },
            template: {type: String},
            limit : { type : Number, default : LIMIT},
            matchCase : { type : Boolean, default : false },
            matchStart : { type : Boolean, default : false }
         },

        data : function() {
            return {
                val : '',
                old : '',
                tags : [],
                text : '',
                editmode : false,
                fberror : false,
                fbdone : false
            }
        },

        mounted : function() {
            this.setTags(this.$slots.default[0].text);
            this.val = this.old = this.getTags(this.tags);
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
                this.val = this.getTags(this.$refs.input.tags);
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
            setText : function(value) {
                this.$refs.taglist.val = value;
            },
            getTags(tags) {
                if (this.quote) {
                    return tags.map(tag => '"'+tag+'"').join(this.separator);
                } else {
                    return tags.join(this.separator);
                }
            },
            setTags(tagstring) {
                var tags;
                if (this.quote) {
                    tags = tagstring.substr(1,tagstring.length-2).split(this.separator);
                    this.tags = tags.map(tag => tag.trim().replace(/^"+|"+$/g,''));
                } else {
                    tags = tagstring.split(this.separator);
                    this.tags = tags.map(tag => tag.trim());
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
            }
        }

    }
</script>

<style lang="scss">

    .edit-tagsinput {

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
