import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqLogin } from '../../api'
import logo from './images/logo.png'
import './login.less'

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, {username, password}) => {
      if (!err) {
        const result = await reqLogin(username, password)
        if (result.status===0) {
          const user = result.data
          storageUtils.saveUser(user)
          memoryUtils.user = user

          this.props.history.replace('/')
          message.success('登陆成功!')
        } else { 
          message.error(result.msg)
        }
      } else {
      }
    })
  }

  validatePwd = (rule, value, callback) => {
    value = value.trim()
    if (!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码不能小于4位')
    } else if (value.length>12) {
      callback('密码不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() 
    }
  }

  render() {
    const user = memoryUtils.user
    if (user._id) {
      return <Redirect to="/" /> 
    }
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <div className="login-header">
          <img src={logo} alt="logo"/>
          <h1>后台管理系统</h1>
        </div>
        <div className="login-content">
          <h1>用户登陆</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', { 
                  initialValue: '', 
                  rules: [ 
                    { required: true, whitespace: true, message: '用户名是必须' },
                    { min: 4, message: '用户名不能小于4位'},
                    { max: 12, message: '用户名不能大于12位'},
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  initialValue: '', 
                  rules: [
                    { validator: this.validatePwd}
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">登 陆</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
const WrapperForm = Form.create()(Login)
export default WrapperForm