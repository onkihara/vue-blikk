<template>
    <div class="map-modal">

        <modal v-model="open" ref="modal" @opened="mopened" @closed="closed" @ok="ok" @cancel="cancel" class="apicontainer">

            <span slot="title"><slot name="title"></slot></span>

            <gmap-map class="mapcontainer" 
                ref="map" 
                map-type-id="roadmap" 
                :center="center" 
                :zoom="zoom"
                @center_changed="getCenter">
            </gmap-map>

            <div class="kimme"><span @click="ok" class="korn glyphicon glyphicon-screenshot"></span></div>

            <div slot="modal-footer" class="modal-footer">
                <slot name="modal-footer">
                    <div class="form-group">
                        <button class="btn btn-primary" @click="ok">OK</button>
                        <button class="btn btn-default" @click="cancel">Close</button>
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
    const APILOADER = { load : { key : 'AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s'}}; // google-api-key

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
            latitude(val, old) {
                if (this.open && val !== old) {
                    this.lat = val;
                    this.setCenter(val,this.long);
                }
            },
            longitude(val, old) {
                if (this.open && val !== old) {
                    this.long = val;
                    this.setCenter(this.lat,val);
                }
            }
        },

         props : {
            apilat : { type : String, default : '46.49942984' },
            apilong : { type : String, default : '11.3416598' },
            apizoom : { type : String, default : ZOOM.toString() },
            latitude : { type : Number, default : null },
            longitude : { type : Number, default : null },            
            value : { type : Boolean, default : false }
         },

        data : function() {
            return {
                open : this.value,
                modalHeight : window.innerHeight - 30,
                lat : this.latitude,
                long : this.longitude,
                alat : 0.0,
                along : 0.0,
                zoom : parseInt(this.apizoom),
                center : { lat : 0.0, lng : 0.0 },
            }
        },

        methods : {

            mopened : function() {
                // trigger map resize after modal shown!
                google.maps.event.trigger(this.$refs.map.$mapObject, 'resize');
                // re-centering for resize changes center!
                if (this.latitude !== null && this.longitude !== null) {
                    this.lat = this.latitude;
                    this.long = this.longitude;
                } else if (this.long === null || this.lat === null) {
                    this.lat = parseFloat(this.apilat);
                    this.long = parseFloat(this.apilong);
                }
                this.center = { lat: this.lat, lng : this.long };
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
            },

            getCenter : function(center) {
                this.alat = center.lat();
                this.along = center.lng();
                this.$emit('center_changed', { lat : this.alat, lng : this.along, zoom : this.zoom });
            },

            ok : function() {
                this.open = false;
                this.$emit('ok', { lat : this.alat, lng : this.along, zoom : this.zoom });
            },

            cancel : function() {
                this.open = false;
                this.$emit('cancel');
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
