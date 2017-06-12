<template>
    <div class="edit-geo-coordinates">

        <div class="geo-edit" v-if="!editor">

            <slot>
                <span class="geo-coords">
                    <label>{{ labelLat }}</label>: <span>{{ lat }}</span>
                </span>            
                <span class="geo-coords">
                    <label>{{ labelLong }}</label>: <span>{{ long }}</span>
                </span>            
            </slot>

            <a @click="edit" class="">
                <slot name="editicon"><span class="editicon">[edit]</span></slot>
            </a>

        </div>

        <geo-input
            v-show="editor"
            ref="geoinput"
            :name-long="nameLong" 
            :name-lat="nameLat" 
            :name-format-type="nameFormatType"
            :placeholder-long="placeholderLong" 
            :placeholder-lat="placeholderLat"
            :label-long="labelLong" 
            :label-lat="labelLat"
            :longitude="long" 
            :latitude="lat"
            :airts="airts" 
            :coordtype="coordtype"
            :btn-text = "btnText"
            :usemap="usemap" 
            :apilat="apilat" 
            :apilong="apilong"
            :apizoom="apizoom"
            :precision="precision"
            :apititle="apititle"
            :apiok="apiok" 
            :apicancel="apicancel"
            :apireset="apireset"
            :text-map="textMap"
            :icon-map="iconMap"
            @esc="esc"
        ></geo-input>   
     
    </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Geocoordinatesinput from './Geocoordinatesinput.vue';

    const NUM = 1;
    const EXP = 8; // Nachkommastellen export default {

    export default {

        components : {
            'geo-input' : Geocoordinatesinput
        },

        mounted() {
            // get right formats
            var coords = this.$refs.geoinput.getFormatted(this.latitude,this.longitude,this.coordtype);
            this.setCoords(coords);
            // show input if void
            if (typeof this.lat == 'undefined' && this.autoEdit) {
                this.editor = true;
            }
        },

        watch : {

          
        },

         props : {
            // coordinates properties
            nameLong : { type : String, default : 'long' },
            nameLat : { type : String, default : 'lat' },
            nameFormatType : { type : String, default : 'type' },
            labelLong : { type : String, default : 'Longitude' },
            labelLat : { type : String, default : 'Latitude' },
            placeholderLong : { type : String, default : 'Longitude' },
            placeholderLat : { type : String, default : 'Latitude' },
            longitude : { type : String, default : '' },
            latitude : { type : String, default : '' },
            airts : { type : String, default: 'N,E,S,W' },
            btnText : { type : String, default : 'Formats'},
            coordtype : { type : String, default : NUM.toString() },
            precision : { type : String, default : EXP.toString() },
            textMap : { type : String, default : 'Map'},
            iconMap : { type : String, default : ''},
            // google-api properties
            usemap : { type : Boolean, default: false },
            apilat : { type : String, default : '46.49942984' },
            apilong : { type : String, default : '11.3416598' },
            apizoom : { type : String, default : '8' },
            apititle : { type : String, default : 'Choose coordinates ...' },
            apicancel : { type : String, default : 'Cancel' },
            apiok : { type : String, default : 'Save' },
            apireset : { type : String, default : 'Reset'},
            // editor
            autoEdit : { type : Boolean, default: true }
        },

        data : function() {
            return {
                editor : false,
                lat : null,
                long : null,
                oldlat : null,
                oldlong : null,
                type : this.coordtype
            }
        },

        methods : {

            edit() {
                this.editor = ! this.editor;
                if (this.editor && this.oldlat) {
                    this.lat = this.oldlat;
                    this.long = this.oldlong;
                }
            },

            esc() {
                this.lat = this.oldlat;
                this.long = this.oldlong;
                this.editor = false;
            },

            setCoords(coords) {
                this.oldlat = this.lat = coords.lat;
                this.oldlong = this.long = coords.long;
            }

        }
    }
</script>

<style lang="scss">
    .edit-geo-coordinates {

        .geo-edit {
            max-width:50%;
            margin:auto;
            position:relative;
            
           .geo-coords {
                display:block;
                font-size:110%;
            }

            .editicon {
               display:inline-block;
                font-size:90%;
                position:absolute;
                right:0px;
                top:0px;
                cursor:pointer;
            }

        }

 
    }


 </style>
