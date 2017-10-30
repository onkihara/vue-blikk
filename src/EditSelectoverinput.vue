<template>
    <span :class="{ error : fberror, done : fbdone }" class="edit-selectover" v-click-outside="leave" @mouseenter="showEditicon(true)" @mouseleave="showEditicon(false)">
    
        <span class="edit-selectover-content selector-item" v-show="editmode || !editmode" :class="[getSelectorClass, {'is-placeholder' : isPlaceholder}]" ref="content">
            <component :is="templateComp" :item="getContent"></component>
        </span>

        <a v-if="!editmode" @click.stop="edit" v-show="isOver && isEditable">
            <slot name="editicon"><span class="editicon">[edit]</span></slot>
        </a>

        <div ref="options" style="display:none"><slot></slot></div>

        <ul class="selector-container" v-if="editmode" :style="position" ref="list">
            <li v-for="(item, i) in items" :class="['selector-item', classPrefix + keys[i], i === index ? 'active' : '']">
                <a @click.prevent="clicked(i)">
                    <component :is="templateComp" :item="item" :key="keys[i]"></component>
                </a>
            </li>
        </ul>

    </span>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import ClickOutside from './directives/ClickOutside.js';

    const FBDELAY = 1000;

    export default {

        directives: {
            ClickOutside
        },

        props : {
            // edit-selectover
            isEditable : {type: Boolean, default: true },
            daoId : { type: Number, default : null},
            placeholder: {type: String, default : 'select ...' },
            classPrefix : { type : String, default : 'selectover-item-' },
            name : { type : String, default : 'selectover' },
            value : { default : ''},
            data: { }, // object or array or string (async-url)
            template : { type : String, default : null },
            href : { type : String, default : '' },
            fbdelay : { type : Number, default : FBDELAY },
            callbackdone : { type : Function, default : function(message) { /*console.log(message);*/ }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
       },

        data() {
            return {
                index : this.getIndex(),
                old : this.getIndex(),
                items : [],
                keys : [],
                editmode : false,
                isPlaceholder : false,
                fberror : false,
                fbdone : false,
                isOver : ! this.onHover,
                position : { top : '0px', left : '0px' },
            }
        },

        mounted() {
            // set items
            this.setItems();
         },

        computed : {
            getContent() {
                let content = '';
                if (this.index > -1 && this.items[this.index]) {
                    content = this.items[this.index];
                } else {
                    content = this.placeholder;
                }
                return content;
            }, 
            getSelectorClass() {
                 if (this.index > -1 && this.keys[this.index]) {
                    return this.classPrefix + this.keys[this.index];
                }
            },
            templateComp () {
                return {
                    template: typeof this.template === 'string' ? '<span>' + this.template + '</span>' : '<span v-html="item"></span>',
                    props: { item: {default: ''} }
                }
            }
        },

        methods : {
            clicked(index) {
                if (!this.isEditable) {
                    return;
                }
                this.index = index;
                this.editmode = false;
                this.isOver = false;
                this.store();
            },
            edit() {
                this.editmode = true;
                this.$nextTick(() => {
                    this.calcPosition();
                });
            },
            leave() {
                if ( ! this.editmode) {
                    return;
                }
                this.editmode = false;
                this.isOver = false;
                this.$nextTick(function() {
                    // store
                    this.store();
                });
            },
            reset() {
                this.editmode = false;
                this.index = this.old;
            },
            getIndex() {
                let foundindex = -1;
                _.forEach(this.keys, (key, index) => {
                    if (key === this.value) {
                        foundindex = index;
                    }
                });
                return foundindex;
            },
            calcPosition() {
                // find active list-item-position
                let items = this.$refs.list.children;
                let listelement = null;
                if (items.length > 0) {
                    _.forEach(items, (item, index) => {
                        if (_.intersection(_.words(item.className), ['active']).length > 0) {
                            listelement = item;
                        }
                    });
                }
                if (listelement) {
                    let rect = listelement.getBoundingClientRect();
                    let target = this.$refs.list.getBoundingClientRect();
                    // correct padding
                    let cstyle = window.getComputedStyle(listelement.children[0], null);
                    let ptop = parseFloat(cstyle.getPropertyValue('padding-top'));
                    let pleft =  parseFloat(cstyle.getPropertyValue('padding-left'));
                    let mtop = parseFloat(cstyle.getPropertyValue('margin-top'));
                    let mleft =  parseFloat(cstyle.getPropertyValue('margin-left'));
                    this.position.top = (target.top - rect.y - ptop - mtop) + 'px';
                    this.position.left = (target.left - rect.x - pleft - mleft) + 'px';
                    // console.log(this.position.top, this.position.left);
                }
            },
            setItems(items) {
                items = items || this.data;
                this.items = [];
                this.keys = [];
                let options = this.$refs.options.children;
                if (_.isString(items) && items !== '') {
                    this.getAsyncData(items);
                } else if (_.isArray(items)) {
                    this.items = this.keys = items;
                } else if (_.isObject(items)) {
                    _.forEach(items, (val, key) => {
                        this.items.push(val);
                        this.keys.push(key);
                    });
                } else if (options.length > 0) {
                    _.forEach(options, (option) => {
                        this.items.push(option.innerText);
                        this.keys.push(option.value);
                    });
                }
                // set the index
                this.old = this.index = this.getIndex();
            },
            getAsyncData(requesturl) {
                Axios.get(requesturl)
                    .then((response) => {
                        let data = response.data;
                        if (_.isString(data)) data = JSON.parse(data);
                        if (_.isObject(data)) {
                            this.setItems(data);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            store() {
                // save only changes
                if (this.index != this.old) {
                    // http-request
                    let data = {};
                    data['id'] = this.daoId;
                    data[this.name] = this.keys[this.index];
                    if ( ! this.href ) {
                        console.log(data);
                        return;
                    }
                    Axios.put(this.href, data)
                        .then((response) => {
                            this.fbdone = true;
                            this.cleardone();
                            // rethismber new
                            this.old = this.index;
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

    .edit-selectover {

        transition: background-color 0.5s;
        background-color:transparent;
        position:relative;

        .edit-selectover-content {
            position:relative;
        }

        .is-placeholder {
            color: lightgrey;
        }

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

        ul {
            position:absolute;
            background-color:white;
            border:1px solid grey;
            z-index:1001;
            padding:0;
            margin:0;
            & > li {
                list-style-type: none;
                a {
                    display:inline-block;
                    width:100%;
                    padding:5px;
                    &:hover {
                        background-color:lightgrey;
                        color:inherit;
                        text-decoration:none;
                    }
                }
                &.active {
                    background-color:lightgrey;
                }
            }
        }
    }

 </style>
