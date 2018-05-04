<template>
    <div class="rich-area">

        <div ref="text" style="display:none" v-if="!initdone"><slot></slot></div>
        
        <textarea ref="input" :style="{width:width,height:height}" v-model="val"></textarea>

    </div>
</template>

<script>

    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    import _ from 'lodash';
    // import plugins
    import 'tinymce/plugins/paste'
    import 'tinymce/plugins/link'

    export default {

        mounted : function() {
            // initialize?
            if (this.noinit) {
                return;
            }
            // init tinymce
            this.inittinymce();
            // debug
            //console.log(tinymce.majorVersion + '.' + tinymce.minorVersion);
          },

         props : {
            width : { type : String, default : '' },
            height : { type : String, default : '' },
            placeholder : { type : String, default : '' },
            // tinymce config vars
            assetUrl : { type : String, default : ''},          // base url for skins und langs
            init : { type: Object },                            // tinymce init-vars
            noinit : { type : Boolean, default: false },        // prevent outomatic init
         },

        data : function() {
            return {
                initdone : false,
                val : '',
            }
        },

        watch : {

          
        },

        computed : {
            
        },

        methods : {
             inittinymce() {
                // init vars
                var initvars = this.init || {};
                //initvars.selector = 'textarea#' + this.selectorid;
                initvars.target = this.$refs.input;
                initvars.branding = false;
                if (this.assetUrl !== '') {
                    var skin = this.init.skin || 'lightgray';
                    initvars.skin_url = this.assetUrl + 'skins/' + skin;
                    this.init.language ? initvars.language_url = this.assetUrl + 'langs/' + this.init.language + '.js' : null;
                }
                console.log(initvars);
                // edit-mode oder placeholder (if any)
                this.setContent(this.$refs.text.innerHTML || this.placeholder);
                this.initdone = true;
                this.$nextTick(function() {
                    tinymce.init(initvars);
                });
           },
           setContent(content) {
                this.val = content;
           }, 

        },

    }
</script>

<style lang="scss">

   

 </style>
