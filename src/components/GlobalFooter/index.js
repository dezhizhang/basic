import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

import * as Phone from '../../assets/phone.svg'

const GlobalFooter = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {copyright}
    </div>
  );
};

export default GlobalFooter;
