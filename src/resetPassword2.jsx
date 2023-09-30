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
  Select, Modal,
  message,
  Space, Tooltip, Typography
} from "antd";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'
import '../style/resetPassword.css'
import { useState, useEffect } from "react";
export const ResetPassword2 = () => {
  const [form] = Form.useForm();
  const csrftoken = "HIRuIQKkpa6ofpTMHXdMl5gzNFqb2PPd55m3fjteQIMaRzaAyBOO2gAST6kywYeE";
  const history = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const state = useLocation()
  useEffect(() => {
    // const { state } = state
    form.setFieldsValue({ "ID": state.state.id })
  }, [])
  const showModal = () => {
    setIsModalOpen(true);
  };
  const toLogin = () => {
    history('/')
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    const FormData = form.getFieldsValue()
    const { ID, password } = FormData
    const form1 = new FormData()
    form1.append("ID", ID)
    form1.append('new_password',password)
    axios({
      url: "http://129.226.223.80:8000/user/resetpassword/",
      method: "post",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrftoken },
      data: form1
    }).then(res => {
      if (res.data.success === 'success') {
        showModal();
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
    window.location.hash = '/SignUp';
  }
  return (
    <div className="resetPassword">
      <div className="title">Reset Password</div>
      {contextHolder}
      <Form
        name="basic"
        form={form}
        labelCol={{
          span: 12,
        }}
        wrapperCol={{
          span: 24,
          style: { width: '200px' }
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
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please input your New Password!",
              trigger: "blur",
            },
            {

              pattern:
                /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,}$/,
              message: "The password must contain at leat 8 characters, including digit, letter and special character",
              trigger: "blur",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
              trigger: "blur",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Your passwords do not match, please try again!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" style={{ marginRight: 20 }} onClick={toLogin} >
            Log In
          </Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal title="Congratulations!" open={isModalOpen}
        afterClose={toLogin}
        onCancel={toLogin}
        onOk={handleOk} cancelButtonProps={{ style: { display: 'none' } }}>
        <p>Password changed successfully!</p>
      </Modal>
    </div>
  );
};
