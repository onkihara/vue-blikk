<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<geo-coordinates 
		name-long="long" 
		name-lat="lat" 
		name-format-type="ftype"
		placeholder-long="Länge" 
		placeholder-lat="Breite"
		label-long="Länge" 
		label-lat="Breite"
		:longitude="longitude" 
		:latitude="latitude"
		airts="N,O,S,W" 
		:coordtype="type"
		btn-text = "Formate"
		apikey="AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s" 
		apilat="46.49943169" 
		apilong="11.34164907"
		apizoom="9"
		precision="6"
		apititle="Wählen Sie hier die Koordinaten ..."
		apiok="Übernehmen" 
		apicancel="Abbrechen"
	></geo-coordinates>

	<hr style="clear:both" />

	<qr-code :qr-source="sourceurl" :qr-generator="generatorurl" qr-placeholder="/dist/logo.png">
		
	</qr-code>
	
<!-- 	<geo-coordinates 
		name-long="long" 
		name-lat="lat" 
		name-format-type="ftype"
		placeholder-long="Länge" 
		placeholder-lat="Breite"
		label-long="Länge" 
		label-lat="Breite"
		:longitude="longitude1" 
		:latitude="latitude1"
		airts="N,O,S,W" 
		:coordtype="type"
		btn-text = "Formate"
		apikey="AIzaSyD5LTJK9n2N-ahjfGqwutnt_7fPpXKpR8s" 
		apilat="46.49943169" 
		apilong="11.34164907"
		apizoom="9"
		apititle="Wählen Sie hier die Koordinaten ..."
		apiok="Übernehmen" 
		apicancel="Abbrechen"
	></geo-coordinates>
 -->

  </div>
</template>

<script>

	import Geocoordinates from '../Geocoordinates.vue'
	import Qrcode from '../Qrcode.vue'

	export default {

		name: 'app',

		components : {
			'geo-coordinates' : Geocoordinates,
			'qr-code' : Qrcode
		},

		data () {
			return {
				msg: 'Geo-Test',
				longitude : "11.184245",
				latitude : '43.245215',
				longitude1 : "",
				latitude1 : '',
				type : '1',
				sourceurl : '',
				generatorurl : 'debug'
			}
		}
	}

</script>

<style lang="scss">

	// Bootstrap
	$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
	@import "~bootstrap-sass/assets/stylesheets/bootstrap";

	.geo-coordinates {
		width:50%;
		margin:auto;
	}

	h1, h2 {
		text-align:center;
		font-weight: normal;
	}

	a {
		color: #CC0000;
	}
</style>
