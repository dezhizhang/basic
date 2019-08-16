
export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  subscriptions: {
    
    setup ({ dispatch, history }) {
      
      history.listen((location) => {
        dispatch({
          type: 'query',
          payload: location.payload,
        })
      });
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        // payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
