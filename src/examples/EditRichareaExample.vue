<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<edit-area name="richeditarea" :init="richinit" :asset-url="assetUrl" height="300px" placeholder="Hier Text eingeben">
		Zwei Burschen <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</edit-area>

	<hr />

	<edit-area name="richeditarea" :init="secondinit" :asset-url="assetUrl" height="300px" placeholder="Hier Text eingeben">
		Zwei Burschen <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</edit-area>

	<hr />

	<rich-area name="first" :init="firstinit" :asset-url="assetUrl" width="600px" height="300px" placeholder="Hier Text eingeben">
		Lorem ipsum <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</rich-area>

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
				assetUrl : "/dist/tinymce/",
				firstinit : {
					//skin : 'charcoal',
					language : 'de',
					menubar : false,
					plugins: 'paste, link',
					toolbar : "bold italic | copy cut paste | styleselect | undo redo | link unlink image media",
				},
				richinit : {
					skin : 'lightgray',
					language : 'es',
					menubar : false,
					plugins: 'paste, link',
					toolbar : "bold italic | copy cut paste | styleselect | undo redo | link unlink image media",
				},
				secondinit : {
					skin : 'charcoal',
					language : 'it',
					menubar : false,
					plugins: 'paste, link',
					toolbar : "bold italic | copy cut paste | styleselect | link unlink image media",
				}
			}
		}
	}

</script>

<style lang="scss">

	.rich-area > div{
		margin:auto;
	}
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
