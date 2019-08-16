import React, { memo, Fragment } from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'

const MyIcon = memo(function MyIcon(props) {
  return (
    <Fragment>
      {
        props.type ?
          (<Icon type="check" style={{ color: '#00f' }} />)
          :
          (<Icon type="close" style={{ color: '#f00' }} />)
      }
    </Fragment>
  )
})

MyIcon.propTypes = {
  type: PropTypes.bool
}

MyIcon.defaultProps = {
  type: true
}
export default MyIcon
