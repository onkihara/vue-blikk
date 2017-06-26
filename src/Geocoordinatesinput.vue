<template>
    <div class="geo-coordinates-input">

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
                <button class="btn btn-xs btn-primary" @click="ok"><slot name="btn-ok"><span class="glyphicon glyphicon-ok"></span></slot></button> 
                <button class="btn btn-xs btn-default" @click="cancel"><slot name="btn-cancel"><span class="glyphicon glyphicon-remove"></span></slot></button>
            </div>        
        </div>

        <map-modal 
            v-model="apiOpen" 
            ref="apimodal" 
            class="apicontainer" 
            :apilat="apilat" 
            :apilong="apilong"
            :apizoom="apizoom"
            :latitude="lat"
            :longitude="long"
            :zoom="mzoom"
            @cancel="mclosed"
            @center_changed="mchanged"
            @zoom_changed="mzchanged"
        >

            <span slot="title">{{ apititle }}</span>

            <div slot="modal-footer">
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
        </map-modal>

        <input type="hidden" :name="nameLat" :value="lat" />
        <input type="hidden" :name="nameLong" :value="long" />
        <input type="hidden" :name="nameFormatType" :value="type" />

     </div>
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Ddinput from './Dropdowninput.vue';
    import Mapmodal from './Mapmodal.vue';

    const NUM = 1;
    const DEG = 2;
    const MIN = 3;
    const SEC = 4;
    const EXP = 8; // Nachkommastellen
    const ZOOM = 8;
 
    export default {

        components : {
            'dropdown-input' : Ddinput,
            'map-modal' : Mapmodal
        },

        mounted() {
            this.init();
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
            nameZoom : { type : String, default : 'zoom' },
            labelLong : { type : String, default : 'Longitude' },
            labelLat : { type : String, default : 'Latitude' },
            placeholderLong : { type : String, default : 'Longitude' },
            placeholderLat : { type : String, default : 'Latitude' },
            longitude : { type : String, default : '' },
            latitude : { type : String, default : '' },
            zoom : { type : String, default : '' },
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
            apizoom : { type : String, default : ZOOM.toString() },
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
                long : null,
                lat : null,
                longs : {},
                lats : {},
                longvalue : '',
                latvalue : '',
                disabled : false,
                type : this.coordtype,
                // api-data
                apiOpen : false,
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
             },

            mok : function() {
                this.recalcLat(this.mlatvalue);
                this.recalcLong(this.mlongvalue);
                //this.$refs.apimodal.action(false,3);
                this.apiOpen = false;
                // has to be delayed in order to close the modal-map !?
                this.$nextTick(() => { 
                    _.delay(() => {
                        this.$emit('changed', { lat: this.lat, long : this.long, type : this.type, zoom : this.mzoom });
                    },500);
                });
            },

            mcancel : function() {
                this.$refs.apimodal.cancel();
                this.mreset();
                this.mclosed();
            },

            mreset : function() {
                this.$refs.apimodal.resetCenter();
            },

            mclosed : function() {
                this.apiOpen = false;
            },

            mchanged : function(coords) {
                this.mlat = coords.lat;
                this.mlong = coords.lng;
                this.mzoom = coords.zoom;
                this.setModalValues();
            },

            mzchanged : function(zoom) {
                this.mzoom = zoom;
            },

            medit : function() {
                this.$nextTick(function() {
                    this.lat = this.parse(this.mlatvalue, false);
                    this.long = this.parse(this.mlongvalue, false);
                });
            },

            init : function() {
                if (this.longitude) {
                    this.recalcLong(this.longitude,false);
                }
                if (this.latitude) {
                    this.recalcLat(this.latitude,false);
                }
                if (this.zoom) {
                    this.mzoom = parseInt(this.zoom);
                }
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
                    this.$emit('enter',{ lat : this.lat, long : this.long, type : this.type, zoom : this.mzoom });
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
                if (coords == '' || coords === null) {
                    return { NUM : null, DEG : null, MIN : null, SEC : null };
                }
                var sign = coords < 0 ? -1 : 1;
                var airts = this.airts.split(',');
                var c = {};
                c[NUM] = '' + this.round(coords,this.precision);
                // calc DEG
                coords = Math.abs(coords);
                var airt;
                if (latorlong == 'long') {
                    airt = sign < 0 ? airts[3] : airts[1];
                } else {
                    airt = sign < 0 ? airts[2] : airts[0];
                }
                c[DEG] = airt + ' ' + this.round(coords,this.precision) + '°';
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

    .geo-coordinates-input {

        display:flex;
        align-items: center;

        .degbuttons {
            margin-top:40px;
            text-align:right;
        }

        .apileft {
            flex:3;
            float:left;
        }

        .apiright {
            flex:1;
            height:133px;
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
