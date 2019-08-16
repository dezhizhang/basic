import React, { PureComponent } from 'react';
import { Icon, Avatar,Modal } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
const { confirm } = Modal;

class GlobalHeader extends PureComponent {
  state = {
    visible:false
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  //跳转个人账户页面
  gotoPage = () => {
    this.props.dispatch(routerRedux.push({
      pathname: `/accountuser`,
    }))
  }
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  //退出登录
  handleLogOut = () => {
    let that = this;
    confirm({
      title: '你确定要退出吗?',
      content: '',
      onOk() {
        that.props.loginout()
      },
      onCancel() {
        console.log('取消');
      },
    });
  }
  render() {
    const {currentUser = {},collapsed,loginout,logo } = this.props;
    

    return (
      <div className={styles.header}>
        <div className={styles.left}>
          <img className={styles.logo} src={logo} />
          <span className={styles.title}>风控组件管理</span>
          <span className={styles.fenge}></span>
          <Icon className={styles.icon} onClick={this.toggle} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </div>
        <div className={styles.right}>
          {/* <div className={styles.message}>
            <a ><img width='12' src={require('../../assets/bell.png')} style={{ color: '#fff' }} /></a>
            <span>{5}</span>
          </div> */}
          {/* <span className={styles.fenge}></span> */}
          <span className={styles.account}>
            <span className={styles.name}>{`欢迎您！${window.localStorage.username}`}</span>
            <Avatar size="small" onClick={this.gotoPage} shape='square' className={styles.avatar} src={currentUser.avatar} />
          </span>
          <span className={styles.out}  onClick={this.handleLogOut}>
            <img src={require('../../assets/out.png')} />
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menu:state.menu
  }
}
export default connect(mapStateToProps)(GlobalHeader)