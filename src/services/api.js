import request from 'utils/request';
//登录
export async function fakeAccountLogin(params) {
  return request('/login', {
    method: 'POST',
    body:params,
  });
}




















