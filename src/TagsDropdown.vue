<template>
	<div class="tagsdropdown" style="position:relative;">
		<span v-for="(tag, i) in tags" class="tag label label-info">
			<component :is="tagscomponent" :tag="tag.text" @remove="removeTag(tag.value)"></component>
		</span>
		<div v-if="hasOptions" :class="[ type, { open : open }]">
			<button class="btn btn-default dropdown-toggle" type="button" :id="tmpid" @click=" open = !open" aria-haspopup="true" :aria-expanded="open ? 'true' : 'false'">
				{{ placeholder }}
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" :aria-labelledby="tmpid">
				<li v-for="option in selectableOptions">
						<a href="#" @click.prevent="hit(option.value)">{{ option.text }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

	import _ from 'lodash';
	import axios from 'axios';

	const DELAY = 300;

	export default {

		mounted : function() {
			// preset options and tags
			if (this.$slots.default && this.$slots.default.length > 0) {
	        	this.options = this.$slots.default.filter(vn => {
	        		return vn.tag == 'option';
	        	}).map(vn => {
	        		var option = {};
        			option['value'] = vn.data.attrs.value;
        			option['text'] = vn.children[0].text;
        			option['selected'] = vn.data.attrs.selected !== undefined ? true : false;
        			return option;
	        	});
            } else if (this.async) {
				var vm = this;
				axios.get(this.async)
					.then(function (response) {
						vm.setOptions(response.data);
						vm.setTags();
					})
					.catch(function (error) {
						console.log(error);
					});
			} else if (this.data) {
				this.setOptions(this.data);
			}
            //console.log(this.options);
            this.setTags();
            //console.log(this.tags);
         },

		props : {
			id: { type : String },
			name : { type : String },
			type : { type: String, default: 'dropdown' }, // dropdown or dropup
			data : { type : Array, default : null }, // { value: 1, text: 'eins', selected:true ...}
			placeholder : {type: String, default : '' }, // button-caption
			async : { type : String } // async-url für json-data
		},

		data : function() {
			return {
				options : [],
				tags : [],
				open : false,
			}
		},

		watch : {
		},

		computed : {
			tagscomponent : function() {
				return {
					template : '<span>{{ tag }}<span class="dismissable" @click="$emit(\'remove\')"></span></span>',
					props : { tag : { type: String, default: null } }
				}
			},
			tmpid : function() {
				return _.uniqueId('tagsdropdown_');
			},
			selectableOptions : function() {
				return this.options.filter(option => option.selected == false);
			},
			hasOptions : function() {
				return this.selectableOptions.length > 0;
			}
		},

		methods : {
			getDelay : function() {
				return this.delay;
			},
			hit : function(optionvalue) {
				this.addTag(optionvalue);
				this.open = ! this.open;
			},
			setTags : function() {
				this.tags = this.options.filter(option => option.selected == true );
			},
			addTag : function(tagvalue) {
				this.options = this.options.map(option => {
					option.selected = option.value == tagvalue ? true : option.selected;
					return option;
				});
				this.setTags();
			},
			removeTag : function(tagvalue) {
				this.options = this.options.map(option => {
					option.selected = option.value == tagvalue ? false : option.selected;
					return option;
				});
				//console.log(this.options);
				this.setTags();
			},
			setOptions : function(options) {
				this.options = options;
			}

		},

	}

</script>

<style lang="scss">

	$bgcolor : rgba(218,176,199,.6);

	.tagsdropdown {
		padding:5px;
		text-align:left;
		min-height:20px;
		position:relative;
		border:0;

		.tag {
			font-size:100%;
			font-weight:normal;
			border:1px solid grey;
			border-radius:5px;
			padding:3px 15px 3px 5px;
			display: inline-block;
			margin: 0 4px;
			color:black;
			background-color:lightgrey;
			position:relative;

			.dismissable::before {
				content: 'x';
				position:absolute;
				right:3px;
				top:2px;
				color:#CC0000;
				cursor:pointer;

				&:hover {
					text-decoration:underline;
				}
			}
		}

		.dropdown {
			display:inline-block;
		}
	}
</style>
