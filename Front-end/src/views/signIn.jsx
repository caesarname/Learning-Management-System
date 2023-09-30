import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  Space, Tooltip, Typography
} from "antd";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import '../style/signIn.css'
import { useState } from "react";
import { TvRounded } from "@mui/icons-material";
export const SignIn = () => {
  const [form] = Form.useForm();
  const history = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    axios({
      url: "http://129.226.223.80:8000/api/user/loginback/",
      withCredentials: true,
      method: "post",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
      data: values
    }).then(res => {
      console.log(res.data)
      if (res.data.success === 'success') {
        localStorage.setItem('zid',res.data.zid);
        localStorage.setItem('role',res.data.role);
        history('/MainPage')
      } else {
        messageApi.open({
          type: 'error',
          content: res.data.success,
        });
      }

    }).catch(e => {
      messageApi.open({
        type: 'error',
        content: 'request error!',
      });
    })
  };
  const toSignUp = () => {
    console.log(history, 'hosss')
    history('/SignUp')
  }
  const resetPassword = () => {
    console.log(history, 'hosss')
    history('/verifyEmail')
  }
  const onClose = () => {
    setShowIcon(false)
  }
  return (
    <div className="signIn">
      <div className="title1">Log In</div>
      {contextHolder}
      {/* {!!validReason && <div className="validReason">{validReason}</div>} */}
      <Form
        name="basic"
        labelCol={{
          style: { width: 130 }
        }}
        wrapperCol={{
          style: { width: 'calc(100% - 130px)' }
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="ID"
          name="ID"
          rules={[
            {
              required: true,
              message: "Please input your ID!",
            },
            {
              pattern:
              /^z[0-9]{7}$/,
              message: "ID should be z+7 digits, e.g.z1234567",
              trigger: "blur",
            }
          ]}
        >
          <Input style={{ width: '200px' }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          style={{
            width: 480,
          }}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
              trigger: "blur",
            },
          ]}
        >
          <Space>
            <Input.Password />
            <Tooltip title="Useful information">
              <Typography.Link onClick={resetPassword}>Forget Password?</Typography.Link>
            </Tooltip>
          </Space>

        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            Log In
          </Button>
          <Button type="primary" onClick={toSignUp} >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};