import React, { useState, useEffect } from 'react'
import { Form, Radio, Button, Row, Col, Space, message, Card, Checkbox } from 'antd'
import { useParams, useLocation } from "react-router-dom";
import '../style/quiz.css';
import axios from 'axios';
import { useMediaQuery } from '@mui/material';
import { CheckBox, FunctionsSharp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'
import CountDownWapper from '../component/countDown'
import TextArea from 'antd/es/input/TextArea';
import { Navbar } from "../component/navbar";
import { Leftbar } from "../component/leftbar";
import { Box, Container, Stack } from "@mui/material";
import { string } from 'prop-types';
export const AttemptQuiz = () => {
  const { courseid, quizid } = useParams();
  const [questions, setQuestions] = useState([])

  const [student, setStudent] = useState([])
  const [tried, setTried] = useState(1)
  const [timeLimit, setTimeLimit] = useState(0)
  const { search } = useLocation();

  const history = useNavigate();

  const getQueryParam = (key) => {
    if (!key) {
      return false;
    }
    let value = '';
    let paramStr = window.location.search ? window.location.search.substr(1) : '';
    if (paramStr) {
      paramStr.split('&').forEach(function (param) {
        let arr = param.split('=');
        if (arr[0] === key) {
          value = arr[1];
        }
      });
    }
    return value;
  }

  useEffect(() => {
    setTimeLimit(Number(getQueryParam('time_limit')))
  }, []);

  useEffect(() => {
    axios({
      url: "http://129.226.223.80:8000/api/quiz/get_quiz_questions/",
      method: "post",
      headers: { 'Content-Type': 'application/json' },
      data: {
        quizid: quizid,
      }
    }).then(res => {
      const { questions, time_limit } = res.data;
      const arr = []
      questions.forEach((res) => {
        res.options.forEach((v) => {
          v.value = Object.keys(v)[0]
          v.label = Object.values(v)[0]
        })
      })
      setQuestions(questions)
    })
  }, [quizid])

  const [form] = Form.useForm()
  const submitForm = () => {
    form.validateFields()
      .then(values => {
        console.log("values", values)
        const arr = []
        for (let i = 0; i < values.answer.length; i++) {
          if (typeof values.answer[i] === "string") {
            arr.push([values.answer[i]])
          } else {
            arr.push(values.answer[i])
          }
        }
        axios({
          url: "http://129.226.223.80:8000/api/quiz/make_answer/",
          method: "post",
          headers: { 'Content-Type': 'application/json' },
          data: {
            quizid: Number(quizid),
            answer: arr,
            tried: Number(getQueryParam('try_time')) + 1,
            zid: localStorage.getItem('zid'),
          }
        }).then(res => {
          console.log(res)
          message.success('Submit Successfully!');
          history(`/Quiz/${courseid}`)
        })
      })
  }
  const onChange = (index, name, event) => {
    let tempArray = [...questions];
    return setQuestions(tempArray)
  }
  const [time, setTime] = useState(0)
  // get time limit
  const getTime = (time) => {
    if (time === 0) {
      submitForm()
    }
  }
  const questionsItems = questions.map((item, index) => {
    if (item.type === "single") {
      return <Row key={item.question}>
        <Col span={20}>
          <Form.Item label={`${index + 1}, ${item.question}`} name={['answer', index]}>
            <Radio.Group onChange={(event) => onChange(index, 'answer', event)} >
              <Space direction="vertical">
                {item.options.map((opt) => {
                  return <Radio value={opt.value} key={opt.value}>{opt.value} {opt.label}</Radio>
                })}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    } else if (item.type === "multiple") {
      return <Row key={item.question}>
        <Col span={20}>
          <Form.Item label={`${index + 1}, ${item.question}`} name={['answer', index]}>
            <Checkbox.Group onChange={(event) => onChange(index, 'answer', event)} >
              <Space direction="vertical">
                {item.options.map((opt) => {
                  return <Checkbox value={opt.value} key={opt.value}>{opt.value} {opt.label}</Checkbox>
                })}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>
    }
    else {
      return <Row key={item.question}>
        <Col span={20}>
          <Form.Item label={`${index + 1}, ${item.question}`} name={['answer', index]}>
            <TextArea onChange={(event) => onChange(index, 'answer', event)} />
          </Form.Item>
        </Col>
      </Row>
    }
  })
  return (<Box>
    <Navbar />
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2}>
        <Leftbar courseid={courseid} />
        <Box sx={{ py: 8, width: "86%" }}>
          <Container maxWidth="xl">
            <div className='attempt'>
              {timeLimit !== 0 && <div className='attempt-title'>Time remaining: <span className="lastTime">
                <CountDownWapper
                  expire={timeLimit}
                  showDomStruct={true}
                  getTime={getTime}
                />
              </span>
              </div>}
              {/* <Card > */}
              <Col>
                <Form name="question_form" form={form} layout={'vertical'} onFinish={submitForm} initialValues={{ questions: questions }}>
                  <Form.Item >
                    {questionsItems}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={submitForm}>Submit</Button>
                  </Form.Item>
                </Form>
              </Col>
              {/* </Card> */}
            </div>
          </Container>
        </Box>
      </Stack>
    </Box>
  </Box>)
}