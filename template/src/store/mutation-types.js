/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2017-12-29 13:59:41
 * @Last Modified by: Leo
 * @Last Modified time: 2018-04-16 09:58:18
 */

export default {
  sys: {
    mutations: {
      SET_VERSION: '设置版本号'
    },
    actions: {}
  },
  ...(r => {
    // 去中心化
    let sourceMap = {}
    // eslint-disable-next-line
    let res = r.keys().map(key => {
      let rKey = r(key)
      let newKey = key.replace(/^\.\/modules\/(.*)\.js$/g, '$1')
      let namespaced = rKey.default.namespaced ? `${newKey}/` : ''
      sourceMap[newKey] = {}
      for (let key in rKey.default.mutations) {
        sourceMap[newKey]['mutations'] = `${namespaced}${key}`
      }
      for (let key in rKey.default.actions) {
        sourceMap[newKey]['actions'] = `${namespaced}${key}`
      }
      return rKey.default
    })
    return sourceMap
  })(require.context('./', true, /^\.\/modules\/\w+\.js$/))
}
