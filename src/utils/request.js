import fetch from 'dva/fetch';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { baseUrl } from './utils'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '参数错误',
  401: '登陆失效需要重新登录',
  403: '没权限',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  message.error(errortext);
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export default function request(url, options) {
  let defaultOptions = {
    // credentials: 'include',
    // withCredentials: true,
    // mode: "no-cors",
    headers: {
      token: window.localStorage.getItem('token2') || ''
    }
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  return fetch(baseUrl + url, newOptions)
  
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      } else if (newOptions.type === 'download') {
        return response;
      }
      return response.json();
    }).then(res => {
      if (newOptions.type === 'download') {
        return res;
      }
      const { dispatch } = store;
      if (res.code !== 200) {
        message.error(res.msg || '请求错误');
        if (res.code === 401) {
          dispatch({
            type: 'login/logout',
          });
        }
      } else {
        res.data && res.data.token && window.localStorage.setItem('token', res.data.token)
      }
      return res;
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      const data = {
        code: 0,
        msg: '请求发生错误',
        data: ''
      }
      if (status === 401) {
        return data;
      }
      if (status === 401) {
        dispatch(routerRedux.push('/user/login'));
        return data;
      }
      if (status !== 200) {
        return data;
      }
    });
}
