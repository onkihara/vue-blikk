<template>
	<div class="tagsinput form-control" @click="focus" :class="{ active : active, open : showDropdown }" style="position:relative;">
		<span v-for="(tag, i) in tags" class="tag label label-info">
			<component :is="tagscomponent" :tag="tag" @remove="removeTag(i)"></component>
		</span>
		<input  type="text"
			ref="taginput"
			v-model="tagvalue" 
			:placeholder="placeholder" 
			:size="size" 
			@keypress="separate" 
			@keydown="keyTag"
			@blur="blur"
			@keydown.enter.prevent="hit"
			@keydown.down.prevent="down"
			@keydown.esc="reset"
			@keydown.up.prevent="up"
		/>
		<ul v-if="true" class="typeahead dropdown-menu" ref="dropdown">
			<li v-for="(item, i) in items" :class="{active: isActive(i)}">
				<a @mousedown.prevent="hit" @mousemove="setActive(i)">
					<component :is="typeaheadcomponent" :item="item"></component>
				</a>
			</li>
		</ul>
		<input type="hidden"
			:id.once="id"
			:name.once="name"
		    v-model="val"
		/>
	</div>
</template>

<script>

	const SIZE = 7;
	const DELAY = 300;
	const LIMIT = 8;
	const SEPARATOR = ',';

	export default {

		mounted : function() {
			// preset tags
			if (this.val) {
				if (this.quote) {
					this.tags = this.val.split(this.separator).map(tag => tag.trim().replace(/^"+|"+$/g,''));
				} else {
	        		this.tags = this.val.split(this.separator).map(tag => tag.trim());
	        	}
            }
            // is typeahead
            if (this.data || this.async) {
            	this.typeahead = true;
            }
        },

		props : {
			data: { type : Array },
			id: { type : String },
			name : { type : String },
			placeholder : {type: String },
			value :  { type : String, default : '' },
			separator : { type : String, default : SEPARATOR },
			quote : { type : Boolean, default : false },
			// typeahead
			onHit: {
				type: Function,
				default (item) { return item }
			},
			async : { type : String },
			data : { type : Array },
			delay : { type : Number, default : DELAY },
			asyncKey : { type : String, default : null },
			template: {type: String},
			limit : { type : Number, default : LIMIT},
			matchCase : { type : Boolean, default : false },
			matchStart : { type : Boolean, default : false }
		},

		data : function() {
			return {
				active : false,
				val : this.value,
				tags : [],
				size : SIZE,
				tagvalue : '',
				// typeahead
				typeahead : false,
				items : [],
				asign : '',
				showDropdown : false,
				noResults : true,
				current : 0
			}
		},

		watch : {
			tags : function() {
				if (this.quote) {
					this.val = '"' + this.tags.join('"' + this.separator + '"') + '"';
				} else {
					this.val = this.tags.join(this.separator);
				}
			},
			tagvalue : function(val, old) {
				if (val !== old && val !== this.asign) this.__update();
			}
		},

		computed : {
			tagscomponent : function() {
				return {
					template : '<span>{{ tag }}<span class="dismissable" @click="$emit(\'remove\')"></span></span>',
					props : { tag : { type: String, default: 'Washington' } }
				}
			},
			typeaheadcomponent : function() {
				return {
					template: typeof this.template === 'string' ? '<span>' + this.template + '</span>' : '<strong v-html="item"></strong>',
					props: { item: {default: null} }
				}
			}
		},

		methods : {
			getDelay : function() {
				return this.delay;
			},
			focus : function(e) {
				this.$refs.taginput.focus();
				this.active = true;
			},
			blur : function() {
				this.addTag();
				this.active = false;
				// typeahead
				this.showDropdown = false;
			},
			hit : function(e) {
				// typeahead
				if (this.showDropdown) {
					this.setValue(this.onHit(this.items[this.current], this));
				} else {
					if (e.key == 'Enter' && this.tagvalue == '') {
						this.$emit('enter');
					}
					this.addTag();
				}
			},
			removeTag : function(tagindex) {
				if (this.tags[tagindex]) {
					this.tags.splice(tagindex,1);
				}
			},
			keyTag : function(e) {
				// filter (up/down/left/right)
				if (e.keyCode >= 37 && e.keyCode <= 40) {
					return;
				}
				// backspace
				if (e.keyCode == 8) {
					if (this.size > SIZE) {
						this.size--;
					} else if (this.tags.length > 0) {
						this.removeTag(this.tags.length-1);
						this.showDropdown = false;
					}
					return;
				}
				// default
				this.size++;
			},
			// separator (e. g. ',')
			separate : function (e) {
				if (e.charCode == this.separator.charCodeAt(0)) {
					e.preventDefault();
					this.addTag();
					return;
				}
			},
			addTag : function() {
				if ( ! this.tagvalue) {
					return;
				}
				this.tags.push(this.tagvalue);
				this.tagvalue = '';
				this.size = SIZE;
				this.showDropdown = false;
			},
			// typeahead
			reset : function() { 
				this.setValue(null); 
				this.$emit('reset');
			},
			setActive : function(index) { this.current = index; },
			isActive : function(index) { return this.current === index; },
			setValue : function(value) {
				this.asign = value;
				this.tagvalue = value;
				this.addTag();
				this.items = [];
				this.showDropdown = false;
			},
			up : function() {
				if (this.current > 0) { 
					this.current--;
				} else { 
					this.current = this.items.length - 1;
				}
			},
			down : function() {
				if (this.current < this.items.length - 1) {
					this.current++;
				} else { 
					this.current = 0;
				}
			},
			setItems : function(data) {
				if (this.async) {
					this.items = this.asyncKey ? data[this.asyncKey] : data;
					this.items = this.items.slice(0, this.limit);
				} else {
					this.items = (data || []).filter(value => {
						if (typeof value === 'object') { return true }
						value = this.matchCase ? value : value.toLowerCase();
						var query = this.matchCase ? this.tagvalue : this.tagvalue.toLowerCase();
						return this.matchStart ? value.indexOf(query) === 0 : value.indexOf(query) !== -1;
					}).slice(0, this.limit)
				}
				// show dropdown on right position
				if (this.showDropdown = this.items.length > 0) {
					var vm = this;
					this.$nextTick(function () {
						vm.$refs.dropdown.style.left = vm.$refs.taginput.offsetLeft + 'px';
					});
				}
			},
			
			__update : _.throttle(function () {
				var search = this.tagvalue.trim();
				if (!search) {
					this.setValue(null); 
					return;
				}
				this.asign = ''
				if (this.async) {
					var vm = this;
					axios.get(this.async + search)
						.then(function (response) {
							vm.setItems(response.data);
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (this.data) {
					this.setItems(this.data);
				}
			}, this.delay, { leading : false })
		}
	}

</script>

<style lang="scss">

	$bgcolor : rgba(218,176,199,.6);

	.tagsinput {
		border:1px solid grey;
		padding:5px;
		text-align:left;
		min-height:20px;
		position:relative;

		input {
			border:none;
			font-size:1em;
			&:focus {
				outline:none;
			}
		}

		.tag {
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
				font-size:.7em;
				color:#CC0000;
				cursor:pointer;

				&:hover {
					text-decoration:underline;
				}
			}
		}
		
		.dropdown-menu {
		    position:absolute;
		    top:100%;
		    left:0px;
		    min-width:160px;
		    z-index:1000;
		    padding:5px 0;
		    margin:2px 0 0;
		    list-style:none;
		    text-align:left;
		    border:1px solid #CCC;
		    display:none;

		    & > li {
			    display:block;
			    &.active {
			    	background-color:$bgcolor;
			    }
			    & > a {
			    	display:inline-block;
			    	margin:3px 0px;
			    	padding:2px;
			    	width:100%;
				    cursor: pointer;
			    }
			}
		}

		&.open .dropdown-menu {
			display:block;
		}
	}
</style>
