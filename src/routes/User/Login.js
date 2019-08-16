import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Form, Icon, Input } from 'antd';
import styles from './login.less';
import loginImage from 'assets/login-image.png';
import login from 'assets/logo.png';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  isSubmit = false;
  handleSubmit = (e) => {
    if (this.isSubmit) return;
    e.preventDefault();
    const { dispatch } = this.props;
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        that.isSubmit = true;
        dispatch({
          type: 'login/login',
          payload: {
            ...values
          },
          callback: (msg) => { that.isSubmit = false; }
        });
      }
    });
  };

  renderMessage = content => {
    message.success(content);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.bg}>
        <div className={styles['bg-box']}>
          <div className={styles.login}>
            <div className={styles['login-box']}>
              <div className={styles["login-left"]}>
                <img className={styles["left-image"]} src={loginImage} alt='风控组件管理' />
              </div>
              <div className={styles["login-right"]}>
                <div className={styles["right-box"]}>
                  <div className={styles["login-image"]}>
                    <img className={styles["right-image"]} src={login} alt='风控组件管理' />
                  </div>
                  <h2 className={styles["login-title"]}>风控组件管理</h2>
                  <Form onSubmit={this.handleSubmit} className={styles["login-form"]}>
                    <Form.Item>
                      {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名' }],
                      })(
                        <Input addonBefore={<Icon type="user" style={{ color: '#81A8E4' }} />} placeholder="请输入用户名" />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                      })(
                        <Input addonBefore={<Icon type="lock" style={{ color: '#81A8E4' }} />} type="password" placeholder="请输入密码" />
                      )}
                    </Form.Item>
                    {/* <Form.Item style={{ marginTop: '-8px' }}>
                      <Link className={styles["login-form-forgot"]} to="/register/remember">忘记密码？</Link>
                    </Form.Item> */}
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className={styles["login-form-button"]}>
                        登 录
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create()(LoginPage)