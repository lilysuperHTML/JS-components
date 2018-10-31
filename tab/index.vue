<template>
  <div class="tab-box flex-space-center">
    <div 
    class="tab-item"
    v-for="(item, index) in tabList"
    :class="{selected: value === item.value}"
    @click="handleClick(item.value)"
    :key="index">
      <div>{{item.label}}</div>
      <div class="border-line"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabList: Array,
    value: [String, Number],
  },
  methods: {
    handleClick(val) {
      this.$emit('input', val);
      this.$emit('click', val);
    },
  },
  created() {
  },
};
</script>
<style lang="less" scoped>
.tab-box{position: sticky;padding: 10px 0;background-color: #fff;}
.tab-item{
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #999;
  &.selected{
    color: #fe4743;
    .border-line{border-bottom: 2px solid #fe4743;}
  }
}
.border-line{width: 30px;height: 6px;box-sizing: border-box;margin: 0 auto;}
</style>
