<template>
  <div id="app">
    <h1>{{ msg }}</h1>

	<edit-area name="richeditarea" :save="true" :init="richinit" :asset-url="assetUrl" height="300px" placeholder="Hier Text eingeben" :limit-chars="300">
		Zwei Burschen <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</edit-area>

	<hr />

	<edit-area name="richeditarea" :file="true" :save="save_callback" :init="secondinit" :asset-url="assetUrl" height="300px" placeholder="Hier Text eingeben" href="./request.htm">
		Zwei Burschen <span style="color:red">dolor sit amet</span>, consectetur adipisicing elit. Id magnam aliquid rerum ipsa quas doloremque totam eum quod necessitatibus, reprehenderit eligendi, rem tempora dolore dolorem praesentium,<br />
		<br />
		dicta, nostrum similique blanditiis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione nobis unde adipisci vel repellat officiis magni sequi quisquam necessitatibus facere odio hic, blanditiis quae consequuntur, atque eaque voluptates eius enim.
	</edit-area>

	<hr />

	<rich-area name="first" :file="true" :init="firstinit" :asset-url="assetUrl" width="600px" height="300px" placeholder="Hier Text eingeben">
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
					plugins: 'paste, link, image, media, code',
					toolbar : "bold italic | copy cut paste | styleselect | undo redo | link unlink image media | code",
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
		},

		methods : {
			save_callback(editor) {
				console.log(editor.getContent());
			},
			file_picker(callback, value, meta) {
				// Provide file and text for the link dialog
			    if (meta.filetype == 'file') {
			      callback('mypage.html', {text: 'My text'});
			    }

			    // Provide image and alt text for the image dialog
			    if (meta.filetype == 'image') {
			      callback('myimage.jpg', {alt: 'My alt text'});
			    }

			    // Provide alternative source and posted for the media dialog
			    if (meta.filetype == 'media') {
			      callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
			    }
			}
		}
	}

</script>

<style lang="scss">

    // Bootstrap
    $icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
    @import "~bootstrap-sass/assets/stylesheets/bootstrap";

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
