<template>
  <div>
    <div class="toast-content">
      <div class="toast-mask" v-show="show || isShow"></div>
      <transition :name="text ? 'fade' : ''">
        <div class="toast-text" v-show="show || isShow">
          <p v-if="!isShow">{{text}}</p>
          <div class="loading-box" v-else>
            <img class="loading-animation" src="../assets/loading.png" alt="">
            <p>加载中</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      isLoading: false,
      timer: null,

      cb: null,
    };
  },
  props: {
    text: String,
    isShow: Boolean,
  },
  methods: {
  },
  watch: {
    show(val) {
      if (val && !this.isLoading) {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.cb && typeof this.cb === 'function' && this.cb();
          this.cb = null;
          this.show = false;
        }, 1500);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.toast-text{
  z-index: 5001;
  width: 7.6em;
  padding: 10px;
  background: rgba(17, 17, 17, 0.7);
  color: #fff;
  border-radius: 5px;
  text-align: center;
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
.toast-mask{
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.loading-box{
  padding: 20px 0;
  img{
    width: 38px;
    height: 38px;
  }
}

.loading-animation{
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  10% {transform: rotate(36deg)}
  20% {transform: rotate(72deg)}
  30% {transform: rotate(108deg)}
  40% {transform: rotate(144deg)}
  50% {transform: rotate(180deg)}
  60% {transform: rotate(216deg)}
  70% {transform: rotate(252deg)}
  80% {transform: rotate(288deg)}
  90% {transform: rotate(324deg)}
  100% {transform: rotate(360deg)}
}
</style>
