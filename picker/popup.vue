<template>
  <div>
    <div class="picker-wrapper" :style="wrapperHeight" @touchstart.prevent="handleStart" @touchmove.prevent="handleMove" @touchend.prevent="handleEnd">
      <div class="mask"></div>
      <div class="indicator" :style="maskStyle"></div>
      <div class="content" :style="translateStyle">
        <p class="item" v-for="(item, index) in list" :key="index">{{item[alias.label] || item}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      start: null,
      end: null,

      defaultTranslate: 0,

      // 缓存的偏移距离
      translateY: 0,
      diff: 0,

      // 每一项的高度 这个需要内部写死
      item_height: 32,
      sec: 0,

      // 当前索引
      curIndex: 0,

      // 是否已经初始化选项
      hasInit: false,
    };
  },
  props: {
    height: {
      type: Number,
      default: 220,
    },
    alias: {
      type: Object,
      default() {
        return {
          value: 'value',
          label: 'label',
        };
      },
    },
    value: [String, Number],
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {
    this.defaultTranslate = this.height / 2 - this.item_height / 2;
    this.translateY = this.diff = this.defaultTranslate;
    // 仅在日期选择时生效
    if (this.list.length) this.selectInit();
  },
  /*
    异步数据无法在created钩子函数中触发选项初始化
    这里初步考虑在watch中做
  */
  watch: {
    value() {
      // 每次都触发执行初始化开销太大 做一个开关执行一次
      if (!this.hasInit) {
        this.hasInit = true;
        this.selectInit();
      }
    },
  },
  computed: {
    wrapperHeight() {
      return `height: ${this.height}px`;
    },
    maskStyle() {
      return `top: ${this.defaultTranslate}px`;
    },
    translateStyle() {
      return `transition: all ${this.sec}s;transform: translateY(${this.diff}px)`;
    },
    maxTranslateY() {
      let l = this.list.length;
      return this.defaultTranslate - (l - 1) * this.item_height;
    },
    selectValue() {
      return this.list[this.curIndex][this.alias.value] || this.list[this.curIndex];
    },
    selectLabel() {
      return this.list[this.curIndex][this.alias.label] || this.list[this.curIndex];
    },
    offset() {
      if (this.curIndex === 0) return this.defaultTranslate;
      else if (this.curIndex === this.list.length - 1) return this.maxTranslateY;
      return this.defaultTranslate - (this.curIndex * this.item_height);
    },
  },
  methods: {
    // 滑动数据初始化
    selectInit() {
      let idx;
      if (typeof this.list[0] === 'string') {
        idx = this.list.findIndex(v => v === this.value);
      } else {
        idx = this.list.findIndex(v => v[this.alias.value] === this.value);
      }
      // eslint-disable-next-line
      this.curIndex = ~idx ? idx : 0;
      this.emitValue();
    },
    // 广播数据变动
    emitValue() {
      this.diff = this.translateY = this.offset;
      this.$emit('select', this.selectValue, this.selectLabel);
      this.$emit('input', this.selectValue);
    },
    // 修复偏移坐标
    fixedDiff(n) {
      if (n > this.defaultTranslate) this.curIndex = 0;
      else if (n < this.maxTranslateY) this.curIndex = this.list.length - 1;
      else this.curIndex = Math.round(-(n - this.defaultTranslate) / this.item_height);
    },
    // 上滑下滑设置限制
    checkDiff(n) {
      if (n > this.defaultTranslate + this.item_height / 2) return this.defaultTranslate + this.item_height / 2;
      if (n < this.maxTranslateY - this.item_height / 2) return this.maxTranslateY - this.item_height / 2;
      return n;
    },
    handleStart(e) {
      this.sec = 0;
      this.start = e.changedTouches[0].pageY;
    },
    handleMove(e) {
      this.end = e.changedTouches[0].pageY;
      let diff = this.translateY + this.end - this.start;
      this.diff = this.checkDiff(diff);
    },
    handleEnd() {
      this.sec = 0.3;
      this.fixedDiff(this.diff);
      this.emitValue();
    },
  },
};
</script>
<style lang="less" scoped>
.picker-wrapper{
  background-color: #fff;
  text-align: center;
  overflow: hidden;
  position: relative;
  width: 100%;
  .content{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    margin: 0 auto;
    width: 100%;
    z-index: 10;
  }
  .indicator{
    position: absolute;
    left: 0;
    width: 100%;
    height: 32px;
    z-index: 3;
    background-image: linear-gradient(to bottom, #d0d0d0, #d0d0d0, transparent, transparent), linear-gradient(to top, #d0d0d0, #d0d0d0, transparent, transparent);
    background-position: top, bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .mask{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    margin: 0 auto;
    width: 100%;
    z-index: 3;
    transform: translateZ(0px);
    background-image: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.6)), linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
    background-position: top, bottom;
    background-size: 100% 102px;
    background-repeat: no-repeat;
  }
  .item{
    padding: 5px 0;
  }
}
</style>
