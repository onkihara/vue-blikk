<template>
	<div class="dropdown-input" style="position: relative">
		<div class="input-group">
			<input type="text" 
				ref="input"
				v-model="val" 
				class="form-control" 
				autocomplete="off" 
				:name="name" 
				:placeholder="placeholder"
				@focus="hasfocus($event)"
				@blur="blur" 
				@keydown="keydown"
				@keydown.esc="esc"
				@keydown.enter="enter"
			/>
			<div ref="options" style="display:none"><slot></slot></div>
			<div class="input-group-btn">
				<button class="btn btn-default dropdown-toggle" type="button" @click="showDropdown = !showDropdown" :disabled="btnDisabled">{{ btnText }} <span class="caret"></span></button>
			</div>
			<ul v-if="showDropdown" class="dropdown-menu dropdown-menu-right" ref="dropdown">
				<li v-for="(item, i) in items" :class="{active: isActive(i)}">
					<a @mousedown.prevent="hit" @mousemove="setActive(i)">
						<component :is="listitem" :item="item"></component>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

import Axios from 'axios';
import _ from 'lodash';

export default {
	props: {
		name : { type:String, default : ''},
		btnText : { type: String, default : ''},
		data: { }, // object or array or string (async-url)
		placeholder: {type: String},
		editable: {type: Boolean, default : true },
		template: {type: String},
		value: {type: String, default: ''},
		disabled : {type: Boolean, default: false }
	},
	data () {
		return {
			items : [],
			keys : [],
			current: 0,
			showDropdown : false,
			val : '',
			key: this.value,
			old: this.value,
			btnDisabled : this.disabled
		}
	},

	watch : {
		// watches property-change of parent
		data() {
			this.setItems();
		},
		disabled() {
			this.btnDisabled = this.disabled;
		},
		value() {
			this.old = this.key = this.value;
			this.setValue();
		}
	},

	mounted() {
		this.setItems();
	},

	computed : {
		listitem () {
			return {
				template: typeof this.template === 'string' ? '<span>' + this.template + '</span>' : '<strong v-html="item"></strong>',
				props: { item: {default: null} }
			}
		}
	},

	methods : {
		keydown(event) {
			if ( ! this.editable) {
				event.preventDefault();
			}
		},
		hit() {
			this.showDropdown = false;
			this.key = this.keys[this.current];
			this.val = this.items[this.current];
			this.$emit('selected',this.key,this.val);
		},
		setActive (index) { this.current = index },
		isActive (index) { return this.current === index },
		blur() { this.$emit('blur',this.key,this.val); },
		esc() { 
			this.key = this.old; 
			this.setValue();
			this.$emit('esc',this.key, this.val); 
			this.showDropdown = false; 
		},
		enter() { this.$emit('enter',this.key, this.val); },
		focus() { this.$refs.input.focus(); },
		hasfocus() {
			if ( ! this.editable) { this.showDropdown = true; }
		},
		setItems(items) {
			items = items || this.data;
			this.items = [];
			this.keys = [];
			var options = this.$refs.options.children;
			if (_.isString(items) && items !== '') {
				this.getAsyncData(items);
			} else if (_.isArray(items)) {
				this.items = this.keys = items;
			} else if (_.isObject(items)) {
				_.forEach(items, (val, key) => {
					this.items.push(val);
					this.keys.push(key);
				});
			} else if (options.length > 0) {
				_.forEach(options, (option) => {
					this.items.push(option.innerText);
					this.keys.push(option.value);
				});
			}
			this.setValue();
		},
		setValue() {
			var index = _.findIndex(this.keys, (item) => { return item == this.value });
			if (index !== -1) {
				this.key = this.keys[index];
				this.val = this.items[index];
			}
		},
		getAsyncData(requesturl) {
			Axios.get(requesturl)
				.then((response) => {
					var data = response.data;
					if (_.isString(data)) data = JSON.parse(data);
					if (_.isObject(data)) this.setItems(data);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		getKey() {
			return this.key;
		},
		getValue() {
			return this.val;
		}

	}

}
</script>

<style lang="scss">

	.dropdown-input {
		& > .input-group {
			ul.dropdown-menu {
				display:block;
				width:100%;
				a {
					cursor:pointer;
				}
			}
		}
	}

</style>
