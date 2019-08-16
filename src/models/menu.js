import { getOwnMenuList } from 'services/api'
export default {
  namespace: 'menu',
 
  state: {
    list: [
      {
        menuName: '首页',
        menuIcon: 'home',
        menuUrl: 'index',
        hideInMenu: true,
      },
      {
        menuName: '指标管理',
        menuIcon: 'usergl',
        menuUrl: 'usermanagement',
        childMenus: [
          {
            menuName: '用户列表',
            menuUrl: 'list',
          },
        ]
      },
      {
        menuName: '组件管理',
        menuIcon: 'rzgl',
        menuUrl: 'financing',
        childMenus: [
          {
            menuName: '评分卡管理',
            menuUrl: 'listorder',
          },   
          {
            menuName: '规则管理',
            menuUrl: 'listorder',
          },
          {
            menuName: '决策表管理',
            menuUrl: 'listorder',
          },   
          {
            menuName: '决策树管理',
            menuUrl: 'listorder',
          },   
          {
            menuName: '决策流管理',
            menuUrl: 'listorder',
          },   
        ]
      },
      {
        menuName: '方案管理',
        menuIcon: 'shgl',
        menuUrl: 'audit',
        childMenus: [
         
          {
            menuName:'已审核任务',
            menuUrl:'checked',
          }
         
        ]
      },
      {
        menuName: '组件测试',
        menuIcon: 'shgl',
        menuUrl: 'audit',
        childMenus: [
         
          {
            menuName:'已审核任务',
            menuUrl:'checked',
          }
         
        ]
      },
      {
        menuName: '流程管理',
        menuIcon: 'shgl',
        menuUrl: 'audit',
        childMenus: [
         
          {
            menuName:'已审核任务',
            menuUrl:'checked',
          }
         
        ]
      },
    ],

  },
 
  effects: {
    *getMenu({ payload }, { call, put }) {
      let  response = yield call(getOwnMenuList, payload);
      if(response.code == 200) {
        let payload = response.data || []
        yield put({type:'changeMenu',payload:payload})
      }
    },
  },
  reducers: {
    changeMenu(state, { payload }) {
      return {...state,list: payload};
    },
  },
};