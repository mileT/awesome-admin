import { parse } from 'querystring';
import { notification } from 'antd';
import * as Cookies from 'js-cookie';
import Config from '@/config';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export function logout() {
  removeUserInfoCookie();
  window.location.href = logoutUrl();
}

export function logoutUrl() {
  return `${Config.logoutUrl}?redirect_url=${encodeURIComponent(Config.loginUrl)}`;
}

export function getTokenInfoFromCookie() {
  const tokenInfo = Cookies.get('token');
  return tokenInfo ? JSON.parse((Buffer.from(tokenInfo, 'base64').toString())) : null;
}

export function getUserInfoFromCookie() {
  const tokenInfo = getTokenInfoFromCookie();
  if (!tokenInfo || !tokenInfo.userInfo) {
    removeUserInfoCookie();
    window.location.href = logoutUrl();
  }
  return tokenInfo ? tokenInfo.userInfo : null;
}

export function getUserIdFromCookie() {
  const tokenInfo = getTokenInfoFromCookie();
  if (!tokenInfo || !tokenInfo.userInfo) {
    removeUserInfoCookie();
    window.location.href = logoutUrl();
  }
  return tokenInfo.userInfo ? tokenInfo.userInfo.userId : null;
}

export function removeUserInfoCookie() {
  Cookies.remove('token');
}

export function toThousands(num) {
  let val = (num || 0).toFixed(2);
  let result = val.slice(-3);
  val = val.slice(0, val.length - 3);
  while (val.length > 3) {
      result = `,${val.slice(-3)}${result}`;
      val = val.slice(0, val.length - 3);
  }
  if (val) { result = val + result; }
  return result;
}

export const response = (resp, action, successHandler, failedHandler) => {
  if (resp.info && resp.info.val === 2001) {
    notification.open({
      message: `${action}成功`,
      duration: 2,
    });
    if (successHandler) {
      successHandler();
    }
    return;
  }
  notification.open({
    message: `${action}失败`,
    description: resp.info && resp.info.msg ? resp.info.msg : null,
    duration: 4,
  });
  if (failedHandler) {
    failedHandler();
  }
}
