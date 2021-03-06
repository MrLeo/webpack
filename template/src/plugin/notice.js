/**
 * @Date: 2017/5/19  10:29
 * @Author: leo
 * http://xuebin.me/
 * Created with JetBrains WebStorm.
 */

const miniToastr = (function() {
  // fix for server-side rendering
  if (typeof window === 'undefined') {
    return {
      init: () => {}
    };
  }

  function fadeOut(element, cb) {
    if (element.style.opacity && element.style.opacity > 0.05) {
      element.style.opacity = element.style.opacity - 0.05;
    } else if (element.style.opacity && element.style.opacity <= 0.1) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        if (cb) cb();
      }
    } else {
      element.style.opacity = 0.9;
    }
    setTimeout(() => fadeOut.apply(this, [element, cb]), 1000 / 30);
  }

  const TYPES = {
    error: 'error',
    warn: 'warn',
    success: 'success',
    info: 'info'
  };

  const CLASSES = {
    container: 'mini-toastr',
    notification: 'mini-toastr__notification',
    title: 'mini-toastr-notification__title',
    icon: 'mini-toastr-notification__icon',
    message: 'mini-toastr-notification__message',
    error: `-${TYPES.error}`,
    warn: `-${TYPES.warn}`,
    success: `-${TYPES.success}`,
    info: `-${TYPES.info}`
  };

  function flatten(obj, into, prefix) {
    into = into || {};
    prefix = prefix || '';

    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        const prop = obj[k];
        if (prop && typeof prop === 'object' && !(prop instanceof Date || prop instanceof RegExp)) {
          flatten(prop, into, prefix + k + ' ');
        } else {
          if (into[prefix] && typeof into[prefix] === 'object') {
            into[prefix][k] = prop;
          } else {
            into[prefix] = {};
            into[prefix][k] = prop;
          }
        }
      }
    }

    return into;
  }

  function makeCss(obj) {
    const flat = flatten(obj);
    let str = JSON.stringify(flat, null, 2);
    str = str
      // eslint-disable-next-line
      .replace(/"([^"]*)": \{/g, '$1 {')
      // eslint-disable-next-line
      .replace(/"([^"]*)"/g, '$1')
      // eslint-disable-next-line
      .replace(/(\w*-?\w*): ([\w\d .#%\(\)-]*),?/g, '$1: $2;')
      // eslint-disable-next-line
      .replace(/},/g, '}\n')
      // eslint-disable-next-line
      .replace(/ &([.:])/g, '$1');

    str = str.substr(1, str.lastIndexOf('}') - 1);

    return str;
  }

  function appendStyles(css) {
    let head = document.head || document.getElementsByTagName('head')[0];
    let styleElem = makeNode('style');
    styleElem.id = 'mini-toastr-styles';
    styleElem.type = 'text/css';

    if (styleElem.styleSheet) {
      styleElem.styleSheet.cssText = css;
    } else {
      styleElem.appendChild(document.createTextNode(css));
    }

    head.appendChild(styleElem);
  }

  const config = {
    types: TYPES,
    animation: fadeOut,
    timeout: 3000,
    icons: {},
    appendTarget: document.body,
    node: makeNode(),
    style: {
      [`.${CLASSES.container}`]: {
        position: 'absolute',
        'z-index': 99999,
        // top: '2.2rem',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)'
      },
      [`.${CLASSES.notification}`]: {
        cursor: 'pointer',
        padding: '12px 18px',
        margin: '0 0 6px 0',
        'background-color': '#000',
        opacity: 0.8,
        color: '#fff',
        'border-radius': '3px',
        'box-shadow': '#3c3b3b 0 0 12px',
        width: '300px',
        [`&.${CLASSES.error}`]: {
          'background-color': '#D5122B'
        },
        [`&.${CLASSES.warn}`]: {
          'background-color': '#F5AA1E'
        },
        [`&.${CLASSES.success}`]: {
          'background-color': '#7AC13E'
        },
        [`&.${CLASSES.info}`]: {
          'background-color': 'rgba(0,0,0,.8)'
        },
        '&:hover': {
          opacity: 1,
          'box-shadow': '#000 0 0 12px'
        }
      },
      [`.${CLASSES.title}`]: {
        'font-weight': '500'
      },
      [`.${CLASSES.message}`]: {
        display: 'inline-block',
        'vertical-align': 'middle',
        width: '240px',
        padding: '0 12px'
      }
    }
  };

  function makeNode(type = 'div') {
    return document.createElement(type);
  }

  function createIcon(node, type, config) {
    const iconNode = makeNode(config.icons[type].nodeType);
    const attrs = config.icons[type].attrs;

    for (const k in attrs) {
      if (attrs.hasOwnProperty(k)) {
        iconNode.setAttribute(k, attrs[k]);
      }
    }

    node.appendChild(iconNode);
  }

  function addElem(node, text, className) {
    const elem = makeNode();
    elem.className = className;
    elem.appendChild(document.createTextNode(text));
    node.appendChild(elem);
  }

  const exports = {
    config,
    CLASSES,
    showMessage(message, title, type, timeout, cb, overrideConf) {
      const config = {};
      Object.assign(config, this.config);
      Object.assign(config, overrideConf);

      const notificationElem = makeNode();
      notificationElem.className = `${CLASSES.notification} ${CLASSES[type]}`;

      notificationElem.onclick = function() {
        config.animation(notificationElem, null);
      };

      if (title) addElem(notificationElem, title, CLASSES.title);
      if (config.icons[type]) createIcon(notificationElem, type, config);
      if (message) addElem(notificationElem, message, CLASSES.message);

      config.node.insertBefore(notificationElem, config.node.firstChild);
      setTimeout(() => config.animation(notificationElem, cb), timeout || config.timeout);

      if (cb) cb();
      return this;
    },
    init(aConfig) {
      const newConfig = {};
      Object.assign(newConfig, config);
      Object.assign(newConfig, aConfig);
      this.config = newConfig;

      const cssStr = makeCss(newConfig.style);
      appendStyles(cssStr);

      newConfig.node.id = `${CLASSES.container}`;
      newConfig.node.className = `${CLASSES.container}`;
      newConfig.appendTarget.appendChild(newConfig.node);

      Object.keys(newConfig.types).forEach(v => {
        exports[newConfig.types[v]] = function(message, title, timeout, cb, config) {
          this.showMessage(message, title, newConfig.types[v], timeout, cb, config);
          return this;
        }.bind(this);
      });

      return this;
    },
    setIcon(type, nodeType = 'i', attrs = []) {
      attrs.class = attrs.class ? attrs.class + ' ' + CLASSES.icon : CLASSES.icon;

      this.config.icons[type] = {
        nodeType,
        attrs
      };
    }
  };

  return exports;
})();

miniToastr.init();

let Toastr = {};

Toastr.install = function(Vue, options) {
  Vue.prototype.$toastr = function(options) {
    let config = {
      type: options.type || 'info',
      message: options.message || '',
      title: options.title || '',
      timeout: options.timeout || 3000
    };

    miniToastr[config.type](config.message, config.title, config.timeout);
  };
};

export default Toastr;
