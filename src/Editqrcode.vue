<template>
    <div  :class="{ error : fberror, done : fbdone }" class="edit-qrcode" :style="qrSize" ref="eqrsize">
        
        <slide-away ref="slideaway">

            <div slot="front">
                <qr-code :width="width" :placeholder="placeholder" :title="title" :source="src" :download="download"></qr-code>
            </div>

           <span slot="right" v-html="editiconRight" @click="edit"></span>

            <div slot="back">
                <div class="form-group">
                    <textarea class="qrcontent form-control" @keyup.esc="esc" @blur="done" v-model="content"></textarea>
                </div>
            </div>

            <span slot="left" v-html="editiconLeft" @click="done"></span>

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

    const DELAY = 1000;

    export default {

        components : {
            'qr-code' : Qrcode,
            'slide-away' : Slideaway
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
            this.content = this.oldcontent = this.sanitize(this.$refs.content.textContent);
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
         },

        data : function() {
            return {
                src : '',
                qrSize : '',
                editiconRight : '',
                editiconLeft : '',
                content : '',
                oldcontent : '',
                fberror : false,
                fbdone : false
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
                            if (response.src) {
                                var divider = /\?/.test(response.src) ? '&' : '?';
                                this.src = response.src + divider + 'uuid=' + _.uniqueId();
                            }
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

            // events

            edit() {
                this.$emit('edit',this.content);
            },

            esc() {
                this.content = this.oldcontent;
                this.$refs.slideaway.close();
            },

            done() {
                this.$refs.slideaway.close();
                this.store();
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

        .back > div, .back > div > div, .qrcontent {
            height:100%;
        }

        .qrcontent {
            max-width:$size;
            max-height:$size;
            margin:auto;
            padding-top:45px;
        }
    }

 </style>
