import { parse, stringify } from 'qs';
import { downloadapi } from 'services/api';
export const baseUrl = API_ENV === 'dev'
  ?
  ''
  :
  API_ENV === 'clouddev' ?
    
   
    'http://192.168.0.140:7001/riskWeb'
    :
    'http://192.168.0.140:7001/riskWeb';
 
 
function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

//获取路径最后一个
export function getPageid() {
  return window.location.href.split('/').pop();
}

/** 验证手机号*/
export function checkMobile(mobile) {
  return /^((1[358][0-9])|(14[57])|(17[0678])|(19[7]))\d{8}$/.test(mobile);
}

//生成随机字符串
export function createStr(len = 8) {
  let chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let timestamp = new Date().getTime();
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str + timestamp;
}
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}
export function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

//时间是否加0
function addZero(m) { return m < 10 ? '0' + m : m }
//时间戳转时间
export function transTimer(times, type) {
  //shijianchuo是整数，否则要parseInt转换
  if (!times) return;
  let time = new Date(times);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  if (type === 'day') return y + '-' + addZero(m) + '-' + addZero(d);
  return y + '-' + addZero(m) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(mm) + ':' + addZero(s);
}
//时间字符串转时间戳
export function transDate(date) {
  if (!date) return;
  let time = date.replace(/-/g, '/');
  return new Date(time).getTime()
}
//转为会计计数
export function moneyformat(num) {
  if (!num) {
    return;
  }
  let sign = '';
  let cents = ''
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num))
    num = "0";
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10)
    cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
  return (((sign) ? '' : '-') + num + '.' + cents);
}
//下载
export function downloadFun(url) {
  downloadapi({
    url
  }).then((response) => {
    response.blob().then(blob => {
      if (!response.headers.get('Content-Disposition')) {
        return;
      }
      let filename = response.headers.get('Content-Disposition').split('fileName=')[1] || 'file.zip';
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
  })
}
export function toDay(time) {
  let date = new Date(time);
  return '每月' + date.getDay() + '日'
} 
export function toTimes(time) {
  if(!time) return
  let date = new Date(time);
  return date.getFullYear() + '-'+ addZero(date.getMonth() + 1) + '-' + addZero(date.getDay())
}

//生成随机时间
export function roundTime() {
  
  let time = new Date();
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y  +  addZero(m) + addZero(d) + ' ' + addZero(h) + ':' + addZero(mm) + ':' + addZero(s);

}
//精度处理
export function toPrecision(arg) {
    var r1,r2,m;   
    try{r1=this.toString().split(".")[1].length}catch(e){r1=0}   
    try{r2=arg.toString().split(".")[1].length}catch(e){r2=0}   
    m=Math.pow(10,Math.max(r1,r2))   
    return (this*m+arg*m)/m   
}


