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
const QuizForm = (props) => {
	const [questions, setQuestions] = useState([])
	const [questionIndex, setQuestionIndex] = useState(0)
	const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }
	const [form] = Form.useForm()
	const { id: courseid, quizid } = useParams();

	useEffect(() => {
		if(quizid !== "new"){
			props.questions.forEach((res) => {
				res.options.forEach((v) => {
					v.value = Object.values(v)[0]
					v.label = Object.keys(v)[0]
				})
			})
			setQuestions(props.questions)
		}
	}, [props.questions, quizid])

	const submitForm = () => {
		form.validateFields()
			.then(values => {
				console.log(values);
			})
	}

	const option_array = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]

	const availableOpt = (index) => {
		const options = [];
		for (let i = 0; i < questions[index].options.length; i++) {
			options.push({
				label: option_array[i],
				value: option_array[i],
			});
		}
		return options
	}


	const add = () => {
		form.setFieldsValue({
			"questions": [...questions, {
				options: [
					{
						id: 0,
						label: "A"
					},
					{
						id: 1,
						label: "B"
					}
				]
				, value: "", true_ans: [], explain: "", type: "single"
			}]
		})
		return setQuestions([...questions, {
			options: [
				{
					id: 0,
					label: "A"
				},
				{
					id: 1,
					label: "B"
				}
			], value: "", true_ans: [], explain: "", type: "single"
		}])
	}
	const del = (index) => {
		form.setFieldsValue({ "questions": [...questions.slice(0, index), ...questions.slice(index + 1)] })
		return setQuestions([...questions.slice(0, index), ...questions.slice(index + 1)])
	}

	const delOption = (index, index1) => {
		questions[index].options = questions[index].options.slice(0, index1)
		form.setFieldsValue({ "questions": [...questions] })
		return setQuestions([...questions])
	}

	const addOption = (index, index1) => {
		questions[index].options[index1 + 1] = { id: index1 + 1, label: option_array[index1 + 1] }
		form.setFieldsValue({ "questions": [...questions] })
		return setQuestions([...questions])
	}

	const onChange = (index, name, event) => {
		let tempArray = [...questions];
		const option_index = option_array.indexOf(name)
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
			case 'true_ans':
				tempArray[index] = {
					...tempArray[index],
					true_ans: event,
				}
				if (event.length > 1) {
					tempArray[index] = {
						...tempArray[index],
						type: "multiple",
					}
				}
				break;
			case 'explain':
				tempArray[index] = {
					...tempArray[index],
					explain: event.target.value,
				}
				break;
			default:
				tempArray[index].options[option_index].value = event.target.value
				break;
		}
		return setQuestions(tempArray)
	}
	const onBlur = (index, name, event) => {
		props.getQuestion(questions)
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
			<Form.Item label="Multiple-choice Question" name={['question', index, 'question']}>
				<Row >
					<Col span={20} >
						<TextArea onChange={(event) => onChange(index, 'question', event)} value={item.question} onBlur={(event) => onBlur(index, 'question', event)} />
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
			{item.options.map((option, _index) => {
				return <Form.Item key={option.id} label={option.label} name={[`${option.label}`, _index, `${option.label}`]} >
					<Row >
						<Col span={20} >
							<TextArea onChange={(event) => onChange(index, `${option.label}`, event)} value={option.value} onBlur={(event) => onBlur(index, 'value', event)} />
						</Col>
						<Col span={1} offset={1} onClick={() => { delOption(index, _index) }}>
							{item.options.length > 2 && option.id > 1 && <span className='delete-option'><MinusCircleOutlined /></span>}
						</Col>
						<Col span={1} offset={1} onClick={() => { addOption(index, _index) }}>
							{item.options.length - 1 === option.id && item.options.length !== option_array.length && <span className='add-option'><PlusCircleOutlined /></span>}
						</Col>
					</Row>
				</Form.Item>
			})}
			<Form.Item
				label="Mark"
				name={['value', index, 'value']}
				rules={[{
					pattern:
						/^\d+(.\d{1,2})?$/,
					message: "Please input valid mark!",
					trigger: "blur",
				}]} >
				<Row >
					<Col span={20} >
						<Input onChange={(event) => onChange(index, 'value', event)} value={item.value} onBlur={(event) => onBlur(index, 'value', event)} />
					</Col>
				</Row>
			</Form.Item>
			<Form.Item label="Right Answer" name={['true_ans', index, 'true_ans']}>
				<Row >
					<Col span={20} >
						<Select
							mode="multiple"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							options={availableOpt(index)}
							onChange={(event) => onChange(index, 'true_ans', event)}
							onBlur={(event) => onBlur(index, 'true_ans', event)}
							value={item.true_ans} />
					</Col>
				</Row>
			</Form.Item>
			<Form.Item label="Explanation" name={['explain', index, 'explain']} >
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
					{quizid === "new" && <Button type="primary" onClick={add}>Add Multiple-choice Question</Button>}
				</Form.Item>
			</Form>
		</Col>
	</Row>
}
export default QuizForm