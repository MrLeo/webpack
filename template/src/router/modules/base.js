/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2017-12-29 14:00:30
 * @Last Modified by: Leo
 * @Last Modified time: 2018-03-23 13:27:54
 */
export default [
  {
    path: '/',
    name: 'HelloWorld',
    component: resolve => require(['@/components/HelloWorld'], resolve),
    meta: {
      title: 'HelloWorld'
    }
  }
]
