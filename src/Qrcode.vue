<template>
    <div class="qr-code" :style="qrHeight" ref="qrcode">
        
        <a ref="qrimage" class="qrfield" :href="download" :title="title" :style="qrStyle" @click="clicked($event)"></a>

    </div>
</template>

<script>
    
    export default {

        mounted : function() {
            // calc height
            if (this.width != 'auto') {
                this.qrHeight = { width: this.width };
            }
            // initial render or placeholder
            this.src = this.source ? this.source : this.placeholder;      
        },

         props : {
            width : { type : String, default : 'auto' },
            title : { type : String, default : 'qrcode' },
            source : { type : String, default : '' },
            download : { type : String, default : '' },
            isLightbox : { type : Boolean, default : false },
            placeholder : { type : String, default : '' },
         },

        data : function() {
            return {
                src : '',
                qrHeight : '',
                modalOpen : false
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
                if (this.isLightbox && this.source != '') { 
                    ev.preventDefault();
                    this.lightUp();
                } 
                if (this.download == '') { 
                    ev.preventDefault();
                }
                // else default-event
            },

            // appends overlay to body
            lightUp() {
                this.$emit('light',this.source);
                var div = document.createElement('div');
                div.setAttribute('id','qr-code-lightbox-id');
                div.className = 'qr-code-lightbox';
                div.innerHTML = '<div><img src="' + this.source + '" /></div>';
                document.body.appendChild(div);
                document.getElementById('qr-code-lightbox-id').addEventListener('click',
                    function() {
                        var element = document.getElementById("qr-code-lightbox-id");
                        element.parentNode.removeChild(element); 
                    }
                );
            },

        },

    }
</script>

<style lang="scss">

    div.qr-code-lightbox {
        position:fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        background-color:rgba(0,0,0,.4);
        z-index:1050;
        display:flex;
        justify-content: center;

        &:before {
            font-family: 'Glyphicons Halflings';
            content:"\e014";
            position:absolute;
            top:10px;
            right:18px;
            font-size:1.5em;
            color:white;
            cursor:pointer;
        }
        
        > div {
            display:block;
            align-self:center;
            background-color:white;
            border:3em solid white;

            img {
                width:100%;
                height:auto;
            }
        }

    }

    .qr-code {
        margin:auto;
        width:100%;
        position:relative;

        &:before{
            content: "";
            display: block;
            padding-top: 100%;  /* initial ratio of 1:1*/
        }

        a.qrfield {
            position:  absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
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
