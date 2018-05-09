//
// Mixin for Editline.vue und Editarea.vue. 
//
//  Needs  @keyup="limitLength" in input/textarea tag
//
//  The component looks this way: <span class="charlimiter" :class="runningOut" v-if="limitChars > 0 && editmode" v-text="limit"></span>
//

export default {
    props : {
        limitChars : { type : Number, default: 0 },
    },

    data : function() {
        return {
            limit : this.limitChars,
        }
    },

    mounted : function() {
        // check for max length
        this.limit = this.limit - this.getLength();
        if (this.limitChars > 0 && this.limit < 0) {
            this.limit = 0;
            this.trimText();
        }
    },

    computed : {
        runningOut() {
            return {
                'running-out' : this.limit <= Math.round(this.limitChars * .1),
                'ran-out' : this.limit <= 0
            }
        }
    },

    watch : {
        val(newVal) {
            if (this.limitChars == 0) return;
            this.limit = this.limitChars - this.getLength(newVal);
            if (this.limit < 0) this.limit = 0;
        }
    },

    methods : {
        limitLength : function() {
            if (this.limitChars > 0 && this.limit == 0) {
                this.val = this.val.substring(0,this.limitChars);
            }
        },
        getLength : function(content) {
            return content ? content.length : (this.$refs.text ? this.$refs.text.textContent.trim().length : 0);
        },
        trimText : function() {
            this.$refs.text.textContent = this.$refs.text.textContent.trim().substring(0,this.limitChars);
        }
    }

}