<template>
	<span class="taglist">
		<span class="tag" v-for="tag in tags">{{ tag }}</span>
	</span>
</template>

<script>

export default {

	props: {
		separator: {type: String, default: ','},
		quote: {type: Boolean, default: false},
		data: { type: Array} // tags as array
	},

	mounted() {
		if (this.data) {
			this.tags = this.data;
		} else {
			this.val = this.$slots.default ? this.$slots.default[0].text : '';
			this.setTags();
		}
	},

	data() {
		return {
			tags: [],
			val : ''
		}
	},

	watch : {
		val(act, old) {
			if (act !== old) {
				this.setTags();
			}
		},
		data(act, old) {
			if (act !== old) {
				this.tags = this.data;
			}
		}
	},

	methods: {
		setTags() {
			if (this.quote) {
				this.tags = this.val.split(this.separator).map(tag => tag.trim().replace(/^"+|"+$/g,''));
			} else {
        		this.tags = this.val.split(this.separator).map(tag => tag.trim());
        	}
		}
	}
}
</script>

<style>
	.taglist {
		list-style-type: none;
		padding: 0;
	}

	.taglist .tag {
		border:1px solid grey;
		border-radius:5px;
		padding:3px 5px;
		display: inline-block;
		margin: 0 4px;
		color:black;
		background-color:lightgrey;
	}


</style>
