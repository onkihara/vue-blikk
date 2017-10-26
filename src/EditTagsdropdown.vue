<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-tagsdropdown" v-click-outside="leave" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)" @keydown.esc.stop="reset">
    
        <tag-list v-if="!editmode" ref="taglist" :data="tags"></tag-list>

        <a v-if="!editmode" @click.stop="edit" class="" v-show="isOver">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <tags-dropdown 
            ref="rtagsdropdown" 
            v-show="editmode" 
            :id="id" 
            :name="name" 
            :type="type" 
            :data="data" 
            :text="text" 
            :async="async"
            @added="update"
            @removed="update"
        >
            <slot></slot>
        </tags-dropdown>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Taglist from './Taglist.vue';
    import TagsDropdown from './TagsDropdown.vue';
    import ClickOutside from './directives/ClickOutside.js';

    const FBDELAY = 1000;

    export default {

        directives: {
            ClickOutside
        },

        components : {
            'tag-list' : Taglist,
            'tags-dropdown' : TagsDropdown
        },

        props : {
            daoId : { type : String, default : '' },
            href : { type : String, default : '' },
            fbdelay : { type : Number, default : FBDELAY },
            callbackdone : { type : Function, default : function(message) { /*console.log(message);*/ }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
            // Tagsdropdown
            id: { type : String },
            name : { type : String, default : 'name' },
            type : { type: String, default: 'dropdown' }, // dropdown or dropup
            data : { type : Array, default : null }, // [ {value: 1, text: 'eins', selected:true}, {...} ]
            text : { type: String, default : '' }, // button-caption
            async : { type : String } // async-url für json-data
         },

        data : function() {
            return {
                val : [],
                old : [],
                tags : [],
                editmode : false,
                fberror : false,
                fbdone : false,
                isOver : ! this.onHover,
            }
        },

        mounted : function() {
            this.val = this.old = this.getTags();
            this.setTags(this.val);
        },

        methods : {
            edit : function() {
                this.editmode = true;
            },
            leave : function() {
                if ( ! this.editmode) {
                    return;
                }
                this.val = this.getTags();
                this.editmode = false;
                this.$nextTick(function() {
                    this.setTags(this.val);
                    // store
                    this.store();
                });
            },
            reset : function() {
                this.editmode = false;
                this.val = this.old;
                this.$nextTick(function() {
                    this.setTags(this.old);
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
            getTags() {
                return this.$refs.rtagsdropdown.tags;
            },
            setTags(value) {
                this.tags = value.map(v => v.text);
            },
            update(tag) {
                this.$nextTick(function() {
                    this.leave();
                });
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

    .edit-tagsdropdown {

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

    }

 </style>
