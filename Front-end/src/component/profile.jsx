import { useState, useEffect } from "react";
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
  Upload,
  Space,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import "../style/profile.css";
import { UploadAvatar } from "./uploadAvatar";
const { Option } = Select;
export const Profile = () => {
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
  const [form] = Form.useForm();
  const csrftoken =
    "HIRuIQKkpa6ofpTMHXdMl5gzNFqb2PPd55m3fjteQIMaRzaAyBOO2gAST6kywYeE";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const history = useNavigate();
  const [img, setImg] = useState();
  const parseBlob = (base64) => {};
  useEffect(() => {
    // get profile
    axios("http://129.226.223.80:8000/api/user/get_profile/", {
      method: "post",
      header: { "Content-Type": "application/json" },
      data: { zid: localStorage.getItem("zid") },
    }).then((res) => {
      const data = res.data;
      form.setFieldsValue(data);
      const img_src = `data:image/jpeg;base64,${data.photo}`;
      setImg(img_src);
    });
  }, []);
  const toLogin = () => {
    history("/");
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const change = (info) => {};
  const onFinish = (values) => {
    const { ID, email, first_name, last_name } = values;
    axios("http://129.226.223.80:8000/api/user/modify_profile/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        zid: ID,
        email,
        first_name,
        last_name,
      },
    })
      .then((res) => {
        if (res.data.status === "success") {
          // showModal();
          messageApi.open({
            type: "success",
            content: "change success",
          });
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
    <div className="profile_container">
      <div className="profile_title">My Profile</div>
      {contextHolder}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
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
        <Form.Item label="ID" name="ID">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="email" label="E-mail">
          <Input />
        </Form.Item>

        <Form.Item name="first_name" label="First Name">
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="Last Name">
          <Input />
        </Form.Item>
        <Form.Item label="Photo" valuePropName="fileList">
          <UploadAvatar zid={form.getFieldValue("ID")} imgPreviews={img} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
