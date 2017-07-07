<template>
    <div class="qr-code" :style="qrHeight" ref="qrcode">
        
        <a ref="qrimage" class="qrfield" :href="download" :title="title" :style="qrStyle" @click="clicked($event)"></a>
        
    </div>
</template>

<script>

    export default {

        mounted : function() {
            // calc height
            if (this.width == 'auto') {
                this.qrHeight = { height : this.$refs.qrcode.offsetWidth + 'px' };
            } else {
                this.qrHeight = { width: this.width, height : this.width };
            }
            // initial render or placeholder
            this.src = this.source ? this.source : this.placeholder;      
        },

         props : {
            width : { type : String, default : 'auto' },
            title : { type : String, default : 'qrcode' },
            source : { type : String, default : '' },
            download : { type : String, default : '' },
            placeholder : { type : String, default : '' },
         },

        data : function() {
            return {
                src : '',
                qrHeight : ''
             }
        },

        watch : {

            source(val, old) {
                if (val === old) return;
                this.src = this.source;
            }

        },

        computed : {

            qrStyle() {
                return { backgroundImage : 'url(' + this.src + ')' }
            },

        },

        methods : {

            clicked(ev) {
                this.$emit('click',ev);
                if (this.download == '') { ev.preventDefault() }
            }
         
        },

    }
</script>

<style lang="scss">

    $size:400px;

    .qr-code {
        max-width:$size;
        max-height:$size;
        margin:auto;

        a.qrfield {
            float:left;
            display:block;
            width:100%;
            height:100%;
            background-color:lightgrey;
            background-align:center;
            background-size:contain;
        }

    }

 </style>
