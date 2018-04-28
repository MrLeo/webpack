/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2018-03-23 13:40:12
 * @Last Modified by: Leo
 * @Last Modified time: 2018-04-16 09:10:08
 */
/*
 *                      _ooOoo_
 *                    o8888888o
 *                    88" . "88
 *                    (| -_- |)
 *                    O\  =  /O
 *                 ____/`---'\____
 *               .'  \\|     |//  `.
 *              /  \\|||  :  |||//  \
 *             /  _||||| -:- |||||-  \
 *             |   | \\\  -  /// |   |
 *             | \_|  ''\---/''  |   |
 *             \  .-\__  `-`  ___/-. /
 *           ___`. .'  /--.--\  `. . __
 *        ."" '<  `.___\_<|>_/___.'  >'"".
 *       | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *       \  \ `-.   \_ __\ /__ _/   .-` /  /
 *  ======`-.____`-.___\_____/___.-`____.-'======
 *                     `=---='
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *              佛祖保佑       永无BUG
 */
{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import Vue from 'vue'
import App from './App'
{{#router}}
import router from './router'
{{/router}}
{{#vuex}}
import store from './store'
// import base from './store/modules/base'
// store.registerModule('base', base) // 动态注册模块
{{/vuex}}

Vue.config.productionTip = false

Vue.nextTick(() => {
  if (window.addEventListener) {
    const html = document.documentElement
    let setFont = () => {
      const k = 750
      html.style.fontSize = html.clientWidth / k * 32 + 'px'
    }
    setFont()
    setTimeout(function () {
      setFont()
    }, 300)
    document.addEventListener('DOMContentLoaded', setFont, false)
    window.addEventListener('resize', setFont, false)
    window.addEventListener('load', setFont, false)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#vuex}}
  store,
  {{/vuex}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
