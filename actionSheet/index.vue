<template>
  <div>
    <div class="mask" v-if="value" @click.stop="handleClose"></div>
    <div class="action-sheet-container" :style="translateY">
      <div class="tips">
        <slot name="tips"></slot>
      </div>
      <div v-if="picker">
        <slot></slot>
      </div>
      <div class="handle-content" v-else>
        <div class="menus-content">
          <p v-if="menus" @click="handleClick(value)" class="items" v-for="(key ,value) in menus" :key="key">{{key}}</p>
          <slot></slot>
        </div>
        <p class="cancel-btn" @click="handleClose">取消</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    menus: [Array, Object],
    picker: Boolean,
    height: {
      type: String,
      default: '50%',
    },
  },
  computed: {
    translateY() {
      let base = `height: auto;max-height: ${this.height};`;
      let transform;
      if (this.value && this.picker) transform = 'transform: translateY(0px)';
      else if (this.value) transform = 'transform: translateY(-20px)';
      else transform = 'transform: translateY(100%)';
      return `${base}${transform}`;
    },
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
    },
    handleClick(val) {
      this.handleClose();
      this.$emit('click', val);
    },
  },
  created() {
  },
};
</script>
<style lang="less" scoped>
.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #333;
  opacity: 0.85;
  z-index: 999;
}
.action-sheet-container{
  overflow-y: auto;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  transition: all .2s;
  z-index: 1000;
  .tips p{text-align: center;font-size: 14px;color: #fff;}
}
.handle-content{
  color: #333;
  font-size: 16px;
  text-align: center;
  p{
    height: 44px;
    line-height: 44px;
  }
}
.menus-content{
  margin: 10px auto;
  width: 90%;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  .items{box-sizing: border-box;}
  .items+.items{
    border-top: 1px solid #d7d7d7;
  }
}
.cancel-btn{
  width: 90%;
  border-radius: 5px;
  margin: 0 auto;
  background-color: #fff;
}
</style>
