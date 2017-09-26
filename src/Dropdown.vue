<template>
	<div :class="[ getGrouped, behaviour, { open : open }]" v-click-outside="clickedOutside">
		<button :class="getType" class="btn dropdown-toggle" type="button" :id="tmpid" @click="open = !open" aria-haspopup="true" :aria-expanded="open ? 'true' : 'false'">
			{{ text }}
			<span class="caret"></span>
		</button>
		<ul class="dropdown-menu" :aria-labelledby="tmpid">
			<slot>
				<li v-for="item in menu"><a @click="hit(item,$event)" :href="item.href">{{ item.text }}</a></li>
			</slot>
		</ul>
	</div>
</template>

<script>

	import _ from 'lodash';
	import axios from 'axios';
    import ClickOutside from './directives/ClickOutside.js';

	export default {

        directives: {
            ClickOutside
        },

		mounted : function() {
			// preset menu
			if (this.$slots.default) {
				return;
            } else if (this.async) {
				var vm = this;
				axios.get(this.async)
					.then(function (response) {
						vm.setMenu(response.data);
					})
					.catch(function (error) {
						console.log(error);
					});
			} else if (this.data) {
				this.setMenu(this.data);
			}
        },

		props : {
			id: { type : String },
			name : { type : String },
			grouped : { type : Boolean, default : false }, // btn-group or not
			text : {type: String, default : '' }, // button-caption
			type : { type : String, default : 'default'}, // default, primary, danger, success ...
			behaviour : { type: String, default: 'dropdown' }, // dropdown or dropup
			data : { type : Array, default : null }, // [ {href: 'www....', text: 'eins', prevent : true (preventsDefault())}, {...} ]
			async : { type : String } // async-url für json-data
		},

		data : function() {
			return {
				menu : [],
				open : false,
			}
		},

		watch : {
			data : function() {
				this.setMenu(this.data);
			}
		},

		computed : {
			tmpid : function() {
				return _.uniqueId('tagsdropdown_');
			},
			getType : function() {
				return 'btn-' + this.type;
			},
			getGrouped : function() {
				return this.grouped ? 'btn-group' : '';
			}
		},

		methods : {
			hit : function(item, event) {
				if (item.prevent) {
					event.preventDefault();
				}
				this.$emit('hit',item,event);
				this.open = ! this.open;
			},
			setMenu : function(items) {
				this.menu = items;
			},
			clickedOutside : function() {
				this.open = false;
			}

		},

	}

</script>

<style lang="scss">

	.dropdown {
		text-align:left;
	}
</style>
