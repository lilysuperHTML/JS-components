<template>
  <div class="picker-container" @click="togglePicker">
    <div class="flex-space-center" v-if="arrow && title">
      <p class="f1">{{title}}</p>
      <p>{{ text || '请选择' }}</p>
      <i class="iconfont icon-arrow-down select-icon"></i>
    </div>
    <div class="default-content" v-else-if="title">
      <p class="title">{{title}}</p>
      <p class="value" v-if="!datetime">{{text || placeholder || '请选择'}}</p>
      <p class="label" v-else>{{o_date || placeholder || '请选择'}}</p>
    </div>
    <div v-else>
      <slot></slot>
    </div>
    
    <ins-actionsheet
    picker
    v-model=showPopup>
      <!-- 公共按钮 -->
      <div class="select-btn">
        <p @click.stop="handleCancel">取消</p>
        <p @click.stop="handleSubmit" style="color: #ff9900">完成</p>
      </div>
      <!-- 普通选择 -->
      <div class="default-picker" v-if="!datetime">
        <popup
        :list="list"
        :alias="alias"
        v-model="inner_value"/>
      </div>
      <!-- 日期选择 -->
      <div class="date-picker" v-else>
        <div class="date-item">
          <popup
          :list="years"
          v-model="year"
          ></popup>
        </div>
        <div class="date-item">
          <popup
          v-model="month"
          :list="months"
          ></popup>
        </div>
        <div class="date-item">
          <popup
          v-model="day"
          :list="days"
          ></popup>
        </div>
      </div>
    </ins-actionsheet>
  </div>
</template>
<script>
import InsActionsheet from '@/components/actionSheet';
import { getYears, getMonths, getDays } from './makeDate';
import popup from './popup';

export default {
  props: {
    title: String,
    placeholder: String,
    list: {
      type: Array,
      default() {
        return [];
      },
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

    // 日期选择与普通列表选择
    datetime: Boolean,

    // 有两种默认样式 带下拉箭头和普通cell
    arrow: Boolean,
  },
  components: {
    InsActionsheet,
    popup,
  },
  computed: {
    days() {
      return getDays(this.year, this.month);
    },
  },
  data() {
    return {
      showPopup: false,

      years: [],
      months: [],

      year: 0,
      month: 0,
      day: 0,
      o_date: '',

      inner_value: '',

      text: '',
    };
  },
  watch: {
    // 时间选择状态下外部改变v-model时触发展示内容变更
    value(val) {
      if (this.datetime) this.o_date = val;
      this.inner_value = this.value;
    },
  },
  methods: {
    togglePicker() {
      this.showPopup = true;
    },
    handleSubmit() {
      this.showPopup = false;
      if (this.datetime) this.o_date = [this.year, this.month, this.day].join('-');
      else {
        let o = this.list.find(v => this.inner_value === v[this.alias.value]);
        this.text = o ? o[this.alias.label] : '';
      }
      this.$emit('input', this.inner_value || this.o_date);
      this.$emit('select', this.inner_value || this.o_date);
    },
    handleCancel() {
      this.showPopup = false;
    },
  },
  created() {
    if (this.list.length === 0) this.$emit('empty');
    // 日期初始化为当前时间
    if (this.datetime) {
      const fixedNumber = (s) => (String(s).length === 1 ? `0${s}` : String(s));
      this.years = getYears();
      this.months = getMonths();
      let date = new Date();
      this.year = fixedNumber(date.getFullYear());
      this.month = fixedNumber(date.getMonth() + 1);
      this.day = fixedNumber(date.getDate());
    }
  },
};
</script>
<style lang="less" scoped>
.picker-container{
  width: 100%;
  .default-content{
    display: flex;
    .title{
      width: 102px;
      margin-right: 14px;
    }
    .value{
      color: #ccc;
    }
  }
  .select-btn{
    background-color: #fbf9fe;
    border-bottom: #c7c7c7;
    font-size: 16px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
  }
}

.date-picker{
  display: flex;
  .date-item{flex: 1;}
}
</style>
