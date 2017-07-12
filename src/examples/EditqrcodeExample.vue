<template>
  <div id="app">
    <h1>{{ msg }}</h1>

    <hr />

    <edit-qrcode
		width="300px"
		placeholder="../dist/logo.png"
		generator=""
		name="code"
		source=""
		download=""
		:on-blur="true"
    >
    	<span  slot="edit" class="glyphicon glyphicon-pencil"></span>
    	<span  slot="done" class="glyphicon glyphicon-ok"></span>
    	{{ content }}
    </edit-qrcode>

    <hr />

    <qr-code  
		width="200px"
		placeholder=""
		source="../dist/logo.png"
		download=""
    >
    </qr-code>

 	
  </div>
</template>

<script>

	import Qrcode from '../Qrcode.vue'
	import Editqrcode from '../Editqrcode.vue'
 
	export default {

		name: 'app',

		components : {
			'qr-code' : Qrcode,
			'edit-qrcode' : Editqrcode
		},

		data () {
			return {
				msg: 'QR-Code-Test',
				content : "Länge: 34,345445345\nBreite: 11,2454354"
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
