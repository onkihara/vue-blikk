<template>
    <div class="map-modal">

        <modal v-model="open" ref="modal" @opened="mopened" @closed="closed" @cancel="cancel" class="apicontainer">

            <span slot="title"><slot name="title"></slot></span>

            <gmap-map class="mapcontainer" 
                ref="map" 
                map-type-id="roadmap" 
                :center="center" 
                :zoom="azoom"
                @center_changed="getCenter"
                @zoom_changed="chZoom">
            </gmap-map>

            <div class="kimme"><span @click="ok" class="korn glyphicon glyphicon-screenshot"></span></div>

            <div slot="modal-footer" class="modal-footer">
                <slot name="modal-footer">
                    <div class="form-group">
                        <button v-if="callbackOk" class="btn btn-primary" @click="ok">{{ textOk }}</button>
                        <button class="btn btn-default" @click="cancel">{{ textCancel }}</button>
                    </div>
                </slot>
            </div>

        </modal>
       

     </div>
</template>

<script>

    import Modal from './Modal.vue';
    import Vue from 'vue';
    import * as VueGoogleMaps from 'vue2-google-maps';

    const ZOOM = 8;
    const GOOGLEMAPSAPIKEY = 'AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s';
    const APILOADER = { load : { key : GOOGLEMAPSAPIKEY }};

    if (window != 'undefined' && window.Vue) {
        window.Vue.use(VueGoogleMaps, APILOADER);
    } else {
        Vue.use(VueGoogleMaps, APILOADER);
    }

    export default {

        components : {
             'modal' : Modal
        },

        mounted() {
            // adjust height
            this.$refs.modal.$refs.modaldialog.style.height = this.modalHeight + 'px';
        },

        watch : {
            value (val, old) {
                if (val !== old) { this.open = val }
            },
            // watch changes from outside through properties
            latitude(val, old) {
                if (this.open && val !== old) {
                    this.alat = val;
                    this.setCenter(val,this.along);
                }
            },
            longitude(val, old) {
                if (this.open && val !== old) {
                    this.along = val;
                    this.setCenter(this.alat,val);
                }
            },
            zoom(val, old) {
                if (this.open && val !== old) {
                    this.azoom = val;
                }
            }
        },

         props : {
            apilat : { type : String, default : '46.49942984' },
            apilong : { type : String, default : '11.3416598' },
            apizoom : { type : String, default : ZOOM.toString() },
            latitude : { type : Number, default : null },
            longitude : { type : Number, default : null },  
            zoom : { type : Number, default : ZOOM },         
            disabled : { type : Boolean, default : false },         
            value : { type : Boolean, default : false },
            callbackOk : { type : Function, default : null },
            textOk : { type : String, default : 'Ok' },
            textCancel : { type : String, default : 'Close' },
         },

        data : function() {
            return {
                open : this.value,
                modalHeight : window.innerHeight - 30,
                lat : this.latitude,
                long : this.longitude,
                alat : 0.0,
                along : 0.0,
                azoom : this.zoom,
                center : { lat : 0.0, lng : 0.0 },
            }
        },

        methods : {

            mopened : function() {
                // re-centering for resize changes center!
                if (this.latitude !== null && this.longitude !== null) {
                    this.lat = this.latitude;
                    this.long = this.longitude;
                } else if (this.long === null || this.lat === null) {
                    this.lat = parseFloat(this.apilat);
                    this.long = parseFloat(this.apilong);
                }
                this.center = { lat: this.lat, lng : this.long };
                this.azoom = this.zoom === null ? parseInt(this.apizoom) : this.zoom;
                this.$refs.map.resizePreserveCenter();
                if (this.disabled) {
                    //this.$refs.map.$mapObject.setOptions({ disableDefaultUI : true });
                    this.$refs.map.$mapObject.setOptions({ 
                        zoomControl : true,
                        draggable : false,
                        scrollwheel : false,
                        streetViewControl : false
                    });
                }
            },

            setCenter : function(lat,long) {
                this.$nextTick(function() {
                    // set to actual map-center (no 2-way-binding for this.center)
                    this.center = { lat : this.alat, lng : this.along };
                    // set to new center
                    if ( lat !== this.alat || long !== this.along) {
                        this.$nextTick(function() {
                            this.center = { lat : lat, lng : long };
                        });
                    }
                });
            },

            resetCenter : function() {
                this.setCenter(this.lat, this.long);
                this.azoom = this.zoom;
            },

            getCenter : function(center) {
                this.alat = center.lat();
                this.along = center.lng();
                this.$emit('center_changed', { lat : this.alat, lng : this.along, zoom : this.azoom });
            },

            chZoom : function(zoom) {
                this.azoom = zoom;
                this.$emit('zoom_changed',zoom);
            },

            cancel : function() {
                this.open = false;
                this.$emit('cancel');
            },

            ok : function() {
                if (this.callbackOk) this.callbackOk();
            },

            closed : function() {
                this.$emit('closed');
            },

            mok : function() {
                console.log(this.center)
            }

           
        }

    }
</script>

<style lang="scss">

    $kornsize: 30px;

    .map-modal {

        .modal-dialog {
            width:98%;
            margin-top:15px;

            .modal-content {
                height:100%;
            }
        }

        .modal-body {
            height:80%;

            .mapcontainer {
                width:100%;
                height:100%;
            }

            .kimme {
                position:absolute;
                top:50%;
                left:50%;
                width:10px;
                height:10px;
                .korn {
                    color:rgba(255,0,0,.5);
                    font-size:$kornsize;
                    position: absolute;
                    top:-$kornsize/2;
                    left:-$kornsize/2;
                }
            }
        }

        .modal-footer {
            .form-group {
                display:flex;
                justify-content: flex-end;
                align-items: flex-end;
                label {
                    text-align:left;
                    margin-left:5px;
                }
                button {
                    margin-left:5px;
                    margin-bottom: 5px;
                }
            }
        }
        
         
    }

 </style>
