<template>
    <div class="geo-coordinates">

        <div class="form-group">
            <label for="lat">{{ labelLat }}</label>
            <dropdown-input
                v-model="latvalue" 
                name="nameLat" 
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
                name="nameLong" 
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
</template>

<script>

    import Axios from 'axios';
    import _ from 'lodash';
    import Ddinput from './Dropdowninput.vue'

    const NUM = 1;
    const DEG = 2;
    const MIN = 3;
    const SEC = 4;
    const EXP = 6; // Nachkommastellen

    export default {

        components : {
            'dropdown-input' : Ddinput
        },

        mounted() {
            if (this.longitude) {
                this.recalcLong(this.longitude);
            }
            if (this.latitude) {
                this.recalcLat(this.latitude);
            }
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
            nameLong : { type : String, default : 'long' },
            nameLat : { type : String, default : 'lat' },
            labelLong : { type : String, default : 'Longitude' },
            labelLat : { type : String, default : 'Latitude' },
            placeholderLong : { type : String, default : 'Longitude' },
            placeholderLat : { type : String, default : 'Latitude' },
            longitude : { type : String, default : '' },
            latitude : { type : String, default : '' },
            airts : { type : String, default: 'N,E,S,W' },
            btnText : { type : String, default : 'Formats'},
            coordtype : { type : Number, default : NUM }
         },

        data : function() {
            return {
                long : 0,
                lat : 0,
                longs : {},
                lats : {},
                longvalue : '',
                latvalue : '',
                disabled : false,
                type : this.coordtype
            }
        },

        methods : {

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

    .geo-coordinates {
        
        .degbuttons {
            margin-top:40px;
            text-align:right;
        }
        

    }

 </style>
