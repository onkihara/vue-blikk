<template>
    <div class="slide-away">

        <div :class="{ away : isAway }" class="front">
            <slot name="front"></slot>
            <a class="slide" v-on:click.prevent="open" href=""><slot name="right">O</slot></a>
        </div>

        <div class="back">
            <slot name="back"></slot>
            <a class="slide" v-on:click.prevent="close" href=""><slot name="left">X</slot></a>
        </div>

    </div>
</template>

<script>
    export default {

        props : {
            locked : { type : Boolean, default : false }
        },

        data : function() {
            return {
                isAway : false
            }
        },

        methods : {
            open() {
                if (this.locked) {
                    return;
                }
                this.isAway = true;
                this.$emit('opened');
            },
            close() {
                this.isAway = false;
                this.$emit('closed');
            },
            closeSilently() {
                this.isAway = false;
            }
        }

    }
</script>

<style lang="scss">
    .slide-away {
        padding:0px;
        position:relative;
        overflow:hidden;
        margin-bottom:10px;
        a.slide {
            position:absolute;
            width:40px;
            height:40px;
            line-height:40px;
            text-align:center;
            right:10px;
            top:10px;
            font-size:20px;
         }
         .front {
            position:relative;
            width:100%;
            height:100%;
            top:0px;
            left:0px;
            z-index:1001;
            transition: left .5s;
         }
        .back {
            position:absolute;
            width:100%;
            height:100%;
            top:0px;
            left:0px;
            z-index:1000;
        }
        .away {
            left: -100%;
        }
     }
 </style>
