<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<h1><edit-typeahead name="title" href="http://localhost:8080" :data="daten" colorerror="red" :allow-new="true" :debug="true">
		drei
	</edit-typeahead></h1>

  </div>
</template>

<script>

	import Edittypeahead from '../Edittypeahead.vue'

	export default {

		name: 'app',

		components : {
			'edit-typeahead' : Edittypeahead
		},

		data () {
			return {
				msg: 'Edittypeahead-Test',
				daten : ['eins','zwei','drei']
			}
		}
	}

</script>

<style lang="scss">

	.edit-area {
		
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

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #CC0000;
	}
</style>
