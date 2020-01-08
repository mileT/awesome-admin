import React from 'react';
import './LoginForm.css';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;
// TODO: 紫金目前没有svg logo，待有logo时，添加logo
// const logo = 'https://www.zjtrust.com.cn/my/cn/homepage/xintuo/images/logo.png';
const copyright = <div>Copyright 2018 <Icon type="copyright" />我是码农良民</div>;

class LoginForm extends React.Component {

    state = {
        submitting: false,
        autoLogin: false
      };

    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            // login请求后，服务端返回302跳转，事件向上传递使用原始方式提交
            if (err){
                e.preventDefault();
            }
        });
    }   

    changeAutoLogin = e => {
        this.setState({
          autoLogin: e.target.checked,
        });
      };

    // TODO: 记住我，功能未实现
    render() {
        const { autoLogin, submitting } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
          <div className='container'>
            <div className='content'>
                <div className='header'>
                  <div>
                    {/* <img alt="logo" className='logo' src={logo} /> */}
                    <span className='title'>码农良民登录界面</span>
                  </div>
                </div>
                <div className='desc'>心中有理想，脚下有力量</div>
                <Form onSubmit={this.handleSubmit} action='./oauth/custom/token' method='POST' className="login-form">
                      <FormItem>
                          {getFieldDecorator('username', {
                              rules: [{ required: true, message: '请输入用户名!' }],
                          })(
                              <Input name='username' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                          )}
                      </FormItem>
                      <FormItem>
                          {getFieldDecorator('password', {
                              rules: [{ required: true, message: 'Please input your Password!' }],
                          })(
                              <Input name='password' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                          )}
                      </FormItem>
                      <FormItem className="login-form-forgot"> 
                          <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>Remember me</Checkbox>    
                      </FormItem>
                      <FormItem>
                          <Button type="primary" htmlType="submit" loading={submitting} className="login-form-button">登录</Button>
                      </FormItem>
                  </Form>
            </div>
            <div className='foot'> {copyright} </div>
          </div>
        );
      }
}

const WrappedLoginForm = Form.create()(LoginForm);
export default WrappedLoginForm;