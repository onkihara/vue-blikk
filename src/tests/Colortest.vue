<template>
  <div id="app">
    <h1>{{ msg }}</h1>

    <hr />

   
    <compact-picker value="" :palette="palette"></compact-picker>
  
 	
  </div>
</template>

<script>

	import  {Compact}  from 'vue-color';

	export default {

		name: 'app',

		components : {
			'compact-picker' : Compact
		},

		data () {
			return {
				msg: 'QR-Code-Test',
				colors : {
					  hex: '#194d33',
					  hsl: {
					    h: 150,
					    s: 0.5,
					    l: 0.2,
					    a: 1
					  },
					  hsv: {
					    h: 150,
					    s: 0.66,
					    v: 0.30,
					    a: 1
					  },
					  rgba: {
					    r: 25,
					    g: 77,
					    b: 51,
					    a: 1
					  },
					  a: 1
				},
				palette : [
				  '#F44E3B', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
				  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
				  '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
				]
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

		.edit-qrcode {
			margin:auto;
		}
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
