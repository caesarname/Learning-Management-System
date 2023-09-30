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
  Upload,
  message,
  Modal,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import "../style/signUp.css";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
export const SignUp = () => {
  const [form] = Form.useForm();
  const csrftoken =
    "HIRuIQKkpa6ofpTMHXdMl5gzNFqb2PPd55m3fjteQIMaRzaAyBOO2gAST6kywYeE";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const history = useNavigate();
  const toLogin = () => {
    history("/");
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    axios({
      url: "http://129.226.223.80:8000/api/user/signupback/",
      withCredentials: true,
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: values,
    })
      .then((res) => {
        if (res.data.success === "success") {
          showModal();
        } else {
          messageApi.open({
            type: "error",
            content: res.data.success,
          });
        }
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: "request error!",
        });
      });
  };
  return (
    <div className="signUp">
      <div className="title2">Register</div>
      {contextHolder}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 800,
        }}
        labelAlign={"right"}
        labelCol={{
          style: { width: 160 },
        }}
        wrapperCol={{
          style: { width: "200px" },
        }}
        scrollToFirstError
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
              pattern: /^z[0-9]{7}$/,
              message: "ID should be z+7 digits, e.g.z1234567",
              trigger: "blur",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[
            {
              required: true,
              message: "Please select role!",
            },
          ]}
        >
          <Select placeholder="select your role">
            <Option value="teacher">teacher</Option>
            <Option value="student">student</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
              trigger: "blur",
            },
            {
              pattern:
                /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*/()%-+='";:<>?,])[A-Za-z0-9._~!@#$^&*/()%-+='";:<>?,]{8,}$/,
              message:
                "The password must contain at leat 8 characters, including digit, letter and special character",
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
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
              trigger: "blur",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Your passwords do not match, please try again!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="First Name"
          label="First Name"
          rules={[
            {
              required: true,
              message: "Please input your First Name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Last Name"
          label="Last Name"
          rules={[
            {
              required: true,
              message: "Please input your Last Name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" style={{ marginRight: 20 }} onClick={toLogin}>
            Log In
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Congratulations!"
        open={isModalOpen}
        onCancel={toLogin}
        afterClose={toLogin}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>You have successfully registered!</p>
      </Modal>
    </div>
  );
};
