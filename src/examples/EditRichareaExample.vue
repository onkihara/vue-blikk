<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<rich-area name="title">
		Lorem ipsum <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</rich-area>

	<hr />

	<edit-area name="title">
		Lorem ipsum <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</edit-area>


  </div>
</template>

<script>

	import Richarea from '../Richarea.vue';
	import Editor from '../EditRicharea.vue';

	export default {

		name: 'app',

		components : {
			'edit-area' : Editor,
			'rich-area' : Richarea
		},

		data () {
			return {
				msg: 'Rich-Editarea-Test',
				content : ''
			}
		}
	}

</script>

<style lang="scss">
	hr { margin:30px; }

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
