import React, { PureComponent } from 'react';
import styles from './Steps.less'


export default class Steps extends PureComponent {

  render() {
    const { current } = this.props;
    return (
      <div className={styles.main}>
        {   
          this.props.data.map((item, index) => {
            let needSignCert = item.content.props.needSignCert;
            return (
              <div style={{display:index == 2 && needSignCert == 'false' ? 'none':'block'}} key={index} className={current >= index ? styles.selected : (current + 1 === index ? styles.next :needSignCert =='true' ? styles.show:styles.hide)}>{item.title}</div>
            )
          })
        }
      </div>
    )
  }
}
