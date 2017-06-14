<template>
    <div class="geo-coordinates">

        <div :class="{ apileft : usemap }">
            <div class="form-group">
                <label for="lat">{{ labelLat }}</label>
                <dropdown-input
                    ref="input1"
                    v-model="latvalue" 
                    :data="lats" 
                    :placeholder="placeholderLat" 
                    :btn-text="btnText"
                    :disabled="disabled"
                    @blur="blur('lat',$event)" 
                    @esc="esc"
                    @selected="selectedLat"
                    @enter="enterLat"
                ></dropdown-input>
            </div>
            <div class="form-group">
                <label for="long">{{ labelLong }}</label>
                <dropdown-input
                    ref="input2"
                    v-model="longvalue" 
                    :data="longs" 
                    :placeholder="placeholderLong" 
                    :btn-text="btnText"
                    :disabled="disabled"
                    @blur="blur('long',$event)" 
                    @esc="esc"
                    @selected="selectedLong"
                    @enter="enterLong"
                ></dropdown-input>
            </div>
        </div>

        <div class="apiright" v-if="usemap">
            <a slot="map-icon" @click.prevent="openModal">
                <span class="btn-map glyphicon glyphicon-globe">{{ iconMap }}</span><br />
                <span class="btn-text-map">{{ textMap }}</span>
            </a>   
            <div class="cb-buttons" v-if="cbButtons">
                <button class="btn btn-xs btn-primary" @click="ok">OK</button> 
                <button class="btn btn-xs btn-default" @click="cancel">Cancel</button>
            </div>        
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
                        <input class="form-control" @blur="medit" @keydown.enter="medit" type="text" v-model="mlatvalue" />
                    </label>
                    <label>{{ labelLong }}
                        <input class="form-control" @blur="medit" @keydown.enter="medit" type="text" v-model="mlongvalue" />
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
    const EXP = 8; // Nachkommastellen
    const APILOADER = { load : { key : 'AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s'}} // google-api-key

    if (window != 'undefined' && window.Vue) {
        window.Vue.use(VueGoogleMaps, APILOADER);
    } else {
        Vue.use(VueGoogleMaps, APILOADER);
    }

    export default {

        components : {
            'dropdown-input' : Ddinput,
            'modal' : Modal
        },

        mounted() {
            this.init();
            // set center-coords
            this.minit();
            // custom-callbacks
            if (this.cbCancel) { this.cancel = this.cbCancel };
            if (this.cbOk) { this.ok = this.cbOk };
        },

        watch : {

            // change of dropdownformats
            type(val, old) {
                if (old != val) {
                    this.latvalue = this.lats[this.type];
                    this.longvalue = this.longs[this.type];
                }
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
            // callables
            cbButtons : { type : Boolean, default : false },
            cbOk : { type : Function, default : null },
            cbCancel : { type : Function, default : null },
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
                mlatvalue : '',
                mlongvalue : '',
                center : {},
                mzoom : parseInt(this.apizoom),
                cancel : this.escAll,
                ok : this.enter
            }
        },

        methods : {

            openModal : function() {
                this.apiOpen = true;
                this.$refs.apimodal.$refs.modaldialog.style.height = this.modalHeight + 'px';
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
                this.minit();
            },

            mok : function() {
                this.recalcLat(this.mlatvalue);
                this.recalcLong(this.mlongvalue);
                this.$refs.apimodal.action(false,3);
                this.apiOpen = false;
                // has to be delayed in order to close the modal-map !?
                this.$nextTick(() => { 
                    _.delay(() => {
                        this.$emit('changed', { lat: this.lat, long : this.long, type : this.type });
                    },500);
                });
            },

            mcancel : function() {
                this.$refs.apimodal.action(false,3);
            },

            mreset : function() {
                this.setCenter(this.lat,this.long);
            },

            medit : function() {
                this.$nextTick(function() {
                    var lat = this.parse(this.mlatvalue, false);
                    var long = this.parse(this.mlongvalue, false);
                    this.setCenter(lat,long);
                });
            },

            init : function() {
                if (this.longitude) {
                    this.recalcLong(this.longitude,false);
                }
                if (this.latitude) {
                    this.recalcLat(this.latitude,false);
                }
            },

            setCenter : function(lat,long) {
                this.$nextTick(function() {
                    // set to actual map-center (no 2-way-binding for this.center)
                    this.center = { lat : this.round(this.mlat,this.precision), lng : this.round(this.mlong,this.precision) };
                    // values
                    this.setModalValues();
                    // set to new center
                    this.$nextTick(function() {
                        if ( lat && long) {
                            this.center = { lat : this.round(lat,this.precision), lng : this.round(long,this.precision) };
                        }
                    });
                });
            },

            getCenter : function(center) {
                this.mlat = this.round(center.lat(),this.precision).toString();
                this.mlong = this.round(center.lng(),this.precision).toString();
                this.setModalValues();
            },

            setModalValues : function() {
                var latlongs = this.getFormatted(this.mlat,this.mlong,this.type);
                this.mlatvalue = latlongs.lat;
                this.mlongvalue = latlongs.long;
            },

            recalcLat : function(coord, settype=true) {
                coord = coord || this.latvalue;
                var lat = this.parse(coord,settype);
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

            recalcLong : function(coord, settype=true) {
                coord = coord || this.longvalue;
                var long = this.parse(coord,settype);
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

            getFormatted : function(lat, long, type) {
                var mlats = this.calcCoords(lat, 'lat'); 
                var mlongs = this.calcCoords(long, 'long'); 
                return { lat :  mlats[type], long : mlongs[type] };
            },

            esc : function(data) {
                this.$emit('esc',data);
                this.init();
            },

            escAll : function() {
                this.$refs.input1.esc();
                this.$refs.input2.esc();
            },

            enterLat : function(data) {
                this.recalcLat(data);
                this.enter();
            },

            enterLong : function(data) {
                this.recalcLong(data);
                this.enter();
            },

            enter : function() {
                this.$nextTick(() => {
                    this.$emit('enter',{ lat : this.lat, long : this.long, type : this.type });
                })
            },

            blur : function(latlong, data) {
                if ( ! data) return;
                latlong == 'lat' ? this.recalcLat(data) : this.recalcLong(data);
            },

            selectedLat : function(data, type) {
                this.type = type;
            },

            selectedLong : function(data, type) {
                this.type = type;
            },

            calcCoords : function(coords, latorlong) {
                if (coords == '') {
                    return { NUM : null, DEG : null, MIN : null, SEC : null };
                }
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
                var minprecision = this.precision - 2 > 0 ? this.precision - 2 : 0;
                var min = this.round((coords - Math.trunc(coords)) * 60,minprecision);
                c[MIN] = airt + ' ' + Math.trunc(coords) + '° ' + min + "'";
                // calc SEC
                var secprecision = minprecision - 2 > 0 ? minprecision - 2 : 0;
                var sec = this.round((min - Math.trunc(min)) * 60,secprecision);
                c[SEC] = airt + ' ' + Math.trunc(coords) + '° ' + Math.trunc(min) + "' " + sec + '"';
                return c;
            },

            parse : function(coord, settype=true) {
                coord = ''+coord;
                // test for cardinal point (N,E,S,W)
                var cardinalpoint, s = '';
                var sign = 1;
                var airts = this.airts.split(',');
                var type = NUM;
                _.forEach(airts, cp => {
                    s = new RegExp(cp,'ig');
                    if (coord.search(s) > -1) { 
                        cardinalpoint = _.toUpper(cp);
                        type = DEG;
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
                }
                //console.log(sec);
                // check for minutes (at degree-sign)
                var part = part[0].split("°");
                if (part[1]) {
                    min = parseFloat(part[1]);
                }
                //console.log(min);
                // degrees
                deg = parseFloat(part[0]);
                //console.log(deg);
                //console.log(sign)
                if (settype) {
                    this.type = sec > 0 ? SEC : min > 0 ? MIN : type;
                }
                return this.round(sign * (deg + min / 60 + sec / 3600),this.precision);
            },

            round : function(value, exp) {
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
            height:135px;
            float:left;
            text-align:center;
            display:flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            a {
                text-decoration: none;
                cursor:pointer;
                width:100%;

                .btn-map.glyphicon {
                    font-size: 5em;
                }

                .btn-text-map {
                    color:black;
                    margin-top:5px;
                }
            }

            .cb-buttons {
                margin-top:10px;
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
