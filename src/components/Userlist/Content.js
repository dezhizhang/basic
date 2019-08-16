import React, { PureComponent } from 'react';
import { Table, message, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ExportJsonExcel from 'js-export-excel';
import { transTimer } from 'utils/utils'
import { downloadicon } from 'assets/icon/icon'
import styles from './index.less'

class Content extends PureComponent {
  onChange = (page) => {
    this.props.changePaginat({ limit: page.pageSize, offset: page.current });
  }
  onShowSizeChange = (current,size) => {
    this.props.showSizeChange({offset:current,limit:size})
  }
  topage = (obj) => {
      
      localStorage.setItem('userType',obj.userType);
      localStorage.setItem('userNo',obj.userNo);
      this.props.dispatch(routerRedux.push({
        pathname: `/usermanagement/detail`,
        payload: obj
      }));
  }
  //文件的下载
  download = () => {
    let that = this;
    let option = {};
    option.fileName = '用户列表';
    let sheetData = this.props.dataSource.map((item, index) => {
      return {
        one: item.userNo,
        two: item.name,
        three: item.userType,
        four: item.channelName,
        five: item.creditScore,
        six:  transTimer(item.createdTime) ,
      }
    })
    option.datas = [
      {
        sheetData: sheetData,
        sheetName: 'sheet',
        sheetHeader: ['用户编号', '客户名称', '用户类型', '来源渠道', '信用评分', '注册时间'] //标题
      }
    ]
    let toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  }
  //下载图标
  icon = () => {
    return <svg t="1547714640428" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5514" xmlnsXlink="http://www.w3.org/1999/xlink" width="12" height="12">
      <defs><style type="text/css"></style></defs>
      <path d="M877.49 381.468H668.638V68.191H355.36v313.277H146.51l365.489 365.49 365.49-365.49zM146.51 851.383v104.425h730.98V851.383H146.51z" fill="#Ffffff" p-id="5515"></path>
    </svg>
  }
  render() {
    const { dataSource, loading, total ,pageSize } = this.props;
    const columns = [
      {
        title: '用户编号',
        dataIndex: 'userNo',
        align: 'center'
      },
      {
        title: '客户名称',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '用户类型',
        dataIndex: 'userType',
        align: 'center',
      },
      {
        title: '来源渠道',
        dataIndex: 'channelName',
        align: 'center'
      },
      {
        title: '信用评分',
        dataIndex: 'creditScore',
        align: 'center'
      },
      {
        title: '注册时间',
        dataIndex: 'createdTime',
        align: 'center',
        render:(text,record,index)=>{
          return transTimer(text)
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (text, record, index) => {
          console.log(record);

          return <a onClick={() => { this.topage(record) }}>详情</a>
        }
      },
    ];
    const options = {
      bordered: true,
      dataSource,
      columns,
      loading,
      onChange: this.onChange,
      onShowSizeChange:this.onShowSizeChange,
      pagination: {
        total: total,
        showSizeChanger: true,
        showTotal: (total, range) => `显示第${range[0]}到第${range[1]}条记录  共${total}条`,
        pageSize: pageSize,
        defaultCurrent: 1,
        size: 'middle',
        position: 'bottom'
      },
      size: 'small',
      rowKey: 'id'
    }
    return (
      <div className={styles.content}>
        <p style={{ position: 'relative', height: '30px' }}>
          <span className={styles.icon} onClick={this.download}>
            <Icon component={downloadicon} style={{ marginRight: '5px' }} />下载
          </span>
        </p>
        <Table {...options} />
      </div>
    )
  }
}

export default connect()(Content);
