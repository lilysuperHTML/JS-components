const deepClone = (() => {
  let path = new WeakMap();
  let path_ar = ['this'];
  let init = false;
  return function(o) {
    if (!init) {
      path.set(o, 'this');
      init = true;
    }
    let result = {};
    Object.keys(o).forEach(v => {
      let value = o[v];
      path_ar.push(v);
      if(value && typeof value === 'object') {
        if (path.has(value)) {
          result[v] = path.get(value);
        } else {
          path.set(value, path_ar.join('.'));
          result[v] = deepClone(value);
        }
      } else {
        result[v] = value;
      }
      path_ar.pop();
    });
    return result;
  }
})();
