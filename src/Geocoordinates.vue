<template>
    <div class="geo-coordinates">
        
        <div class="degbuttons">
            <button type="button" class="btn btn-small" @click="coordtype = 'num'" :class="{ 'btn-primary' : btns.num, 'btn-default' : !btns.num }">+/-</button>
            <button type="button" class="btn btn-small" @click="coordtype = 'deg'" :class="{ 'btn-primary' : btns.deg, 'btn-default' : !btns.deg }">°</button>
            <button type="button" class="btn btn-small" @click="coordtype = 'min'" :class="{ 'btn-primary' : btns.min, 'btn-default' : !btns.min }">° '</button>
            <button type="button" class="btn btn-small" @click="coordtype = 'sec'" :class="{ 'btn-primary' : btns.sec, 'btn-default' : !btns.sec }">° ' "</button>
        </div>
        
        <div class="form-group">
            <label for="long">{{ labelLong }}</label>
            <input :name="nameLong" v-model="longitude" type="text" class="form-control" id="long" :placeholder="placeholderLong">
        </div>

        <div class="form-group">
            <label for="lat">{{ labelLat }}</label>
            <input :name="nameLat" v-model="latitude" type="text" class="form-control" id="lat" :placeholder="placeholderLat">
        </div>

    </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';

    export default {

        mounted() {
            // determine type of input (longitude only)
            this.coordtype = 'deg';

        },

        watch : {
            coordtype : function(val,old) {
                if (val !== old) { this.recalc(val); }
            }
        },

         props : {
            nameLong : { type : String, default : 'long' },
            nameLat : { type : String, default : 'lat' },
            labelLong : { type : String, default : 'Longitude' },
            labelLat : { type : String, default : 'Latitude' },
            placeholderLong : { type : String, default : 'Longitude' },
            placeholderLat : { type : String, default : 'Latitude' },
            longitude : { type : String, default : '' },
            latitude : { type : String, default : '' },
         },

        data : function() {
            return {
                coordtype : 'num',
                long : 0,
                lat : 0,
                btns : { num : false, deg : false, min : false, sec : false }
            }
        },

        methods : {

            recalc : function(type) {
                // switch buttons
                _.forOwn(this.btns, (val, key) => { this.btns[key] = false; });
                this.btns[type] = true;
                // recalc

            }

        }

    }
</script>

<style lang="scss">

    .geo-coordinates {
        
        .degbuttons {
            text-align:right;
        }
        

    }

 </style>
