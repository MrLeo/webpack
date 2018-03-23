/**
 * 获取网址参数
 *
 * @export getQueryString('id')
 * @param {any} name 参数名
 * @returns
 */
export function getQuery (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 获取全部url参数,并转换成json对象
 *
 * @export getAllQuery('www.baidu.com?id=1&title=测试')
 * @param {any} url URL地址
 * @returns
 */
export function getAllQuery (uri) {
  let url = uri || window.location.href
  let _pa = url.substring(url.indexOf('?') + 1)
  let _arrS = _pa.split('&')
  let _rs = {}
  for (let i = 0, _len = _arrS.length; i < _len; i++) {
    let pos = _arrS[i].indexOf('=')
    if (pos === -1) {
      continue
    }
    let name = _arrS[i].substring(0, pos)
    let value = window.decodeURIComponent(_arrS[i].substring(pos + 1))
    _rs[name] = value
  }
  return _rs
}

/**
 * 删除url指定参数，返回url
 *
 * @export delQuery('www.baidu.com?id=1&title=测试','title')
 * @param {any} url 原始URL
 * @param {any} name 要删除的参数名
 * @returns
 */
export function delQuery (url, name) {
  let baseUrl = url.split('?')[0] + '?'
  let query = url.split('?')[1]
  if (query.indexOf(name) > -1) {
    let obj = {}
    let arr = query.split('&')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[name]
    let url =
      baseUrl +
      JSON.stringify(obj)
        // eslint-disable-next-line
        .replace(/[\"\{\}]/g, '')
        // eslint-disable-next-line
        .replace(/\:/g, '=')
        // eslint-disable-next-line
        .replace(/\,/g, '&')
    return url
  } else {
    return url
  }
}
