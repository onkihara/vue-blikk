<template>
  <div id="app">
    <h1>{{ msg }}</h1>

    <hr />

    <edit-qrcode
		placeholder="../dist/logo.png"
		generator="test"
		name="code"
		source=""
		download=""
		:on-blur="false"
		:store-on-exit="false"
		:view-content="false"
		:color-picker="true"
		color="#9F0500"
    >

    	<span  slot="edit" class="glyphicon glyphicon-pencil"></span>
    	<span  slot="done" class="glyphicon glyphicon-remove"></span>
    	{{ content }}
    	
    </edit-qrcode>

    <hr />

    <edit-qrcode
		width="300px"
		placeholder="../dist/logo.png"
		generator="test"
		name="code"
		source=""
		download=""
		:on-blur="false"
		:store-on-exit="false"
		:view-content="true"
		:editable-content="false"
		:color-picker="true"
		color="#9F0500"
		:is-editable="true"
    >

    	<span  slot="edit" class="glyphicon glyphicon-pencil"></span>
    	<span  slot="done" class="glyphicon glyphicon-remove"></span>
    	{{ content }}
    	
    </edit-qrcode>

    <hr />

    <edit-qrcode
		width="300px"
		placeholder="../dist/logo.png"
		generator="test"
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

	import Qrcode from '../Qrcode.vue';
	import Editqrcode from '../Editqrcode.vue';
 
	export default {

		name: 'app',

		components : {
			'qr-code' : Qrcode,
			'edit-qrcode' : Editqrcode
		},

		data () {
			return {
				msg: 'QR-Code-Test',
				content : "Länge: 34,345445345\nBreite: 11,2454354",
				palette : [
				  '#F44E3B', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
				  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
				  '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
				]
			}
		},
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
