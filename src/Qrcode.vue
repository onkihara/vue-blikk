<template>
    <div class="qr-code">
        
        
    </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';

    export default {

         props : {
            name : { type : String, default : 'name' }
         },

        data : function() {
            return {
                val : '',
                old : ''
            }
        },

        mounted : function() {
            
        },

        methods : {
            
        }

    }
</script>

<style lang="scss">

    .qr-code {

        

    }

 </style>
