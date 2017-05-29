<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<geo-coordinates 
		name-long="long" 
		name-lat="lat" 
		placeholder-long="Länge" 
		placeholder-lat="Breite"
		label-long="Länge" 
		label-lat="Breite"
		:longitude="longitude" 
		:latitude="latitude"
		airts="N,O,S,W" 
		:coordtype="type"
		btn-text = "Formate"
	>
	</geo-coordinates>

	<qr-code :src="source"></qr-code>

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
				latitude : '-43.245215',
				type : 1,
				source : ''
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
