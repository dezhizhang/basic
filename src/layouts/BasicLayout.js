import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import GlobalHeader from 'components/GlobalHeader';
import GlobalFooter from 'components/GlobalFooter';
import SiderPage from 'components/SiderPage';
// import NotFound from 'routes/Exception/404';
import { getRoutes } from 'utils/utils';
import Authorized from 'utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from 'assets/logo.png';

const { Content, Header, Footer, Sider } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
@connect(({ user, global = {}, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
}))
export default class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }
  componentWillUnmount() {

  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '风控组件管理';
    let currRouterData = null;
    // match params path
    for (const key in routerData) {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
        break;
      }
    }
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 风控组件管理`;
    }
    return title;
  }
  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }

    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };
  //退出登录
  loginout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });

  }
  render() {
    const {
      currentUser,
      collapsed,
      routerData,
      match,
      location,
    } = this.props;

    const baseRedirect = this.getBaseRedirect();
    const layout = (
      <Layout>
        <Header style={{ padding: 0, lineHeight: '50px', height: '50px' }}>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            collapsed={collapsed}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            loginout={this.loginout}
          />
        </Header>
        <Layout style={{ background: "#fff" ,height:'calc(100vh - 50px)' }}>
          <Sider
            style={{backgroundColor:'#EBEAF0'}}
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={170}
            collapsedWidth={36}
          >
            <SiderPage collapsed={collapsed} />
          </Sider>
          <Layout style={{ background: "#fff",position:'relative',overflow:'hidden' }}>
            <Content style={{ backgroundColor: '#fff',overflow:'auto'}}>
              <Switch>
                {redirectData.map(item => (
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                ))}
                {getRoutes(match.path, routerData).map(item => (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                  />
                ))}
                <Redirect exact from="/" to={baseRedirect} />
              </Switch>
            </Content>

            <Footer style={{ padding: 0 }}>
              <GlobalFooter
                copyright={
                  <Fragment>
                    Copyright 2019 smartdata360 Inc. 粤ICP备14003701号
                </Fragment>
                }
              />
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}
