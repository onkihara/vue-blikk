<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<edit-geo-coordinates 
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
		:usemap="true" 
		apilat="46.49943169" 
		apilong="11.34164907"
		apizoom="9"
		precision="6"
		apititle="Wählen Sie hier die Koordinaten ..."
		apiok="Übernehmen" 
		apicancel="Abbrechen"
	></edit-geo-coordinates>

	<hr style="clear:both" />

	<edit-qr-code :qr-source="sourceurl" :qr-generator="generatorurl" qr-placeholder="/dist/logo.png">
		
	</edit-qr-code>
	
	<hr style="clear:both" />

	<edit-geo-coordinates 
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
		:usemap="true" 
		apilat="46.49943169" 
		apilong="11.34164907"
		apizoom="9"
		apititle="Wählen Sie hier die Koordinaten ..."
		apiok="Übernehmen" 
		apicancel="Abbrechen"
	></edit-geo-coordinates>


  </div>
</template>

<script>

	import EditGeocoordinates from '../Editgeocoordinates.vue'
	import EditQrcode from '../Editqrcode.vue'
 
	export default {

		name: 'app',

		components : {
			'edit-geo-coordinates' : EditGeocoordinates,
			'edit-qr-code' : EditQrcode
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
