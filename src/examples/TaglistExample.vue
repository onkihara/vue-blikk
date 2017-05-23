<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<hr />

	<taglist separator="," :quote="false">
		eins, zwei, drei
	</taglist>

  </div>
</template>

<script>

	import Taglist from '../Taglist.vue'

	export default {

		name: 'app',

		components : {
			'taglist' : Taglist
		},

		data () {
			return {
				msg: 'Taglist-Test'
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
