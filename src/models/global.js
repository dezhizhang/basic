
import { getInitStep } from '../services/api'
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    step: 0,
    needSignCert:true
  },

  effects: {
    *changeStep({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeSteps',payload:payload });
    },
    *currentStep({payload},{call,put}) {
      const response = yield call(getInitStep, payload);
      if(response.code == 200) {
        yield put({ type: 'currentSteps',payload:response });
      }
    }
  },

  reducers: {
    //侧边栏显示隐藏
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeInitinfo(state, { payload }) {
      return {
        ...state,
        step: payload.step - 2,
        needSignCert:payload.needSignCert
      }
    },
    changeSteps(state,{payload}){
      return {
        ...state,
        ...payload
      }
    },
    currentSteps(state,action) {
      let step = action.payload.data;
      if(step == 2) {
        state.step = 0;
      }else if(step == 3) {
        state.step = 1;
      } else if(step == 4) {
        state.step = 2;
      }
      return {...state, ...action}
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
    
    },
  },
};
