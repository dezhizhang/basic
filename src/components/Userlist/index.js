import React, { Component } from 'react'
import { connect } from 'dva';
import { queryUserList } from 'services/userlist'
import Header from './Header'
import Content from './Content'
// import ExportJsonExcel from 'js-export-excel'
import styles from './index.less'

 class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      total: 0,
      pageSize: 20, //每页数量
      pageIndex: 1,  //页数
      offset:1,
      limit:20,
      UserQuery: {
      }
    }
  }

  componentDidMount() {
    this.getList();
    this.getMenuList();
  }
  //获取菜单
  getMenuList() {
    this.props.dispatch({type:'menu/getMenu'});
  }

  download = () => {
    const { UserQuery } = this.state;
    Object.keys(UserQuery).map(item => {
      if (UserQuery[item] === '') {
        delete UserQuery[item];
      }
      if (item === 'userType' && UserQuery[item]) {
        if (UserQuery[item].length === 2) {
          delete UserQuery[item];
        } else if (UserQuery[item].length === 0) {
          UserQuery[item] = 333
        } else {
          UserQuery[item] = UserQuery[item][0]
        }
      }
      return void 0;
    })
    // let downloadUrl = 'http://192.168.0.109:8080/financeAdmin/user/get/excel?'
    // Object.keys(UserQuery).map(item=>{
    //   downloadUrl +=`${item}=${UserQuery[item]}&`
    // })
    // let a = document.createElement('a');
    // a.href = downloadUrl;
    // a.download = 'excel';
    // a.click();
    // this.downloadTableData()

    let data = this.state.data.filter((Item) => {
      let bool = true;
      Object.keys(UserQuery).every(item => {
        if (UserQuery[item] !== Item[item]) {
          bool = false;
          return null;
        }
        return void 0;
      })
      return bool
    })

    let option = {};

    option.fileName = 'execl';
    let exceldata = data.map(item => {
      return {
        one: item.userNo,
        two: item.name,
        three: item.userType,
        four: item.channelName,
        five: item.creditScore,
        six: item.createdTime,
      }
    })
    option.datas = [
      {
        sheetData: exceldata,
        sheetName: 'sheet',
        sheetHeader: ['用户编号', '客户名称', '用户类型', '来源渠道', '信用评分', '注册时间'] //标题
      }
    ];

    // var toExcel = new ExportJsonExcel(option); //new
    // toExcel.saveExcel();
  }


  downloadTableData = () => {
    const downloadUrl = 'http://192.168.0.109:8080/financeAdmin/user/get/excel';
    fetch(downloadUrl).then((response) => {
      response.blob().then(blob => {
        let filename = response.headers.get('Content-Disposition') || 'file.mp4';
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          let a = document.createElement('a');
          let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上) 
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      });
    }).catch((error) => {
      console.log(error);
    });

  }

  getList = () => {
    const { offset, limit, UserQuery } = this.state;
    Object.keys(UserQuery).map(item => {
      if (UserQuery[item] === '') {
        delete UserQuery[item];
      }
      if (item === 'userType' && UserQuery[item]) {
        if (UserQuery[item].length === 2) {
          delete UserQuery[item];
        } else if (UserQuery[item].length === 0) {
          UserQuery[item] = 333
        } else {
          UserQuery[item] = UserQuery[item][0]
        }
      }
    })
    queryUserList({ ...UserQuery, limit, offset }).then((res) => {
      if(res.code == 200) {
        let data = res.data;
        this.setState({
          loading:false,
          data:data.rows,
          total:data.total
        })
      } else {
        this.setState({
          loading:false
        })
      }
    })
  }

  //改变分页或者分页数
  changePaginat = (data) => {
    this.setState({
      ...data,
      loading: true
    }, function () {
      this.getList()
    })
  }

  changeCondition = (key, val) => {
    this.setState({
      [key]: val,
      pageIndex:1
    }, function () {
      this.getList()
    })
  }
  onShowSizeChange = (data) => {
      let pageIndex = data.offset;
      this.setState({
        pageIndex,
        ...data,
        loading:true
      },() => {
        this.getList()
      })
  }

  render() {
    const { data, loading, total ,offset,limit } = this.state;
    return (
      <div className={styles.main}>
        <Header changeCondition={this.changeCondition} />
        <Content
          changePaginat={this.changePaginat}
          changeCondition={this.changeCondition}
          onShowSizeChange={this.onShowSizeChange}
          dataSource={data}
          loading={loading}
          total={total}
          offset={offset}
          pageSize={limit}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    menu:state.menu
  }
}

export default connect(mapStateToProps)(Index)
