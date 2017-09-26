<template>
	<div class="tagsdropdown" style="position:relative;">

		<span v-for="(tag, i) in tags" class="tag label label-info">
			<component :is="tagscomponent" :tag="tag.text" @remove="removeTag(tag.value)"></component>
		</span>

		<drop-down v-if="hasOptions" :data="menu" :text="text" @hit="hit"></drop-down>

		<input type="hidden" v-for="tag in tags" :name="getName" :value="tag.value" />

	</div>
</template>

<script>

	import _ from 'lodash';
	import axios from 'axios';
	import Dropdown from './Dropdown.vue';

	export default {

		components : {
             'drop-down' : Dropdown
        },

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
            	this.setTags();
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
            	this.setTags();
			}
            //console.log(this.options);
            //console.log(this.tags);
         },

		props : {
			id: { type : String },
			name : { type : String },
			type : { type: String, default: 'dropdown' }, // dropdown or dropup
			data : { type : Array, default : null }, // [ {value: 1, text: 'eins', selected:true}, {...} ]
			text : {type: String, default : '' }, // button-caption
			async : { type : String } // async-url für json-data
		},

		data : function() {
			return {
				options : [],
				tags : [],
				menu : [],
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
			hasOptions : function() {
				return this.menu.length > 0;
			},
			getName : function() {
				return this.name ? this.name + '[]' : this.text + '[]';
			}
		},

		methods : {
			hit : function(item,event) {
				this.addTag(item.href);
			},
			setMenu : function() {
				this.menu = this.options.filter(option => option.selected == false)
					.map(option => {
						return { href : option.value, text : option.text, prevent : true };
					});
				//console.log(this.menu);
			},
			setTags : function() {
				this.tags = this.options.filter(option => option.selected == true );
				this.setMenu();
			},
			addTag : function(tagvalue) {
				this.options = this.options.map(option => {
					option.selected = option.value == tagvalue ? true : option.selected;
					return option;
				});
				this.setTags();
				this.$emit('added',this.find(tagvalue));
			},
			removeTag : function(tagvalue) {
				this.options = this.options.map(option => {
					option.selected = option.value == tagvalue ? false : option.selected;
					return option;
				});
				//console.log(this.options);
				this.setTags();
				this.$emit('removed',this.find(tagvalue));
			},
			find : function(value) {
				return this.options.filter(option => option.value == value)[0];
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
