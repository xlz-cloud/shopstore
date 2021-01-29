import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import ZkTable from 'vue-table-with-tree-grid'

import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/global.css';
import 'assets/css/normalize.css'
import 'assets/fonts/iconfont.css'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)


Vue.component(ZkTable.name, ZkTable)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
