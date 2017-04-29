<template>
  <div id="app">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>

		<slide-away>

			<div slot="front">
				<h2>Front-Slot</h2>
				<p>Lorem ipsum</p>
				<h3>Jo-jo</h3>
			</div>

			<span slot="right">&lt;--</span>

			<div slot="back">
				<h2>Back-Slot</h2>
			</div>

			<span slot="left">--&gt;</span>

		</slide-away>

  </div>
</template>

<script>

	import Slideaway from '../Slideaway.vue'

	export default {

		name: 'app',

		components : {
			'slide-away' : Slideaway
		},

		data () {
			return {
				msg: 'Slideaway-Test'
			}
		},

		computed : {
			
		}
	}

</script>

<style lang="scss">

	.slide-away {
		width:30%;
		margin:auto;
		.front {
			padding:35px 0px;
			background-color:#ff9900;
		}
		.back {
			padding:35px 0px;
			background-color:#0099ff;
		}
		h2 {
			margin-top:0px;
		}
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
