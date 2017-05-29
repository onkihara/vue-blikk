<template>
	<div class="dropdown-input" style="position: relative">
		<div class="input-group">
			<input type="text" 
				v-model="val" 
				class="form-control" 
				autocomplete="off" 
				:name="name" 
				:placeholder="placeholder"
				@blur="blur" 
				@keydown.esc="esc"
				@keydown.enter="enter"
			 />
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

export default {
	props: {
		name : { type:String, default : 'dropdowninput'},
		btnText : { type: String, default : ''},
		data: { type: Object },
		placeholder: {type: String},
		template: {type: String},
		value: {type: String, default: ''},
		disabled : {type: Boolean, default: false }
	},
	data () {
		return {
			items : this.data,
			current: 0,
			showDropdown : false,
			val: this.value,
			old: this.value,
			btnDisabled : this.disabled
		}
	},

	watch : {
		// watches property-change of parent
		data() {
			this.items = this.data;
		},
		disabled() {
			this.btnDisabled = this.disabled;
		},
		value() {
			this.val = this.value;
		}
	},

	mounted() {
		
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
		hit() {
			this.showDropdown = false;
			this.val = this.items[this.current];
			this.$emit('selected',this.val,this.current);
		},
		setActive (index) { this.current = index },
		isActive (index) { return this.current === index },
		blur() { this.$emit('blur',this.val); },
		esc() { this.val = this.old; this.$emit('esc',this.val); },
		enter() { this.$emit('changed',this.val); }
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
