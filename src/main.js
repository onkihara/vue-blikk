import Axios from 'axios'
import _ from 'lodash'
import Vue from 'vue'

import SlideawayExample from './examples/SlideawayExample.vue'
import EditlineExample from './examples/EditlineExample.vue'


new Vue({
  el: '#app',
  render: h => h(EditlineExample)
})
