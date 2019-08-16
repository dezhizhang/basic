//返回按钮
//path 为 返回的路径 默认为index
// Istyles 为样式

import React, { memo, Fragment } from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import {Link} from 'dva/router'
const Mygoback = memo(function MyIcon(props) {
  const backSvg = () => {
    return <svg t="1547736442390" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1994" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16">
      <defs><style type="text/css"></style></defs>
      <path d="M398.259 312.832V85.348L0.007 483.503 398.259 881.82V648.502c284.4 0 483.565 91.004 625.735 290.15-56.838-284.472-227.502-568.82-625.735-625.82" p-id="1995" fill="#2764E6"></path>
    </svg>
  }
  return (
    <Fragment >
      <Link
        style={{
          display:'inline-block',
          background: ' #EFF2FF',
          border: '1px solid #2764E6',
          borderRadius: '4px',
          fontFamily: 'PingFangSC-Regular',
          fontSize: '14px',
          color: '#2764E6',
          width:'162px',
          height:'32px',
          lineHeight:'32px',
          textAlign:"center",
          position: 'relative',
          left: '50%',
          top: '0px',
          transform: 'translateX(-50%)',
          ...props.Istyles
        }}
        to={props.path}
        onClick = {() => {
          try{
            localStorage.removeItem('orderBizNo');
            localStorage.removeItem('userNo');
            localStorage.removeItem('userType');
          } catch(e) {
            console.log(e)
          }
        }}
      >
        <Icon component={backSvg} style={{marginRight:'10px'}} />返回
        </Link>
    </Fragment>
  )
})

Mygoback.propTypes = {
  Istyles: PropTypes.object,
  path: PropTypes.string
}

Mygoback.defaultProps = {
  path: '/index'
}

export default Mygoback
