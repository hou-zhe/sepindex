import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import diretivesObj from './utils/directives.js'

import Costompagination from './components/Costompagination/index.vue'
import x2js from 'x2js'
import {message} from './utils/message.js';
import '@/icons' // icon
import '@/permission' // permission control
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(diretivesObj)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }



Vue.prototype.$x2js = new x2js()
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.component('Costompagination', Costompagination);
Vue.config.productionTip = false

Vue.prototype.$message = message;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
