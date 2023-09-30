import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, Popconfirm, message, Select } from 'antd'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import '../style/quiz.css';
import TextArea from 'antd/es/input/TextArea';
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
};
const OpenQuestion = (props) => {
    const [questions, setQuestions] = useState([])
    const [questionIndex, setQuestionIndex] = useState(0)
    const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }
    const [form] = Form.useForm()
    const { id: courseid, quizid } = useParams();

    useEffect(() => {
        if(quizid !== "new"){
            setQuestions(props.questions)
        }	
    }, [props.questions,quizid])

    const submitForm = () => {
        form.validateFields()
            .then(values => {
                console.log(values);
            })
    }

    const add = () => {
        form.setFieldsValue({
            "questions": [...questions, {
                value: "", explain: "", type:"open"
            }]
        })
        return setQuestions([...questions, {
            value: "", explain: "", type:"open"
        }])
    }
    const del = (index) => {
        form.setFieldsValue({ "questions": [...questions.slice(0, index), ...questions.slice(index + 1)] })
        return setQuestions([...questions.slice(0, index), ...questions.slice(index + 1)])
    }

    const onChange = (index, name, event) => {
        let tempArray = [...questions];
        switch (name) {
            case 'question':
                tempArray[index] = {
                    ...tempArray[index],
                    question: event.target.value,
                }
                break;
            case 'value':
                tempArray[index] = {
                    ...tempArray[index],
                    value: event.target.value,
                }
                break;
            case 'explain':
                tempArray[index] = {
                    ...tempArray[index],
                    explain: event.target.value,
                }
                break;
            default:
                break;
        }
        return setQuestions(tempArray)
    }
    const onBlur = (index, name, event) => {
        props.openQuestion(questions)
    }
    const confirm = (e) => {
        del(questionIndex)
        message.success('Delete Successfully!');
    };

    const cancel = (e) => {
        message.error('Cancel');
    };

    const questionsItems = questions.map((item, index) => {
        return <div key={index}>
            <Form.Item label="Open-ended Question" name={['question', index, 'question']}>
                <Row >
                    <Col span={20} >
                        <TextArea onChange={(event) => onChange(index, 'question', event)} value={item.question} onBlur={(event) => onBlur(index, 'question', event)}/>
                    </Col>
                    <Col span={3} offset={1}>
                        <div className="delete" >
                            <Popconfirm
                                title="Tip"
                                description="Do you want to delete this question?"
                                onConfirm={confirm}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" onClick={() => { setQuestionIndex(index) }}>Delete</Button>
                            </Popconfirm>
                        </div>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item label="Mark" name={['value', index, 'value']} 
            rules={[{
                pattern:
                  /^\d+(.\d{1,2})?$/,
                message: "Please input valid mark!",
                trigger: "blur",
              }]} >
                <Row >
                    <Col span={20} >
                        <Input onChange={(event) => onChange(index, 'value', event)} value={item.value} onBlur={(event) => onBlur(index, 'value', event)}/>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item label="Sample Answer" name={['explain', index, 'explain']} >
                <Row >
                    <Col span={20} >
                        <TextArea onChange={(event) => onChange(index, 'explain', event)} value={item.explain} onBlur={(event) => onBlur(index, 'explain', event)} />
                    </Col>
                </Row>
            </Form.Item>

        </div>
    })
    return <Row>
        <Col>
            <Form name="question_form" form={form} onFinish={submitForm} {...formItemLayout} initialValues={{ questions: questions }}>
                {questionsItems}
                <Form.Item>
                    {quizid === "new" && <Button type="primary" onClick={add}>Add Open-ended Question</Button>}
                </Form.Item>
            </Form>
        </Col>
    </Row>
}
export default OpenQuestion