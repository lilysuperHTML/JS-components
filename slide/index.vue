<template>
  <div class="slide">
    <div class="mask"
     v-show="showIter"
     @click='showIter = !showIter'></div>
    <div
    class="flex-box"
    v-for="(list, index) in slideList"
    :key='list.default.label'>
      <div
      class="slide-title"
      @click='showList(index)'>
        <span :class='{red:index === slideIndex && showIter}'>{{list.default.label || '请选择'}}</span>
        <i class="icon icon-arrow-slide"></i>
      </div>
      <ul
      :class="{show:index === slideIndex && showIter}"
      class='slide-list'
      :style="{transform:offset}">
        <li
        class="slide-item"
        v-for="(item,index2) in list.array"
        :class="{red:list.selectIndex === index2}"
        @click="selectItem(index2,index)"
        :key="index2">
          <p>{{item.label}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    slideList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      showIter: false,
      slideIndex: 0,
      timeId: null,
    };
  },
  methods: {
    selectItem(i, i2) {
      this.slideList[i2].selectIndex = i;
      let sl = this.slideList[this.slideIndex];
      sl.default = sl.array[i];
      this.$emit('select', i2, sl.default.value);
      this.showIter = false;
    },
    showList(i) {
      if (i === this.slideIndex || !this.showIter) {
        this.showIter = !this.showIter;
        this.slideIndex = i;
      } else {
        this.showIter = false;
        this.timeId = setTimeout(() => {
          this.showIter = true;
          this.slideIndex = i;
        }, 200);
      }
    },
  },
  computed: {
    offset() {
      return this.showIter ? 'translateY(0)' : 'translateY(-100%)';
    },
  },
  onUnload() {
    this.showIter = false;
    if (this.timeId) {
      clearTimeout(this.timeId);
      this.timeId = null;
    }
  },
};
</script>
<style lang="less" scoped>
ul li{list-style: none;}
.slide{
  display: flex;
  position: sticky;
  width: 100%;
  left: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  box-shadow: 0 0 30px rgba(200, 38, 49, 0.08);
  .flex-box{
    width: 0;
    flex-grow: 1;
    position: relative;
  }
}
.slide-title{
  text-align: center;
  color: #000;
  font-size: 16px;
  position: relative;
  z-index: 1001;
  background-color: #fff;
  i{
    display: inline-block;
    vertical-align: middle;
  }
}

.slide-list{
  width: 130px;
  border-radius: 0 0 10px 10px;
  transition: transform .2s;
  z-index: -1;
  position: absolute;
  left: 20px;
  top: 44px;
  background-color: #fff;
  text-align: center;
  opacity: 0;
  &.show{
    opacity: 1;
    z-index: 1000;
  }
}
.slide-item{
  height: 44px;
  line-height: 44px;
  font-size: 16px;
}
.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,.3);
}
.red{
  color: #FF635B;
}
</style>
