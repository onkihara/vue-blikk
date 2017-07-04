<template>
  <div id="app">
    <h1>{{ msg }}</h1>

    <dropdown-input  :editable="false" value="acht" placeholder="Hier auswählen">
    	<option value="sieben">Sieben</option>
    	<option value="acht">Acht</option>
    	<option value="neun">Neun</option>
    </dropdown-input>

    <hr />

   <dropdown-input :editable="true" :data="dropdowndata2" value="eins" placeholder="Hier auswählen"></dropdown-input>

    <hr />

   <dropdown-input :editable="false" :data="dropdowndata3" value="not defined" placeholder="Hier auswählen"></dropdown-input>

    <hr />

    <edit-dropdowninput :data="dropdowndata2" value="drei"></edit-dropdowninput>

	<hr />

    <edit-dropdowninput name="zahl" value="sieben" :editable="false">
    	<option value="sieben">Sieben</option>
    	<option value="acht">Acht</option>
    	<option value="neun">Neun</option>
    </edit-dropdowninput>

	<hr />

	
  </div>
</template>

<script>

	import Editdropdowninput from '../Editdropdowninput.vue'
	import Dropdowninput from '../Dropdowninput.vue'
 
	export default {

		name: 'app',

		components : {
			'edit-dropdowninput' : Editdropdowninput,
			'dropdown-input' : Dropdowninput
		},

		data () {
			return {
				msg: 'Dropdown-Test',
				dropdowndata1 : { 'one' : 'eins', two : 'zwei', three : 'drei' },
				dropdowndata2 : ['eins','zwei','drei'],
				dropdowndata3 : 'request.htm',
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
