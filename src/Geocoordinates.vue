<template>
    <div class="geo-coordinates">

        <div class="left">

            <div class="geo-coords">
                <label>{{ labelLat }}</label>: <span>{{ formattedLatitude }}</span>
            </div>            
            <div class="geo-coords">
                <label>{{ labelLong }}</label>: <span>{{ formattedLongitude }}</span>
            </div>   

        </div>

        <div class="right" v-if="useviewmap">
           <a slot="map-icon" @click.prevent="openModal">
                <span class="btn-map glyphicon glyphicon-globe">{{ iconMap }}</span>
                <span class="btn-text-map">{{ textMap }}</span>
            </a>   
        </div>  

        <map-modal 
            v-model="apiOpen" 
            ref="mapmodal" 
            :latitude="lat" 
            :longitude="long" 
            :zoom="azoom"
            :disabled="true"
            :text-cancel="textCancel"
            @cancel="apiOpen = false"
            @ok="apiOpen = false"
        ></map-modal>
       
     </div>
</template>

<script>

    import Mapmodal from './Mapmodal.vue';

    const ZOOM = 8;
    
    export default {

        components : {
             'map-modal' : Mapmodal
        },

        props : {
            // coordinates properties
            labelLong : { type : String, default : 'Longitude' },
            labelLat : { type : String, default : 'Latitude' },
            formattedLongitude : { type : String, default : null },
            formattedLatitude : { type : String, default : null }, 
            longitude : { type : String, default : null },
            latitude : { type : String, default : null },
            zoom : { type : String, default : ZOOM.toString() },
            useviewmap : { type : Boolean, default : false },
            textMap : { type : String, default : 'Map'},
            iconMap : { type : String, default : ''},
            textCancel : { type : String, default : 'Cancel' }
         },

        data : function() {
            return {
                apiOpen : false,
                lat : null,
                long : null,
                azoom : null             
            }
        },

        methods : {
            openModal : function() {
                this.lat = parseFloat(this.latitude);
                this.long = parseFloat(this.longitude);
                this.azoom = parseInt(this.zoom);
                this.apiOpen = true;               
            }
        }

    }
</script>

<style lang="scss">

    .geo-coordinates {

        display:flex;

        .left {

            flex:3;

            .geo-coords {
                display:block;
                font-size:110%;
            } 
        }

        .right {  

            flex: 1;

             a {
                text-decoration: none;
                cursor:pointer;
                width:100%;
                display:flex;
                justify-content:left;
                align-items:center;

                .btn-map.glyphicon {
                    font-size: 3em;
                }

                .btn-text-map {
                    color:black;
                    margin:5px;
                }
            }
        }

         
    }

 </style>
