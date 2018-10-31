<template>
  <div class="checker-box">
    <div class="check-list">
      <div 
      @click="handleClick(item.value)"
      class="list-item" 
      v-for="item in checkList"
      :key="item.value">
        <p v-if="item.value === currentValue"><i class="iconfont icon-selected"></i>{{item.label}}</p>
        <p class="not-select" v-else><i class="iconfont icon-not-selected"></i>{{item.label}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    checkList: {
      type: Array,
      default() {
        return [
          { value: 'personal', label: '个人' },
          { value: 'enterprise', label: '企业' },
        ];
      },
    },
    value: [String, Boolean, Number],
  },
  data() {
    return {
    };
  },
  methods: {
    handleClick(v) {
      this.$emit('input', v);
    },
  },
  computed: {
    currentValue() {
      return this.value;
    },
  },
};
</script>
<style lang="less" scoped>
.check-list{
  display: flex;
  font-size: 12px;
  align-items: center;
  i{margin-right: 2px;}
  .list-item+.list-item{
    margin-left: 15px;
  }
  p{
    color: #666;
  }
  .not-select{
    color: #999;
  }
}
</style>
