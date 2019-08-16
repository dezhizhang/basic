import React from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router'
import { urlToList } from 'utils/utils'
import PropTypes from 'prop-types'
import * as menu from '../../common/menu'
import styles from './index.less';

@connect(({ menu }) => ({
  menu
}))

export default class BreadPage extends React.Component {
  static contextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  getBread = () => {
    const list = this.props.menu.list
    const { pathname, hash } = window.location;

    let patharr = [];
    if (hash === '') {
      patharr = urlToList(pathname)
    } else {
      patharr = urlToList(hash.slice(1))
    }
    const menuData = this.getMenu(list);
    let url = '';
    let name = patharr.map((item, idx) => {
      url = item.split('/')[item.split('/').length - 1];
      if (!menuData[url]) {
        return null;
      }
      return (<Link to={idx === 0 ? "#" : item} replace>{menuData[url].menuName}</Link>)
    })
    name = name.filter((item)=>{ 
    return item !== null;
    })
  
    if (this.props.name instanceof Array) {
      name = name.concat(this.props.name)
    } else if(this.props.name){
      
      name.push(<a>{this.props.name}</a>)
    }
    return name.map((item, idx) => (
      <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
    ))
  }

  getMenu = (menus) => {
    let keys = {};
    let that = this;
    menus.forEach(item => {
      if (item.childMenus) {
        keys[item.menuUrl] = { ...item };
        keys = { ...keys, ...that.getMenu(item.childMenus) };
      } else {
        keys[item.menuUrl] = { ...item };
      }
    });
    return keys
  }

  render() {
    const { type = 'download' } = this.props

    return (
      <div className={styles.wrapper}>
        <span>当前位置：</span>
        <Breadcrumb separator='>'>
          {
            this.getBread()
          }
        </Breadcrumb>
        {
          this.props.type === 'download' ?
            <span className={styles.right} style={{ display: this.props.children ? "flex" : 'none' }}>
              {
                this.props.children
              }
            </span>
            :
            <span className={styles.rightC}>
              {
                this.props.children
              }
            </span>
        }

      </div>
    )
  }
}

