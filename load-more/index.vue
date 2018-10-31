<template>
  <div class="ins-load-more">
    <slot></slot>
    <div class="load-more" v-if="loadingValue || noMore" :style="{ height }">
      <slot name="no-more" v-if="noMore">
        <div class="no-more-container">
          <div class="line"></div>
          <p class="ins-divider">{{ noMoreText }}</p>
          <div class="line"></div>
        </div>
      </slot>
      <slot name="load-more" v-else>
        <i class="weui-loading"></i>
        <span class="load-more__text">{{ loadMoreText }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
/**
 * 上拉加载组件
 * events：
 *      none
 * slots：
 *      no-more： 没有更多的样式及文本内容；
 *      load-more： 加载中的样式及文本内容；
 * Usage：
 *      <ins-load-more
 *        :loading="loading"
 *        :no-more="noMore"
 *        to-bottom="40"
 *        @load-more="fetchData"
 *      >
 *      </ins-load-more>
*/

import throttle from 'lodash/throttle';

export default {
  name: 'ins-load-more',
  props: {
    loading: {
      type: Boolean,
      default: undefined,
    },  // 是否显示加载时转圈圈的图标
    noMore: Boolean,      // 是否显示没有更多
    noMoreText: {
      type: String,
      default: '没有更多了',
    },      // 没有更多文本
    loadMoreText: {
      type: String,
      default: '加载中...',
    },    // 加载中文本
    height: [String, Number], // 加载更多及没有更多的高度
    toBottom: {
      type: [String, Number],
      default: 44,
    },        // 距离底部多远时触发父组件的load-more
    container: {
      type: [Node, Window],
      default() {
        return window;
      },
    },
  },
  data() {
    return {
      last: null,
      loadingValue: false,
    };
  },
  watch: {
    loading(val) {
      this.loadingValue = !!val;
    },    // 监听loading的变化
  },
  methods: {
    onScroll() {
      const bottom = this.$el.getBoundingClientRect().bottom;
      if (bottom < this.last) {
        const winHeight = window.innerHeight;
        if (!this.loadingValue && !this.noMore && bottom < winHeight + parseInt(this.toBottom, 10)) {
          console.log('load more');
          if (this.loading === undefined) {
            this.loadingValue = true;
            this.$emit('load-more', this.down);
          } else {
            this.$emit('load-more');
          }
        }
      }
      this.last = bottom;
    },
    down(val = false) {
      this.loadingValue = !!val;
    },
  },
  created() {
    this.scroll = throttle(this.onScroll, 200);
    this.container.addEventListener('scroll', this.scroll);    // 监听容器的滚动，200毫秒触发一次
  },
  destroyed() {
    this.container.removeEventListener('scroll', this.scroll);
  },
};
</script>

<style lang="less" scoped>
@import '~vux/src/styles/weui/widget/weui-loading/weui-loading.less';

@font-color: @placeholder-color;
@font-size: @font-small;
@text-bg-color: @app-bg-color;

.no-more-container{
  display: flex;
  align-items: center;
  .line{
    background-color: #d7d7d7;
    height: 1px;
    width: 130px;
    flex: 1;
  }
}

.load-more {
  height: 64px;
  color: @font-color;
  font-size: @font-size;

  display: flex;
  justify-content: center;
  align-items: center;

  &__text {
    margin-left: 8px;
  }
}
.ins-divider {
  margin: 0 17px;
}
</style>
