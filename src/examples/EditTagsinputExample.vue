<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<edit-tagsinput separator="," :quote="true" :data="data">
		"eins" , "zwei", "drei"
	</edit-tagsinput>

  </div>
</template>

<script>

	import Edittagsinput from '../Edittagsinput.vue'

	export default {

		name: 'app',

		components : {
			'edit-tagsinput' : Edittagsinput
		},

		data () {
			return {
				msg: 'Edittagsinput-Test',
				data : ['eins','zwei','drei','vier','fünf']
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

	a {
		color: #CC0000;
	}
</style>
