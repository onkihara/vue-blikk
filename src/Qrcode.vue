<template>
    <div class="qr-code">
        
        <a ref="qrimage" class="qrfield" :href="source" :title="title" :style="qrStyle"></a>
        
        <textarea class="form-control" :placeholder="placeholder" :name="name" v-model="val" :style="{ height: textareaHeight }"></textarea>

    </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';

    const DELAY = 1000;

    export default {

        mounted : function() {
            // textareaheight
            this.textareaHeight = this.matchHeight ? this.$refs.qrimage.offsetHeight + 'px' : null;
            // initial value
            this.val = this.$slots.default ? _.trim(this.$slots.default[0].text) : '';
            // initial render or placeholder
            this.source = this.qrSource ? this.qrSource : this.qrPlaceholder;      
        },

         props : {
            name : { type : String, default : 'qrcode' },
            title : { type : String, default : 'Download' },
            placeholder : { type : String, default : 'QR-Code-Content' },
            qrSource : { type : String, default : '' },
            qrGenerator : { type : String, default : '' },
            qrPlaceholder : { type : String, default : '' },
            delay : { type : Number, default: DELAY },
            matchHeight : { type : Boolean, default : true },
         },

        data : function() {
            return {
                val : '',
                textareaHeight : '',
                source : ''
             }
        },

        watch : {

            val(val, old) {
                if (val === old) return;
                this.update();
            }

        },

        computed : {

            qrStyle() {
                return {
                    backgroundImage : 'url(' + this.source + ')'
                }
            }

        },

        methods : {
         
        },

        created() {
            // create the update-function debounced
            this.update = _.debounce(function () {
                // nothing to do
                if ( ! this.val) return;
                // get qr-code
                var vm = this;
                var data = [];
                data[this.name] = this.val;
                // debug-mode
                if (this.qrGenerator == 'debug') {
                    console.log(data); return;
                }
                axios.post(this.qrGenerator, data)
                .then(function (response) {
                    console.log(response.data);
                }).catch(function (error) {
                    console.log(error);
                });
            }, this.delay);
        }

    }
</script>

<style lang="scss">

    .qr-code {
        width:50%;
        height:150px;
        margin:auto;

        textarea {
            display:block;
            width:55%;
        }

        a {
            float:left;
            display:block;
            margin-right:5%;
            background-color:lightgrey;
            width:40%;
            height:0;
            padding-bottom:40%; /* maintains aspect ration */
            text-align:center;
            background-align:center;
            background-size:contain;
        }

    }

 </style>
