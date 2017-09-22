<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<h2>TagsDropdown</h2>

	<h3>Mit Options</h3>
	<tags-dropdown placeholder="Auswahl">
		<option value="1">eins</option>
		<option value="2" selected>zwei</option>
		<option value="3">drei</option>
		<option value="4">vier</option>
		<option value="5" selected>fünf</option>
	</tags-dropdown>

	<h3>Mit Data-Attribute</h3>
	<tags-dropdown placeholder="mit Data" :data="data"></tags-dropdown>

	<h3>Mit Async-Http-Request</h3>
	<tags-dropdown placeholder="Async" async="requests/tagsdropdown_data.json" async-key="key"></tags-dropdown>

  </div>
</template>

<script>

	import TagsDropdown from '../TagsDropdown.vue'

	export default {

		name: 'app',

		components : {
			'tags-dropdown' : TagsDropdown
		},

		data () {
			return {
				msg: 'EditTagsDropdown-Test',
				data : [
					{ value : 1, text : 'eins', selected : true },
					{ value : 2, text : 'zwei', selected : false },
					{ value : 3, text : 'drei', selected : false },
					{ value : 4, text : 'vier', selected : false },
				]
			}
		}
	}

</script>

<style lang="scss">

	// Bootstrap
	$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
	@import "~bootstrap-sass/assets/stylesheets/bootstrap";


	.tagsdropdown {
		width:50%;
		margin:auto;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	h1, h2 {
		font-weight: normal;
	}

	a {
		color: #CC0000;
	}
</style>
