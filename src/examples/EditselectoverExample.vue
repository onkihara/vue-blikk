<template>
  <div id="app">
    <h1>{{ msg }}</h1>

    <hr />

    <h5>Mit Data-Array und Template und verstecktem Text</h5>

    <edit-selectover
    	class="glyph-class"
		value="drei"
		placeholder="Auswählen ..."
		:data="['eins','zwei','drei','vier']"
		template='<span class="glyphicon"></span><span v-show="!hide" v-html="item"></span>'
		:hidden="3"
    ></edit-selectover>

    <hr />

    <h5>Mit Data-Array und Template</h5>

    <edit-selectover
    	class="glyph-class"
		value="zwei"
		placeholder="Auswählen ..."
		:data="['eins','zwei','drei','vier']"
		template='<span class="glyphicon"></span><span v-html="item"></span>'
    ></edit-selectover>

    <hr />

    <h5>Mit Data-Array</h5>

    <edit-selectover
		value="zwei"
		placeholder="Auswählen ..."
		:data="['eins','zwei','drei','vier']"
    ></edit-selectover>

    <hr />

    <h5>Mit Data-Array not editable</h5>

    <edit-selectover
		value="zwei"
		placeholder="Auswählen ..."
		:data="['eins','zwei','drei','vier']"
		:is-editable="false"
    ></edit-selectover>

    <hr />

    <h5>Mit Data-Object und eigenen Keys</h5>

    <edit-selectover
		value="c"
		placeholder="Auswählen ..."
		:data="{ a : 'fünf', b : 'sechs', c : 'sieben'}"
    ></edit-selectover>

    <hr />

    <h5>Mit Request-URL</h5>

    <edit-selectover
		value="eins"
		placeholder="Auswählen ..."
		data="request.htm"
    ></edit-selectover>

    <hr />

    <h5>Mit Slot-Options</h5>

    <edit-selectover
		value="beta"
		placeholder="Auswählen ..."
    >
    	<option value="alpha">Αλπηα</option>
    	<option value="beta">Βετα</option>
    	<option value="gamma">ΓΑμμα</option>
    </edit-selectover>


  </div>
</template>

<script>

	import Eover from '../Editselectoverinput.vue';
 
	export default {

		name: 'app',

		components : {
			'edit-selectover' : Eover
		},

		data () {
			return {
				msg: 'Select-Over-Test',
			}
		},

		methods : {

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

 		.glyph-class {
			.glyphicon { 
				margin-right:7px; 
			}
			.selectover-item-eins span.glyphicon:before { content: '\e033';	}
			.selectover-item-zwei span.glyphicon:before { content: '\e034';	color: green; }
			.selectover-item-drei span.glyphicon:before { content: '\e035';	color: grey; }
			.selectover-item-vier span.glyphicon:before { content: '\e036';	color: blue; }
		}

	}

	h1, h2 {
		text-align:center;
		font-weight: normal;
	}

	h5 {
		font-style:italic;
	}

	a {
		color: #CC0000;
	}

	hr {
		clear:both;
	}
</style>
