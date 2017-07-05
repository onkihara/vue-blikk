<template>
    <div class="edit-qrcode" :style="qrSize" ref="eqrsize">
        
        <slide-away>

            <div slot="front">
                <qr-code :width="width" :placeholder="placeholder" :title="title" :source="source" :href="href"></qr-code>
            </div>

            <slot name="editicon"><span slot="right"><span class="editicon">[edit]</span></span></slot>

            <div slot="back">
                <h2>Back-Slot</h2>
            </div>

            <span slot="left">--&gt;</span>

        </slide-away>
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
        },

         props : {
            // qrcode-props
            title : { type : String, default : 'qrcode' },
            source : { type : String, default : '' },
            href : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // edit-qrcode-props
            width : { type : String, default : 'auto' },

         },

        data : function() {
            return {
                qrSize : ''
            }
        },

        watch : {

        },

        computed : {

 
        },

        methods : {
         
        },

        created() {
            // create the update-function debounced
            // this.update = _.debounce(function () {
            //     // nothing to do
            //     if ( ! this.val) return;
            //     // get qr-code
            //     var vm = this;
            //     var data = [];
            //     data[this.name] = this.val;
            //     // debug-mode
            //     if (this.qrGenerator == 'debug') {
            //         console.log(data); return;
            //     }
            //     axios.post(this.qrGenerator, data)
            //     .then(function (response) {
            //         console.log(response.data);
            //     }).catch(function (error) {
            //         console.log(error);
            //     });
            // }, this.delay);
        }

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
    }

 </style>
