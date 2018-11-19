const deepClone = (o) => {
  let path = new WeakMap();
  path.set(o, 'this');
  let path_ar = ['this'];
  return (function inner(o) {
    let result = {};
    Object.keys(o).forEach(v => {
      let value = o[v];
      path_ar.push(v);
      if(value && typeof value === 'object') {
        if (path.has(value)) {
          let dupi_path = path.get(value).split('.').slice(1);
          let origin = result;
          dupi_path.forEach(v => {
            origin = origin[v];
          });
          result[v] = origin;
        } else {
          path.set(value, path_ar.join('.'));
          result[v] = inner(value);
        }
      } else {
        result[v] = value;
      }
      path_ar.pop();
    });
    return result;
  })(o);
};
