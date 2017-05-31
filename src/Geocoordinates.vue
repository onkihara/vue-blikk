<template>
    <div class="geo-coordinates">

        <div :class="{ apileft : apikey }">
            <div class="form-group">
                <label for="lat">{{ labelLat }}</label>
                <dropdown-input
                    v-model="latvalue" 
                    :data="lats" 
                    :placeholder="placeholderLat" 
                    :btn-text="btnText"
                    :disabled="disabled"
                    @blur="recalcLat" 
                    @esc="esc"
                    @selected="selectedLat"
                    @changed="recalcLat"
                ></dropdown-input>
            </div>
            <div class="form-group">
                <label for="long">{{ labelLong }}</label>
                <dropdown-input
                    v-model="longvalue" 
                    :data="longs" 
                    :placeholder="placeholderLong" 
                    :btn-text="btnText"
                    :disabled="disabled"
                    @blur="recalcLong" 
                    @esc="esc"
                    @selected="selectedLong"
                    @changed="recalcLong"
                ></dropdown-input>
            </div>
        </div>

        <div class="apiright" v-if="apikey">
            <a @click.prevent="openModal"><span class="glyphicon glyphicon-globe"></span></a>           
        </div>

        <modal v-model="apiOpen" ref="apimodal" @opened="mopened" class="apicontainer">
            <span slot="title">{{ apititle }}</span>

            <gmap-map class="mapcontainer" 
                ref="map" 
                @center_changed="getCenter" 
                map-type-id="roadmap" 
                :center="center" 
                :zoom="mzoom">
            </gmap-map>

            <div class="kimme"><span @click="mok" class="korn glyphicon glyphicon-screenshot"></span></div>
            <div slot="modal-footer" class="modal-footer">
                <div class="form-group">
                    <label>{{ labelLat }}
                        <input class="form-control" @blur="setCenter" @keydown.enter="setCenter" type="text" v-model="mlat" />
                    </label>
                    <label>{{ labelLong }}
                        <input class="form-control" @blur="setCenter" @keydown.enter="setCenter" type="text" v-model="mlong" />
                    </label>
                    <button type="button" @click="mok" class="btn btn-primary">{{ apiok }}</button>
                    <button type="button" @click="mreset" class="btn btn-primary">{{ apireset }}</button>
                    <button type="button" @click="mcancel" class="btn btn-default">{{ apicancel }}</button>
                </div>
            </div>
        </modal>

        <input type="hidden" :name="nameLat" :value="lat" />
        <input type="hidden" :name="nameLong" :value="long" />
        <input type="hidden" :name="nameFormatType" :value="type" />

    </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Ddinput from './Dropdowninput.vue';
    import Modal from './Modal.vue';
    import Vue from 'vue';
    import * as VueGoogleMaps from 'vue2-google-maps';

    const NUM = 1;
    const DEG = 2;
    const MIN = 3;
    const SEC = 4;
    const EXP = 6; // Nachkommastellen

    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s',
            // v: 'OPTIONAL VERSION NUMBER',
            // libraries: 'places', //// If you need to use place input 
        }
    });

    export default {

        components : {
            'dropdown-input' : Ddinput,
            'modal' : Modal
        },

        mounted() {
            if (this.longitude) {
                this.recalcLong(this.longitude);
            }
            if (this.latitude) {
                this.recalcLat(this.latitude);
            }
            // set center-coords
            this.minit();
          },

        watch : {
            // change of dropdownformats
            type(val, old) {
                if (old != val) {
                    this.latvalue = this.lats[this.type];
                    this.longvalue = this.longs[this.type];
                }
            },
            center(val) {
                //console.log(val)
            }
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
            coordtype : { type : Number, default : NUM },
            // google-api properties
            apikey : { type : String, default: '' },
            apilat : { type : String, default : '46.499597' },
            apilong : { type : String, default : '11.341741' },
            apizoom : { type : String, default : '8' },
            apititle : { type : String, default : 'Choose coordinates ...' },
            apicancel : { type : String, default : 'Cancel' },
            apiok : { type : String, default : 'Save' },
            apireset : { type : String, default : 'Reset'}
        },

        data : function() {
            return {
                // coordinates data
                long : 0,
                lat : 0,
                longs : {},
                lats : {},
                longvalue : '',
                latvalue : '',
                disabled : false,
                type : this.coordtype,
                // api-data
                apiOpen : false,
                modalHeight : window.innerHeight - 30,
                mlat : '',
                mlong : '',
                center : {},
                mzoom : parseInt(this.apizoom),
            }
        },

        methods : {

            openModal : function() {
                this.apiOpen = true;
                this.$refs.apimodal.$refs.modaldialog.style.height = this.modalHeight + 'px';
                this.minit();
             },

            minit : function() {
                // set center from data or props
                if (this.long && this.lat) {
                    this.setCenter(this.lat,this.long);
                } else {
                    this.setCenter(this.apilat,this.apilong);
                }
             },

            mopened : function() {
                // trigger map resize after modal shown!
                google.maps.event.trigger(this.$refs.map.$mapObject, 'resize');
            },

            mok : function() {
                this.recalcLat(this.mlat);
                this.recalcLong(this.mlong);
                this.$refs.apimodal.action(false,3);
            },

            mcancel : function() {
                this.$refs.apimodal.action(false,3);
            },

            mreset : function() {
                this.mlat = this.lat.toString();
                this.mlong = this.long.toString();
                    this.center = { lat: 0.0, lng : 0.0 };
                this.setCenter();
            },

            setCenter : function(lat,long) {
                this.$nextTick(function() {
                    lat = this.round(lat || this.mlat,EXP);
                    long = this.round(long || this.mlong,EXP);
                    this.center = { lat : lat, lng : long };
                });
            },

            getCenter : function(center) {
                this.mlat = this.round(center.lat(),EXP).toString();
                this.mlong = this.round(center.lng(),EXP).toString();
            },

            recalcLat : function(coord) {
                coord = coord || this.lat;
                var lat = this.parse(coord);
                // Plausibilität
                if (Math.abs(lat) > 90.0) {
                    this.lat = 0;
                    this.latvalue = "Not valid!";
                    this.lats = {};
                    return;
                }
                this.lat = lat;
                this.lats = this.calcCoords(this.lat, 'lat');
                this.latvalue = this.lats[this.type];
            },

            recalcLong : function(coord) {
                coord = coord || this.long;
                var long = this.parse(coord);
                // Plausibilität
                if (Math.abs(long) > 180.0) {
                    this.long = 0;
                    this.longvalue = "Not valid!";
                    this.longs = {};
                    return;
                }
                this.long = long;
                this.longs = this.calcCoords(this.long, 'long');
                this.longvalue = this.longs[this.type];
            },

            esc(data) {

            },

            selectedLat(data, type) {
                this.type = type;
            },

            selectedLong(data, type) {
                this.type = type;
            },

            calcCoords(coords, latorlong) {
                var sign = coords < 0 ? -1 : 1;
                var airts = this.airts.split(',');
                var c = {};
                c[NUM] = '' + coords;
                // calc DEG
                coords = Math.abs(coords);
                var airt;
                if (latorlong == 'long') {
                    airt = sign < 0 ? airts[3] : airts[1];
                } else {
                    airt = sign < 0 ? airts[2] : airts[0];
                }
                c[DEG] = airt + ' ' + coords + '°';
                // calc MIN
                var min = this.round((coords - Math.trunc(coords)) * 60,EXP);
                c[MIN] = airt + ' ' + Math.trunc(coords) + '° ' + min + "'";
                // calc SEC
                var sec = this.round((min - Math.trunc(min)) * 60,EXP);
                c[SEC] = airt + ' ' + Math.trunc(coords) + '° ' + Math.trunc(min) + "' " + sec + '"';
                return c;
            },

            parse(coord) {
                coord = ''+coord;
                // test for cardinal point (N,E,S,W)
                var cardinalpoint, s = '';
                var sign = 1;
                var airts = this.airts.split(',');
                var type = 1;
                _.forEach(airts, cp => {
                    s = new RegExp(cp,'ig');
                    if (coord.search(s) > -1) { 
                        cardinalpoint = _.toUpper(cp);
                        type = 2;
                    }
                    coord = coord.replace(s,''); 
                });
                coord = _.trim(coord);
                // test for numerical sign (-)
                if (coord.search(/\-/g) > -1) {
                    sign = -1;
                }
                coord = _.trim(coord.replace(/\+|\-/g,''));
                // signcheck for S and W
                if (cardinalpoint && sign == 1) {
                    if (cardinalpoint == _.toUpper(airts[2]) || cardinalpoint == _.toUpper(airts[3])) {
                        sign = -1;
                    }
                }
                // value
                var coordinate = 0;
                var deg = 0;
                var min = 0;
                var sec = 0;
                // normalize comma
                coord = coord.replace(/\s*,\s*/g,'.');
                // check for seconds (split at minute-sign)
                var part = coord.split("'");
                if (part[1]) {
                    sec = parseFloat(part[1]);
                    type = 4;
                }
                //console.log(sec);
                // check for minutes (at degree-sign)
                var part = part[0].split("°");
                if (part[1]) {
                    min = parseFloat(part[1]);
                    type = 3;
                }
                //console.log(min);
                // degrees
                deg = parseFloat(part[0]);
                //console.log(deg);
                //console.log(sign)
                this.type = type;
                return this.round(sign * (deg + min / 60 + sec / 3600),EXP);
            },

            round(value, exp) {
                if (typeof exp === 'undefined' || +exp === 0)
                    return Math.round(value);
                value = +value;
                exp = +exp;
                if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
                    return NaN;
                // Shift
                value = value.toString().split('e');
                value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
                // Shift back
                value = value.toString().split('e');
                return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
            }

        }

    }
</script>

<style lang="scss">

    $kornsize: 30px;

    .geo-coordinates {
        
        .degbuttons {
            margin-top:40px;
            text-align:right;
        }

        .apileft {
            width:70%;
            float:left;
        }

        .apiright {
            width:30%;
            float:left;

            a {
                text-decoration: none;
                display:flex;
                cursor:pointer;
                width:100%;
                height:150px;
                justify-content: center;
                align-items: center;

                span {
                    font-size: 5em;
                    display:block;
                }
            }
        }

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
            label {
                text-align:left;
            }
        }
    }

 </style>
