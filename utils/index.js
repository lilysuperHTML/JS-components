const eachObj = (o, iterator) => Object.keys(o).forEach(v => iterator(v, o[v]));

/**
 * 小程序无法在{{}}中使用函数表达式 这里做一个转换
 * @param {Object} s 大数据对象
 * @param {Object} o 一个对象 键为后台返回key 值为对应enum中的key
 * @param {String} prefix 新键前缀 false代表覆盖原有key
 * @example
 *  multiEnumTransform(data, { productType: 'productTypes' })
 *  后台返回的产品类型key为productType 枚举对象的key为productTypes
 */
export const multiEnumTransform = (s, o, prefix = 'ref_') => {
  eachObj(o, (k, v) => {
    let key = prefix ? `${prefix}${k}` : k;
    let value = enumList[v] ? enumList[v][s[k]] : '';
    s[key] = value;
  });
};

/**
 * 清空表单缓存数据
 * @param {Object} o 一般为表单对象
 * @type {Object} 对象类型直接清空
 * @type {Boolean|Null} 这个类型不做处理
 * @type {Other} 其余类型置null
 */
export const resetData = (o) => {
  const type = (tar) => Object.prototype.toString.call(tar).slice(8, -1);
  eachObj(o, (k, v) => {
    switch (type(v)) {
      case 'Object':
        o[k] = {};
        break;
      case 'Array':
        o[k] = [];
        break;
      case 'String':
        o[k] = '';
        break;
      case 'Null':
      case 'Boolean':
        break;
      default:
        o[k] = null;
        break;
    }
  });
};

/**
 * 逗号切割长数字 等同于toLocalString 当初傻逼了
 * @param {Number} num 待切割数字
 * @param {String} delimiter 切割符
 */
export const formatDottedNumber = (num, delimiter = ',') => {
  const pftf2 = n => parseFloat(n).toFixed(2);
  if (isNaN(num) || +num === 0) return '0.00';
  let numArray = num.toString().split('.');
  let Dot = '0.00';
  if (numArray[1]) Dot = pftf2(`0.${numArray[1]}`.toString());
  Dot = Dot.slice(1);
  // eslint-disable-next-line
  let IntArray = (num | 0).toString().split('');
  let l = IntArray.length;
  let iter = 0;
  while (l--) {
    iter++;
    if (iter % 3 === 0) IntArray.splice(l, 0, delimiter);
  }
  if (IntArray[0] === ',') IntArray = IntArray.slice(1);
  return `${IntArray.join('')}${Dot}`;
};

// 验证延迟时间
const delay = 100;
export const validate = (formData, type, ignore) => {
  let rules = validateRules[type];
  let error = null;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      eachObj(formData, (k, v) => {
        if ((ignore && ignore.includes(k)) || !rules[k]) return;
        let required = rules[k].required;
        if (Array.isArray(v) && v.length === 0) {
          !error && (error = (typeof required === 'boolean') ? `请输入${rules[k].alias}` : required);
          return;
        }
        // 去掉字符串前后空格
        let stringValue = typeof v === 'string' ? v.trim() : v;
        if (required && !stringValue) { // 必填判断
          !error && (error = (typeof required === 'boolean') ? `请输入${rules[k].alias}` : required);
          return;
        }
        if (rules[k].type === 'number' && isNaN(Number(v))) {
          !error && (error = `${rules[k].alias}格式不正确`);
          return;
        }
        let exp = rules[k].pattern;
        if (exp && !exp.test(v)) { // 正则校验
          !error && (error = `${rules[k].alias}格式不正确`);
        }
        const validator = rules[k].validator;
        if (validator && typeof validator === 'function') { // 自定义校验
          const res = validator(v);
          if (typeof res === 'string') {
            error = res;
          }
        }
      });
      if (error) {
        Vue.$toast(error);
        reject(error);
      } else {
        resolve();
      }
    }, delay);
  });
};