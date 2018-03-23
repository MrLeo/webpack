/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2017-10-29 10:30:53
 * @Last Modified by: Leo
 * @Last Modified time: 2017-12-29 14:07:41
 */

/**
 * 单位
 * @param {*} value
 * @param {*} unit
 */
export function unit(value, unit) {
  if (!value && value !== 0) return '';
  if (value === '暂无') return value;
  return value + unit;
}
