(function(window) {
  /**
   * 配置部分
   */
  // picker高度
  const height = 150;
  // 每一项的高度 修改的同时css也要改
  const item_height = 32;

  /**
   * 生成年月日的数组
   */
  const MIN_YEAR = 2000;
  const MAX_YEAR = new Date().getFullYear() + 15;

  const isLeapYear = (year) => (year % 100 !== 0 && year % 4 === 0 || year % 400 === 0);
  
  const generateArray = (m, n, prefix) => {
    let result = [];
    for (let i = m; i <= n; i++) {
      let tmp = i;
      if(prefix) tmp = i < 10 ? `0${i}` : String(i);
      result.push(tmp);
    }
    return result;
  };

  const getYears = (min = MIN_YEAR, max = MAX_YEAR) => generateArray(min, max);

  const getMonths = () => generateArray(1, 12);

  const getDays = (year, month) => {
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return generateArray(1, 31);
      case 4:
      case 6:
      case 9:
      case 11:
        return generateArray(1, 30);
      case 2:
        return generateArray(1, isLeapYear(year) ? 29 : 28);
      default:
        return [];
    }
  };

  /**
   * 事件触发器原型 类似于DOM的addEventListener
   */
  class EventEmitter{
    constructor() {
      if(this._events === undefined) {
        this._events = Object.create(null);
      }
    };
    on(type, callback) {
      if (!this._events) {
        this._events = Object.create(null);
      }
      let existing = this._events[type];
      if (!existing) this._events[type] = callback;
      else {
        if (typeof existing === 'function') {
          this._events[type] = [existing, callback];
        } else{
          this._events[type].push(callback);
        }
      }
    };
    emit(type, ...args) {
      const handles = this._events[type];
      if (!handles) return;
      if (typeof handles === 'function') {
        Reflect.apply(handles, this, args);
      } else {
        handles.forEach(v => {
          Reflect.apply(v, this, args);
        });
      }
    };
  };

  class _list extends EventEmitter{
    /**
     * picker原型
     * @param {Array} ar picker列表的数组 值会作为内容显示在列表中
     * @param {Any} initData 初始值 不传默认为第一项
     */
    constructor(ar, initData) {
      super();
      // 记录开始与结束的坐标
      this.start = 0;
      this.end = 0;
      // 动画效果控制
      this.sec = 0;
      // 标记目前选中第几项
      this.curIndex = initData ? ar.findIndex(v => v === initData) : 0;
      
      this.init(ar, initData, true);
      this.domInit(ar);
    };
    init(ar) {
      // picker数据的数组
      this.ar = ar;
      this.l = ar.length;
      // 选中的值
      this.value = ar[this.curIndex];
      // 计算选项在正中央的距离
      this.defaultTranslate = height / 2 - item_height / 2;
      // 初始化选中两条黑线的偏移与list列表的偏移
      this.diff = this.translateY = this.defaultTranslate - (this.curIndex * item_height);
      // 最大偏移距离
      this.maxTranslateY = this.defaultTranslate - (this.l - 1) * item_height;
    };
    // 生成一系列的DOM
    domInit(ar) {
      this.node = document.createElement('div');
      this.node.className = 'picker-wrapper';
      this.node.style.height = `${height}px`;
      let indicator = document.createElement('div');
      indicator.className = 'indicator';
      indicator.style = `top: ${this.defaultTranslate}px`;
      this.box = document.createElement('div');
      this.box.className = 'content';
      this.node.append(indicator, this.box);
      this.animate();
      this.itemInit(ar);
      this.listEventListener();
    };
    // list列表的鼠标事件监听
    listEventListener() {
      // 鼠标按下触发 只获取坐标
      this.node.addEventListener('touchstart', (e) => {
        this.sec = 0;
        this.start = e.changedTouches[0].pageY;
      }, {passive: true});
      // 鼠标滑动
      this.node.addEventListener('touchmove', (e) => {
        this.end = e.changedTouches[0].pageY;
        // 计算滑动的偏移距离
        let n = this.translateY + this.end - this.start;
        // 边界处理 不能滑出去
        this.diff = this.checkDiff(n);
        this.animate();
      }, {passive: true});
      // 鼠标停下
      this.node.addEventListener('touchend', () => {
        // 这里需要动画
        this.sec = 0.3;
        // 误差处理
        this.fixedDiff(this.diff);
        this.animate();
      }, {passive: true});
    };
    // 列表手动触发偏移
    animate() {
      this.box.style = `transition: all ${this.sec}s;transform: translateY(${this.diff}px)`;
    };
    // 根据传入的数组初始化一系列的item插入容器中
    itemInit(ar) {
      let ar_dom = [];
      ar.forEach(v => {
        let p = document.createElement('p');
        p.className = 'item';
        p.textContent = v;
        ar_dom.push(p);
      });
      this.box.append(...ar_dom);
    };
    // 当向上或向下滑动过边界强制设置偏移距离
    checkDiff(n) {
      if (n > this.defaultTranslate + item_height / 2) return this.defaultTranslate + item_height / 2;
      if (n < this.maxTranslateY - item_height / 2) return this.maxTranslateY - item_height / 2;
      return n;
    };
    // 根据滑动的距离计算当前偏移距离哪一项比较接近 然后修正距离并滑动
    fixedDiff(n) {
      if (n > this.defaultTranslate) {
        this.curIndex = 0;
        this.diff = this.translateY = this.defaultTranslate;
      }
      else if (n < this.maxTranslateY) {
        this.curIndex = this.l - 1;
        this.diff = this.translateY = this.maxTranslateY;
      }
      else {
        this.curIndex = Math.round(-(n - this.defaultTranslate) / item_height);
        this.diff = this.translateY = this.defaultTranslate - (this.curIndex * item_height);
      }
      // 这里设置当前选中值并触发事件通知外面
      this.value = this.ar[this.curIndex];
      this.emit('select', this.value);
    };
  };
  
  class DatePicker extends EventEmitter{
    constructor() {
      super();
      this.dateInit();
      this.domInit();
    };
    // 初始化年月日
    dateInit() {
      let date = new Date();
      let defaultYear = date.getFullYear();
      let defaultMonth = date.getMonth() + 1;
      let defaultDay = date.getDate();
      this.value = [defaultYear, defaultMonth, defaultDay];
      this.year = new _list(getYears(), defaultYear);
      this.month = new _list(getMonths(), defaultMonth);
      this.day = new _list(getDays(defaultYear, defaultMonth), defaultDay);
      this.eventInit();
    };
    // 生成DOM 插入年月日的选择器
    domInit() {
      this.node = document.createElement('div');
      this.node.className = 'picker-container';
      this.node.append(this.year.node, this.month.node, this.day.node);
    };
    // 年月日的选择都会触发事件并对外广播数据 选择年月的时候需要判断新的月份天数
    eventInit() {
      this.year.on('select', (val) => {
        this.value[0] = val;
        let ar = getDays(this.value[0], this.value[1]);
        if (this.checkDayItem(ar, this.day)) return;
        this.emit('select', this.value);
      });
      this.month.on('select', (val) => {
        this.value[1] = val;
        let ar = getDays(this.value[0], this.value[1]);
        if (this.checkDayItem(ar, this.day)) return;
        this.emit('select', this.value);
      });
      this.day.on('select', (val) => {
        this.value[2] = val;
        this.emit('select', this.value);
      });
    };
    // 不同年月的天数不一致 需要做判断然后重置对应的picker
    checkDayItem(ar, day) {
      // 老的天数列表DOM
      let day_dom = this.node.lastChild.children[1];
      // 新的天数数组
      let l = ar.length;
      // 转换成数组并获取长度
      let current_list = Array.from(day_dom.children);
      let _l = current_list.length;
      // 相等就不用处理了
      if (_l === l) return;
      // 当新月份天数大于老月份 比如：2月 => 3月
      if (l > _l) {
        // 往后面加DOM
        for(let i = _l; i < l; i++) {
          let p = document.createElement('p');
          p.className = 'item';
          p.textContent = i + 1;
          day_dom.appendChild(p);
        }
        // 重新初始化数据
        day.init(ar);
      }
      // 当新月份天数小于老月份 比如：1月 => 2月
      if (l < _l) {
        // 计算差几天 从后面移除DOM
        let n = _l - l;
        while(n--) day_dom.removeChild(day_dom.lastChild);
        // 如果选择的日期不存在 需要重置为新月份最后一天
        if (day.curIndex >= l) {
          // 回退到最后一天
          day.curIndex = day.curIndex - (_l - l);
          day.init(ar);
          // 往回退时间不需要动画 并且返回标记 不然会emit两次
          day.sec = 0;
          day.emit('select', day.value);
          day.animate();
          return true;
        };
        // 正常情况
        day.init(ar);
      }
    };
  };

  class TimerPicker extends EventEmitter{
    constructor() {
      super();
      this.dataInit();
      this.domInit();
    };
    dataInit() {
      this.l1 = new _list(['上午', '下午']);
      this.l2 = new _list(generateArray(0, 11, true));
      this.l3 = new _list(generateArray(0, 59, true));
      this.value = ['上午', '00', '00'];
    };
    domInit() {
      this.node = document.createElement('div');
      this.node.className = 'picker-container';
      this.node.append(this.l1.node, this.l2.node, this.l3.node);
      this.eventInit();
    };
    eventInit() {
      this.value = ['上午', '00', '01'];
      this.l1.on('select', (val) => {
        this.value[0] = val;
        this.emit('select', this.value);
      });
      this.l2.on('select', (val) => {
        this.value[1] = val;
        this.emit('select', this.value);
      });
      this.l3.on('select', (val) => {
        this.value[2] = val;
        this.emit('select', this.value);
      });
    };
  };

  /**
   * 暴露给外部的API
   */
  window.setPicker = (dom, type) => {
    // 日期选择
    if (type === 'datePicker') {
      let r = new DatePicker();
      dom.append(r.node);
      return r;
    }

    // 时间选择
    if (type === 'timePicker') {
      let r = new TimerPicker();
      dom.append(r.node);
      return r;
    }
  };
})(window);