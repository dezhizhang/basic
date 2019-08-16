import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin } from 'services/api';
import { setAuthority } from 'utils/authority';
import { reloadAuthorized } from 'utils/Authorized';
import { getPageQuery } from 'utils/utils';
export default {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload, callback }, { call, put }) {
      let response = yield call(fakeAccountLogin, payload);
      if (response.code === 200) {
        callback(response.msg)
        yield put({ type: 'changeLoginStatus',payload: {currentAuthority: 'admin'}});
        if(response.data.token) {
          reloadAuthorized();
          yield put(routerRedux.push({ pathname: '/index' }));
        }
      } else {
        callback(response.msg)
        yield put({type: 'changeLoginStatus',payload: { currentAuthority: 'guest'}});
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      window.localStorage.clear();
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status};
    },
  },
};
