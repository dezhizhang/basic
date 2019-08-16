
export default {
  namespace: 'baseInfo',
  state: {
    inviteCode:123,
    companyName:'test',
    username:'test',
    password:1234,
    password2:1234,
    mobile:15893001150,
    msgCode:2222,
    agreement:true,
  },

  effects: {
    *changeBaseInfo({ payload }, { call, put }) {
      yield put({
        type: 'saveBaseInfo',
        payload: payload,
      });
    },
  },

  reducers: {
    saveBaseInfo(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  },
};
