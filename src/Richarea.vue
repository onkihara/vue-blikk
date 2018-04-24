<template>
    <div class="rich-area">
        
        <textarea :id="selectorid" ref="text"></textarea>

    </div>
</template>

<script>

    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    import _ from 'lodash';
    
    export default {

        mounted : function() {
            // apply unique-id and select as selector
            this.selectorid = _.uniqueId('tiny');
            tinymce.init({
                selector : '#' + this.selectorid
            });
        },

         props : {
            width : { type : String, default : 'auto' },
            placeholder : { type : String, default : '' },
         },

        data : function() {
            return {
               selectorid : '',
            }
        },

        watch : {

          
        },

        computed : {

           
        },

        methods : {

            

        },

    }
</script>

<style lang="scss">

   

 </style>
