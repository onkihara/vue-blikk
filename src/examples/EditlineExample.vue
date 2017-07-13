<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<h2><edit-line 
		name="title" 
		href="http://localhost:8080/request.html" 
		colorerror="red"
		placeholder="Zeile zum ändern ..."
	></edit-line></h2>

	<h2><edit-area 
		name="info" 
		placeholder="Weitere Informationen ..." 
		:br="true" 
		href="http://localhost:8080/request.html"
	>	</edit-area></h2>


  </div>
</template>

<script>

	import Editline from '../Editline.vue'
	import Editarea from '../Editarea.vue'

	export default {

		name: 'app',

		components : {
			'edit-line' : Editline,
			'edit-area' : Editarea
		},

		data () {
			return {
				msg: 'Editline-Test'
			}
		},

		computed : {
			
		}
	}

</script>

<style lang="scss">

	.edit-line {
		
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
