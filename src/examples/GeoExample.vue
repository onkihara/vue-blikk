<template>
  <div id="app">
    <h1>{{ msg }}</h1>

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
		zoom="10"
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
		text-map="Karte"
		:useviewmap="true"
	>
	</edit-geo-coordinates>

	<hr>

	<edit-geo-coordinates 
		name-long="long" 
		name-lat="lat" 
		name-format-type="ftype"
		placeholder-long="Länge" 
		placeholder-lat="Breite"
		label-long="Länge" 
		label-lat="Breite"
		longitude="" 
		latitude=""
		coordtype="2"
		btn-text = "Formate"
		:usemap="true" 
		apilat="46.499446" 
		apilong="11.341657"
		apizoom="9"
		precision="6"
		apititle="Wählen Sie hier die Koordinaten ..."
		apiok="Übernehmen" 
		apicancel="Abbrechen"
		:auto-edit="true"
		:cb-buttons="true"
		zoom="14"
	></edit-geo-coordinates>

	<!-- <hr style="clear:both" />

		
	<hr style="clear:both" />

	<input-geo-coordinates 
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
	></input-geo-coordinates>
 -->

  </div>
</template>

<script>

	import EditGeocoordinates from '../Editgeocoordinates.vue'
	import Editdropdowninput from '../Editdropdowninput.vue'
 
	export default {

		name: 'app',

		components : {
			'edit-geo-coordinates' : EditGeocoordinates,
			'edit-dropdowninput' : Editdropdowninput
		},

		data () {
			return {
				msg: 'Geo-Test',
				longitude : "11.184245",
				latitude : '43.245215',
				longitude1 : "",
				latitude1 : '',
				type : '2',
				sourceurl : '',
				generatorurl : 'debug',
				//dropdowndata : { one : 'eins', two : 'zwei', three : 'drei' } 
				dropdowndata : ['eins','zwei','drei'] 
			}
		}
	}

</script>

<style lang="scss">

	// Bootstrap
	$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
	@import "~bootstrap-sass/assets/stylesheets/bootstrap";

	#app {
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

	hr {
		clear:both;
	}
</style>
