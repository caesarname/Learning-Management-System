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
import { useNavigate } from 'react-router-dom'
import '../style/resetPassword.css'
import { useState } from "react";
export const ResetPassword = () => {
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
    const [form] = Form.useForm();
    const csrftoken = "HIRuIQKkpa6ofpTMHXdMl5gzNFqb2PPd55m3fjteQIMaRzaAyBOO2gAST6kywYeE";
    const history = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [code, setCode] = useState();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const toLogin = () => {
        history('/')
    }
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const sendCode = () => {
        const FormData = form.getFieldsValue()
        const { ID, email } = FormData

        axios({
            url: "http://129.226.223.80:8000/user/email_ver/",
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken },
            data: {
                id: ID,
                email,
            }
        }).then(res => {
            console.log(res.data, 'res.data')
            if (res.data.status === 'success') {
                setCode(res.data.ver_code);
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.status,
                });
            }
        }).catch(e => {
            messageApi.open({
                type: 'error',
                content: 'request error!',
            });
        })
    }
    const onFinish = (values) => {
        const { ID, pin } = values
        if (pin === code) {
            history(`/resetPassword2`, { state: {id:ID} })
        } else {
            messageApi.open({
                type: 'error',
                content: 'pin code is error',
            });
        }
    };
    const toSignUp = () => {
        console.log(history, 'hosss')
        window.location.hash = '/SignUp';
    }
    return (
        <div className="resetPassword">
            <div className="title">Verification</div>
            {contextHolder}
            <Form
                form={form}
                {...formItemLayout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                style={{ maxWidth: 600 }}
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
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item  label="Pin Code">

            <Row gutter={8}>
          <Col span={16}>
          <Form.Item
                    name="pin"

                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input pin code!',
                        },
                    ]}
                >
                    <Input />

                </Form.Item>
          </Col>
          <Col span={8}>
          <Button type="primary" onClick={sendCode}>
            Get pin via email
            </Button>
          </Col>
        </Row>
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
            
        </div>
    );
};
