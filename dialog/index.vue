<template>
  <div v-show="value">
    <div class="mask" @click.stop="handleCancel"></div>
    <transition name="fade">
      <div class="dialog-container" @click="contentClick">
        <div class="dialog-content">
          <div class="dialog-info">
            <div class="dialog-title" v-if="title">{{title}}</div>
            <p v-if="content">{{content}}</p>
            <p style="color: #fe4743;" v-if="tips">{{tips}}</p>
          </div>
          <div>
            <slot></slot>
          </div>
          <div class="dialog-btn" v-if="!noButton">
            <div class="cancel" @click.stop="handleCancel">取消</div>
            <div class="confirm" @click="handleSubmit">{{confirmText || '确定'}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    content: String,
    tips: String,
    value: Boolean,
    noButton: Boolean,
    show: Boolean,
    confirmText: String,
  },
  methods: {
    handleCancel() {
      this.$emit('cancel');
      this.$emit('input', false);
    },
    handleSubmit() {
      this.$emit('confirm');
      this.$emit('input', false);
    },
    contentClick() {
      if (this.show) this.handleCancel();
    },
  },
  computed: {
  },
};
</script>
<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  background: #333;
  opacity: 0.85;
  top: 0;
  left: 0;
  z-index:9999;
}
.dialog-container{
  width: 80%;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
}
.dialog-title{font-size: 16px;color: #333;margin-bottom: 10px;}
.dialog-content{
  border-radius: 5px;
  background-color: #fff;
}
.dialog-info{
  text-align: center;
  padding: 40px 10px;
  p{color: #333;}
}
.dialog-btn{
  box-sizing: border-box;
  border-top: 1px solid #d7d7d7;
  height: 40px;
  line-height: 40px;
  display: flex;
  text-align: center;
  .confirm{
    color: #fe4743;
    border-left: 1px solid #d7d7d7;
  }
  div{flex: 1;}
}
</style>
