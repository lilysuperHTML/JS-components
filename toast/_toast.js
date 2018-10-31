import ToastPlugin from './_ToastPlugin';

export default function (Vue) {
  Vue.use(ToastPlugin);
  Vue.$toast = Vue.prototype.$toast = Vue.Toast.show;
  Vue.$loading = Vue.prototype.$loading = Vue.Toast.loading;
  Vue.prototype.$toast.hide = Vue.prototype.$loading.hide = Vue.Toast.hide;
}
