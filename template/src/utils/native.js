/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2017-11-14 22:42:27
 * @Last Modified by: Leo
 * @Last Modified time: 2018-03-23 15:01:32
 */

// #region 设备类型
/**
 * 设备类型
 * @type {{versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weixin, qq}, language: string}}
 */
export const browser = {
  versions: (function() {
    let u = navigator.userAgent;
    // let app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) === ' qq' // 是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
// #endregion

// #region 原生交互方法
export const native = {
  /**
   * - fn：native 交互通用方法
   * @param {any} {
   *  “name” = '', {String} native接口名
   *  “params” = {}, {Object} 向native接口传递的参数对象
   *  “callback” = ‘’ {String} H5接收回调的方法名
   * }
   * @returns
   */
  fn({ name = '', params = {}, callback = '' }) {
    return new Promise((resolve, reject) => {
      try {
        if (callback) {
          let doCallback = false;
          window[callback] = data => {
            doCallback = true;
            resolve(data);
          };
          setTimeout(() => {
            if (!doCallback) {
              window[callback] = null;
              reject(new Error(`[error] ${name} => ${callback} 回调失败`));
            }
          }, 5000);
        }
        window['bridge'] && window.bridge['fn'] && window.bridge.fn(name, JSON.stringify(params), callback);
      } catch (e) {
        reject(e);
      }
    });
  }
};
// #endregion
