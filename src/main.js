import Axios from 'axios'
import _ from 'lodash'
import Vue from 'vue'

import SlideawayExample from './examples/SlideawayExample.vue'


//Vue.component('slide-away',Slideaway);

new Vue({
  el: '#app',
  render: h => h(SlideawayExample)
})
