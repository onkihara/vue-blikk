<template>
    <div class="geo-coordinates">

        <div class="left">

            <div class="geo-coords">
                <label>{{ labelLat }}</label>: <span>{{ latitude }}</span>
            </div>            
            <div class="geo-coords">
                <label>{{ labelLong }}</label>: <span>{{ longitude }}</span>
            </div>   

        </div>

        <div class="right" v-if="useviewmap">
           <a slot="map-icon" @click.prevent="openModal">
                <span class="btn-map glyphicon glyphicon-globe">{{ iconMap }}</span>
                <span class="btn-text-map">{{ textMap }}</span>
            </a>   
        </div>  

       <!--  <modal v-model="apiOpen" ref="apimodal" @opened="mopened" class="apicontainer">

            <span slot="title">{{ apititle }}</span>

            <gmap-map class="mapcontainer" 
                ref="map" 
                map-type-id="roadmap" 
                :center="center" 
                :zoom="mzoom">
            </gmap-map>

            <div class="kimme"><span @click="mok" class="korn glyphicon glyphicon-screenshot"></span></div>

            <div slot="modal-footer" class="modal-footer"></div>

        </modal> -->
       

     </div>
</template>

<script>

    import Modal from './Modal.vue';
    import Vue from 'vue';
    import * as VueGoogleMaps from 'vue2-google-maps';

    const ZOOM = 8;
    const APILOADER = { load : { key : 'AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s'}}; // google-api-key

    if (window != 'undefined' && window.Vue) {
        window.Vue.use(VueGoogleMaps, APILOADER);
    } else {
        Vue.use(VueGoogleMaps, APILOADER);
    }

    export default {

        components : {
             //'modal' : Modal
        },

        mounted() {
            
          },

        watch : {

        },

         props : {
            // coordinates properties
            labelLong : { type : String, default : 'Longitude' },
            labelLat : { type : String, default : 'Latitude' },
            longitude : { type : String, default : '' },
            latitude : { type : String, default : '' },
            useviewmap : { type : Boolean, default : false },
            textMap : { type : String, default : 'Map'},
            iconMap : { type : String, default : ''},
            apizoom : { type : String, default : ZOOM.toString() },
         },

        data : function() {
            return {
                apiOpen : false,
                modalHeight : window.innerHeight - 30,
                mlat : '',
                mlong : '',
                mlatvalue : '',
                mlongvalue : '',
                center : {},
                mzoom : parseInt(this.apizoom),
              
            }
        },

        methods : {

            openModal : function() {
                this.apiOpen = true;
                this.$refs.apimodal.$refs.modaldialog.style.height = this.modalHeight + 'px';
             },

            mopened : function() {
                // trigger map resize after modal shown!
                google.maps.event.trigger(this.$refs.map.$mapObject, 'resize');
                this.minit();
            },

            minit : function() {
                // set center from data or props
                if (this.long && this.lat) {
                    this.$nextTick(function() {
                        // set to actual map-center (no 2-way-binding for this.center)
                        this.center = { lat : this.round(this.mlat,this.precision), lng : this.round(this.mlong,this.precision) };
                    });
                }
             },

           
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
                justify-content:flex-end;
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
