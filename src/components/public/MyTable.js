import { Fragment } from 'react';
import styles from './MyTable.less';

//左右表格
const creatTable = (sourcedata, colnum, style) => {
  let data = [].concat(sourcedata);
  while (data.length % colnum !== 0) {
    data.push({
      key: '',
      val: ''
    })
  }
  const row = Math.round(data.length / colnum);
  let tr = [];
  for (let i = 0; i < row; i++) {
    tr.push(<tr key={i}>
      {
        data.slice(i * colnum, i * colnum + colnum).map((item, idx) =>
          <Fragment key={idx}>
            <td style={{ ...style.td }}>{item.key}</td>
            <td style={{ ...style.td }}>{item.val}</td>
          </Fragment>
        )
      }
    </tr>)
  }
  return tr;
}

//上下表格
const creatcolTable = (sourcedata, columns, nodataTitle, style) => {
  let tr = [];
  for (let i = 0; i < sourcedata.length; i++) {
    tr.push(<tr key={i}>
      {
        columns.map((item, idx) =>
          <Fragment key={idx}>
            <td key={idx} style={{ ...style.td }}>{
              item.render
                ?
                item.render(sourcedata[i])
                :
                sourcedata[i][item.key]
            }</td>
          </Fragment>
        )
      }
    </tr>)
  }

  if (sourcedata.length < 1) {
    tr.push(<tr key={'nodata'}><td colSpan={columns.length}>{nodataTitle}</td></tr>)
  }
  return tr;
}

const MyTable = ({ data ,Istyle  }) => {
  const { type, colnum, style = {}, columns, nodataTitle } = data;
  return (
    <div className={styles.mytable} style={Istyle}>
      <div className={styles.title}>{data.title}<span className={styles.tag}>{data.tag}</span></div>
      <table className={type === 'col' ? styles.coltable : styles.rowtable}>
        {
          type === 'col'
            ?
            <thead>
              <tr>
                {
                  columns.map((item, index) => {
                    return <th key={item.key}>{item.val}</th>
                  })
                }
              </tr>
            </thead>
            :
            null
        }
        <tbody>
          {
            type === 'col'
              ?
              creatcolTable(data.data, columns, nodataTitle, style)
              :
              creatTable(data.data, colnum, style)
          }
        </tbody>
      </table>
    </div>

  )

}

export default MyTable