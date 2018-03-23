/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2017-12-05 00:33:23
 * @Last Modified by: Leo
 * @Last Modified time: 2018-03-21 20:43:53
 */
// import Vue from 'vue'
// import router from '../router'
import axios from 'axios'
import qs from 'qs' // 参数工具：https://github.com/ljharb/qs
import Toast from '../components/toast'

// #region config
// 每页条数
export const ROW = 10
// 加载最小时间
export const MINI_TIME = 300
// 超时时间（超时时间）
export const TIME_OUT_MAX = 8000
// 环境value
export const _env = process.env.NODE_ENV
// 请求组（判断当前请求数）
export const _requests = []
// #endregion

// #region 实例化axios
const _instance = axios.create({
  timeout: TIME_OUT_MAX
})
// #endregion

// region request统一处理操作
_instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8' // 'application/x-www-form-urlencoded;charset=UTF-8'
// POST传参序列化
_instance.interceptors.request.use(
  config => {
    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    return config
  },
  error => {
    Toast('错误的传参')
    return Promise.reject(error)
  }
)
// endregion

// region response统一处理操作
_instance.interceptors.response.use(
  res => {
    let _message = null
    if (res.status !== 200) {
      // console.error(res)
      switch (res.status) {
        case 404:
          _message = '404,错误请求'
          break
        case 401:
          // router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } });
          localStorage.removeItem('user')
          _message = '未授权'
          break
        case 403:
          _message = '禁止访问'
          break
        case 408:
          _message = '请求超时'
          break
        case 500:
          _message = '服务器内部错误'
          break
        case 501:
          _message = '功能未实现'
          break
        case 503:
          _message = '服务不可用'
          break
        case 504:
          _message = '网关错误'
          break
        default:
          _message = '未知错误'
      }
      // Toast(_message)
      // return Promise.reject(_message)
      throw new Error(_message)
    } else {
      return res.data
    }
  },
  error => {
    console.error(error)
    Toast(error || '服务器繁忙，请稍后重试')
    return Promise.reject(error || '服务器繁忙，请稍后重试')
  }
)
// endregion

// #region send get/post
let toast = null

/**
 * 发送GET请求
 * @param api 接口api
 * @param params 请求参数
 * @returns {Promise.<T>}
 */
async function get (api, params) {
  try {
    toast = Toast({ time: -1, message: '加载中', icon: 'loading' })
    let data = await _instance.get(api, { params })
    toast.close()
    return data
  } catch (e) {
    toast.close()
    Toast({ message: '网络异常', position: 'bottom' })
    throw e
  }
}

/**
 * 发送POST请求
 * @param api 接口api
 * @param params 请求参数
 * @returns {Promise.<T>}
 */
async function post (api, params, isJSON = true) {
  try {
    toast = Toast({ time: -1, message: '加载中', icon: 'loading' })
    let data = await _instance.post(api, isJSON ? params : qs.stringify(params))
    toast.close()
    return data
  } catch (e) {
    toast.close()
    Toast({ message: '网络异常', position: 'bottom' })
    throw e
  }
}
// #endregion

export default {
  _instance,
  get,
  post
}
