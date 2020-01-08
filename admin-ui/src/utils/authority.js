import { getTokenInfoFromCookie } from '@/utils/utils'
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const tokenInfo = getTokenInfoFromCookie();
  return tokenInfo ? tokenInfo.authorities : [];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
