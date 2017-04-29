<template>
<div id="example-1">

  <button @click="show = !show">
    Toggle render
  </button>

  <transition name="slide-fade">
    <div v-if="show" class="fader"><slot></slot></div>
  </transition>

</div>
</template>

<script>
export default {
  data: function() {
    return { show: true} 
  }
}
</script>

<style>
.fader {
	position:relative;
	left:0px;
	background-color:green;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  left:-100%;
}
</style>