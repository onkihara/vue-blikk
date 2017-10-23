<template>
    <div  
        :class="{ error : fberror, done : fbdone }" 
        class="edit-qrcode" 
        :style="qrSize" 
        ref="eqrsize" 
        @mouseenter="showEditicon(true)"
        @mouseleave="showEditicon(false)"
    >
        
        <slide-away ref="slideaway" @opened="edit" @closed="done">

            <div slot="front">
                <qr-code :width="width" :placeholder="placeholder" :title="title" :source="src" :download="download"></qr-code>
            </div>

           <span slot="right" v-html="editiconRight" v-show="isOver"></span>

            <div :class="{ half : (editableContent && colorPicker) }" slot="back">

                <div v-if="editableContent" class="qrcontent form-group">
                    <textarea ref="input" class="form-control" @keyup.esc="esc" @blur="blur" v-model="content"></textarea>
                </div>

                <compact-picker class="qrpicker" ref="colorpicker" v-if="colorPicker" :value="color" :palette="palette" @input="changeColor"></compact-picker>

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

        mounted : function() {
            // calc height
            if (this.width == 'auto') {
                this.qrSize = { height : this.$refs.eqrsize.offsetWidth + 'px' };
            } else {
                this.qrSize = { width: this.width, height : this.width };
            }
            // fill editicon-slots
            this.editiconRight = this.$refs.right.innerHTML || '<span class="editicon">[edit]</span>';
            this.editiconLeft = this.$refs.left.innerHTML || '<span class="editicon">[done]</span>';
            if (this.editableContent) {
                this.content = this.oldcontent = this.sanitize(this.$refs.content.textContent);
            } 
            this.color =  this.defaultColor;
        },

        props : {
            // qrcode-props
            title : { type : String, default : 'qrcode' },
            source : { type : String, default : '' },
            download : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // edit-qrcode-props
            width : { type : String, default : 'auto' },
            name : { type : String, default : 'qrcode' },
            daoId : { type : String, default : '' },
            generator : { type : String, default : '' },
            onBlur : { type : Boolean, default: false },
            callbackdone : { type : Function, default : function(message) { console.log(message); }},
            callbackerror : { type : Function, default : function(error) { console.log(error); }},
            onHover : { type : Boolean, default: true },
            editableContent : { type : Boolean, default: true },
            colorPicker : { type : Boolean, default: false },
            defaultColor : { type : String, default: '#000000' },
            palette : { type : Array, default() { return PALETTE; } }
         },

        data : function() {
            return {
                src : this.source,
                qrSize : '',
                editiconRight : '',
                editiconLeft : '',
                content : '',
                oldcontent : '',
                color : '',
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

            store : function() {
                var data = {};
                data['id'] = this.daoId;
                data[this.name] = this.content;
                data['color'] = this.color;
                this.$emit('done',data);
                // save only changes
                if (this.content != this.oldcontent) {
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
                            this.callbackdone(response);
                        })
                        .catch((error) => {
                            this.fberror = true;
                            this.clearerror();
                            // restore old
                            this.esc();
                            this.callbackerror(error);
                        });
                } 
            },

            changeColor(color) {
                // something to do?
                if (color.hex == this.color) {
                    return;
                }
                this.color = color.hex
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
                if (this.editableContent) {
                    this.$refs.input.focus();
                    this.$emit('edit',this.content);
                }
            },

            esc() {
                this.content = this.oldcontent;
                this.$refs.slideaway.close();
            },

            done() {
                if (this.generator == '') {
                    return;
                }
                this.store();
            },

            blur() {
                if (this.onBlur) {
                    this.$refs.slideaway.close();
                    this.done();
                }
            },

            // callbacks

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

        },

    }
</script>

<style lang="scss">

    $size:400px;

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
            max-width:$size;
            max-height:$size;
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

                .vc-compact-colors {
                    display:flex;
                    flex-wrap:wrap;
                    justify-content:center;

                    .vc-compact-color-item {
                        width:35px;
                        height:35px;
                        margin:5px;
                    }
                }
            }
        }

        .back > div.half .qrpicker {
            margin-top:3px;
        }
    }

 </style>
