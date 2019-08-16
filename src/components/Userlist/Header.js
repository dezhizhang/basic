import React, { Component } from 'react'
import { Form, Input, Row, Col,Select, Button,Radio} from 'antd';
import { orderChannel } from 'services/order';
import styles from './index.less';
const { Option } = Select;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      channel: []
    }
  }
  componentDidMount() {
    orderChannel({
      id: window.localStorage.getItem('id')
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          channel: res.data
        })
      }
    })
  }
  getFields() {
    const count = this.state.expand ? 6 : 3;
    const { getFieldDecorator } = this.props.form;
    const Item = [
      <Form.Item label={`渠道 `} style={{ marginBottom: '-1px'}}>
        {getFieldDecorator(`channelName`, { initialValue: '' })(
          <Select>
            <Option value="">全部</Option>
            {
              this.state.channel.map((item, idx) => {
                return <Option key={idx} value={item.channelname} >{item.channelname}</Option>
              })
            }
          </Select>
        )}
      </Form.Item>,
      <Form.Item label={`信用评分 `}>
        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: '-1px' }}>
          {getFieldDecorator(`minCreditScore`)(
            <Input  placeholder="" />
          )}
        </Form.Item>
        <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
          ～
        </span>
        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: '-1px' }}>
          {getFieldDecorator(`maxCreditScore`)(
            <Input  placeholder="" />
          )}
        </Form.Item>
      </Form.Item>,
      <Form.Item label={`用户类型 `}>
        {getFieldDecorator(`userType`)(
          <Radio.Group style={{ color: '#F7A52B' }}>
            <Radio value="1">个人</Radio >
            <Radio value="2">企业</Radio >
          </Radio.Group>
        )}
      </Form.Item>,
      <Form.Item label={`用户名称 `}>
        {getFieldDecorator(`userName`, {
          rules: [
            {
              pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g,
              message: '输入的用户名称不合法'
            }
          ]
        })(
          <Input placeholder="请输入" />
        )}
      </Form.Item>,
      <Form.Item label={`用户ID `}>
        {getFieldDecorator(`userNo`, {
          rules: [
            {
              pattern: /^[a-zA-Z0-9_-\u4e00-\u9fa5]+$/g,
              message: '输入的用户ID不合法'
            }
          ]
        })(
          <Input placeholder="请输入" />
        )}
      </Form.Item>,
      <Form.Item label={`手机号码 `}>
        {getFieldDecorator(`mobile`, {
          rules: [{
              pattern:/^1[3456789]\d{9}$/g,
              message: '输入的手机号不合法'
            }]
        })(
          <Input placeholder="请输入" />
        )}
      </Form.Item>,
    ]
    const children = [];
    for (let i = 0; i < 6; i++) {
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none', height: 40 }}>
          {Item[i]}
        </Col>
      );
    }
    return children;
  }
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  handleSearch = (e) => {
    let that = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          that.props.changeCondition('UserQuery', values);
      }
    });
  }
  jiaoyan = (min, max) => {
    min = min === undefined ? 0 : Number(min);
    max = max === undefined ? 0 : Number(max);
    return min <= max
  }
  render() {
    return (
      <div className={styles.header}>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button size='small' style={{ height: 26, width: 50, background: '#1660FF', borderColor: '#1660FF' }} type="primary" htmlType="submit">搜索</Button>
              <Button size='small' style={{ marginLeft: 8, height: 26, width: 50, color: '#5e5e5e', borderColor: "#C7C8CC" }} onClick={this.handleReset}>
                重置
            </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(Header);