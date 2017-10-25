<template>
    <div  
        :class="{ error : fberror, done : fbdone }" 
        class="edit-qrcode" 
        :style="qrSize" 
        ref="eqrsize" 
        @mouseenter="showEditicon(true)"
        @mouseleave="showEditicon(false)"
    >
        
        <slide-away ref="slideaway" @opened="edit" @closed="doneContent" :locked="!isEditable">

            <div slot="front">
                <qr-code :width="width" :placeholder="placeholder" :title="title" :source="src" :download="download"></qr-code>
            </div>

           <span slot="right" v-html="editiconRight" v-show="isOver && isEditable"></span>

            <div :class="{ half : (viewContent && colorPicker) }" slot="back">

                <div v-if="viewContent" class="qrcontent form-group">
                    <textarea ref="input" class="form-control" @keyup.esc="esc" @blur="blur" v-model="content" :disabled="!editableContent"></textarea>
                </div>

                <compact-picker class="qrpicker" ref="colorpicker" v-if="colorPicker" :value="actColor" :palette="palette" @input="changeColor"></compact-picker>

            </div>

            <span slot="left" v-html="editiconLeft"></span>

        </slide-away>

        <div style="display:none;" ref="right"><slot name="edit"></slot></div>
        <div style="display:none;" ref="left"><slot name="done"></slot></div>
        <div style="display:none;" ref="content"><slot></slot></div>

    </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Qrcode from './Qrcode.vue'
    import Slideaway from './Slideaway.vue'
    import { Compact } from 'vue-color';

    const DELAY = 1000;
    const PALETTE = [
      '#F44E3B', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
      '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
      '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
    ];

    export default {

        components : {
            'qr-code' : Qrcode,
            'slide-away' : Slideaway,
            'compact-picker' : Compact
        },

        mounted() {
            // calc height
            if (this.width != 'auto') {
                this.qrSize = { width: this.width };
            }
            // fill editicon-slots
            this.editiconRight = this.$refs.right.innerHTML || '<span class="editicon">[edit]</span>';
            this.editiconLeft = this.$refs.left.innerHTML || '<span class="editicon">[done]</span>';
            this.content = this.oldcontent = this.sanitize(this.$refs.content.textContent);
        },

        props : {
            // qrcode-props
            title : { type : String, default : 'qrcode' },
            source : { type : String, default : '' },
            download : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // edit-qrcode-props
            isEditable : { type : Boolean, default: true },
            width : { type : String, default : 'auto' },
            name : { type : String, default : 'qrcode' },
            daoId : { type : String, default : '' },
            generator : { type : String, default : '' },
            onBlur : { type : Boolean, default: false },
            storeOnExit : { type : Boolean, default: true },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
            viewContent : { type : Boolean, default: true },
            editableContent : { type : Boolean, default: true },
            colorPicker : { type : Boolean, default: false },
            color : { type : String, default: '#000000' },
            palette : { type : Array, default() { return PALETTE; } }
         },

        data() {
            return {
                src : this.source,
                qrSize : '',
                editiconRight : '',
                editiconLeft : '',
                content : '',
                oldcontent : '',
                actColor : this.color,
                fberror : false,
                fbdone : false,
                isOver : ! this.onHover,
            }
        },

        watch : {

        },

        computed : {
        },

        methods : {

            sanitize(text) {
                return _.trim(text);
            },

            store() {
                var data = {};
                data['id'] = this.daoId;
                data[this.name] = this.content;
                data['color'] = this.actColor;
                this.$emit('done',data);
                // save only changes
                Axios.put(this.generator, data)
                    .then((response) => {
                        this.fbdone = true;
                        this.cleardone();
                        // remember new
                        this.oldcontent = this.content;
                        // set new src with uniqid
                        if (response.data.src) {
                            this.setSource(response.data.src);
                        }
                        this.esc();
                        this.callbackdone(response);
                    })
                    .catch((error) => {
                        this.fberror = true;
                        this.resetColor();
                        this.clearerror();
                        // restore old
                        this.esc();
                        this.callbackerror(error);
                    });
            },

            doneContent() {
                if ( ! this.storeOnExit || this.generator == '' || ! this.editableContent) {
                    return;
                }
                if ( this.content == this.oldcontent ) {
                    return;
                }
                this.store();
            },

            changeColor(color) {
                // something to do?
                if (color.hex == this.actColor) {
                    return;
                }
                this.actColor = color.hex
                this.store();
            },

            setSource(src) {
                src = src || this.src;
                var divider = /\?/.test(src) ? '&' : '?';
                this.src = src + divider + 'uuid=' + _.uniqueId();
            },

            refresh(content, source) {
                this.content = this.oldcontent = content;
                this.setSource(source);
            },

            // events

            edit() {
                if (this.viewContent) {
                    this.$refs.input.focus();
                    this.$emit('edit',this.content);
                }
            },

            esc() {
                this.content = this.oldcontent;
                this.resetColor();
                this.$refs.slideaway.closeSilently();
            },

            blur() {
                if (this.onBlur) {
                    this.$refs.slideaway.close();
                }
            },

            resetColor() {
                this.actColor = this.color;

            },

            // callbacks

            clearerror () {
                _.delay(function (me) {
                    me.fberror = false;
                }, this.fbdelay, this);
            },

            cleardone () {
                _.delay(function (me) {
                    me.fbdone = false;
                }, this.fbdelay, this);
            },
         
            showEditicon(onoff) {
                if ( ! this.onHover ) return;
                this.isOver = onoff;
            }

        },

    }
</script>

<style lang="scss">

    .edit-qrcode {

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

        .back > div, .back > div > div {
            height:100%;
        } 

        .back > div.half > div {
            height:50%;
        }

        .qrcontent {
            margin:auto;
            padding-top:45px;
            textarea {
                height:100%;
            }
        }

        .qrpicker {
            margin-top:45px;
            &.vc-compact {
                width:100%;
                border:0;
                background:transparent;
                box-shadow:none;
                padding:0;

                .vc-compact-colors {
                    display:flex;
                    flex-wrap:wrap;
                    justify-content:center;

                    .vc-compact-color-item {
                        width:12%;
                        padding-top:12%;
                        margin:2%;
                    }
                }
            }
        }

        .back > div.half .qrpicker {
            margin-top:3px;
        }
    }

 </style>
