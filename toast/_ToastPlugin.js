import toastComponent from './_toast.vue';

let el;

const ToastPlugin = {
  install(vue) {
    const ElComp = vue.extend(toastComponent);
    if (!el) {
      el = new ElComp({
        el: document.createElement('div'),
      });
      document.body.appendChild(el.$el);
    }

    const show = (str, cb) => {
      el.text = str;
      el.cb = cb;
      el.isLoading = false;
      el.show = true;
    };

    const loading = (str) => {
      if (!str) str = '加载中';
      el.text = str;
      el.isLoading = true;
      el.isShow = true;
    };

    const hide = () => {
      el.isLoading = false;
      el.show = false;
    };

    vue.Toast = {
      show,
      loading,
      hide,
    };

    vue.mixin({
      created() {
        this.Toast = vue.Toast;
      },
    });
  },
};

export default ToastPlugin;
