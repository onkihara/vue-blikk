<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<h2>TagsDropdown</h2>

	<h3>Mit Options</h3>

		<tags-dropdown text="Auswahl">
			<option value="1">eins</option>
			<option value="2" selected>zwei</option>
			<option value="3">drei</option>
			<option value="4">vier</option>
			<option value="5" selected>fünf</option>
		</tags-dropdown>

	<h3>Mit Data-Attribute</h3>

		<tags-dropdown text="mit Data" :data="data" name="withdata"></tags-dropdown>

	<h3>Mit Async-Http-Request</h3>

		<tags-dropdown text="Async" async="requests/tagsdropdown_data.json" async-key="key"></tags-dropdown>

	<h2>Dropdown</h2>

		<drop-down :grouped="true" text="Dropdown" type="primary">
			<li><a href="test1">eins</a></li>
			<li><a href="test2">zwei</a></li>
		</drop-down>

		<drop-down :grouped="true" text="With Data" :data="dropdownData"></drop-down>

	<h2>EditTagsdropdown</h2>

	<h3>Mit Options</h3>

		<edit-tagsdropdown text="Auswahl">
			<option value="1">eins</option>
			<option value="2" selected>zwei</option>
			<option value="3">drei</option>
			<option value="4">vier</option>
			<option value="5" selected>fünf</option>
		</edit-tagsdropdown>

  </div>
</template>

<script>

	import TagsDropdown from '../TagsDropdown.vue'
	import Dropdown from '../Dropdown.vue'
	import EditTagsdropdown from '../EditTagsdropdown.vue'

	export default {

		name: 'app',

		components : {
			'tags-dropdown' : TagsDropdown,
			'drop-down' : Dropdown,
			'edit-tagsdropdown' : EditTagsdropdown
		},

		data () {
			return {
				msg: 'EditTagsDropdown-Test',
				data : [
					{ value : 1, text : 'eins', selected : true },
					{ value : 2, text : 'zwei', selected : false },
					{ value : 3, text : 'drei', selected : false },
					{ value : 4, text : 'vier', selected : false },
				],
				dropdownData : [
					{ href : 1, text : 'eins', prevent : true }, // prevent = true => preventsDefault on click on href
					{ href : 2, text : 'zwei', prevent : false },
					{ href : 3, text : 'drei', prevent : true },
					{ href : 4, text : 'vier', prevent : true },
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
		display: inline-block;
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
