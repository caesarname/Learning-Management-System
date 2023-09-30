import React, { useState, useEffect } from "react";
import {
  Form,
  Radio,
  Button,
  Row,
  Col,
  Space,
  message,
  Card,
  Checkbox,
} from "antd";
import { useParams, useLocation } from "react-router-dom";
import "../style/quiz.css";
import axios from "axios";
import { useMediaQuery } from "@mui/material";
import { CheckBox, FunctionsSharp } from "@mui/icons-material";
import { Navbar } from "../component/navbar";
import { Leftbar } from "../component/leftbar";
import { Box, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CountDownWapper from "../component/countDown";
import TextArea from "antd/es/input/TextArea";
import { element, string } from "prop-types";
export const QuizFeedback = () => {
  const { courseid, quizid } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answerObj, setAnswerObj] = useState({});
  const [mark, setMark] = useState([]);
  const [maxMark, setMaxMark] = useState([]);
  const [totalMark, setTotalMark] = useState(0);
  const [quizMark, setQuizMark] = useState(0);
  const [student, setStudent] = useState([]);
  const [tried, setTried] = useState(1);

  const { search } = useLocation();
  const [operator, setOperator] = useState(1);
  const [form] = Form.useForm();
  const history = useNavigate();

  useEffect(() => {
    // get quiz questions, answer and explanation
    axios({
      url: "http://129.226.223.80:8000/api/quiz/get_quiz_questions/",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        quizid: Number(quizid),
      },
    }).then((res) => {
      const { questions } = res.data;
      questions.forEach((res) => {
        res.options.forEach((v) => {
          v.value = Object.keys(v)[0];
          v.label = Object.values(v)[0];
        });
      });
      setQuestions(questions);

      const quiz = res.data.questions;
      let ans_arr = [];
      let exp_arr = [];
      let max_mark = [];
      for (let i = 0; i < quiz.length; i++) {
        ans_arr.push(quiz[i].true_ans);
        exp_arr.push(quiz[i].explain);
        max_mark.push(quiz[i].value);
      }
      setAnswerObj({ true_answer: ans_arr, exp: exp_arr });
      setMaxMark(max_mark);
      const quizMark = max_mark.reduce((sum, value) => {
        return sum + value;
      }, 0);
      setQuizMark(quizMark);
    });

    // get student quiz info: student's answer and mark
    axios({
      url: "http://129.226.223.80:8000/api/quiz/get_quiz_answer_student/",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        quizid: Number(quizid),
        zid: localStorage.getItem("zid"),
      },
    }).then((res) => {
      let answer_arr = [];
      for (let i = 0; i < res.data.answer.length; i++) {
        if (res.data.answer[i].length === 1) {
          answer_arr.push(res.data.answer[i].toString());
        } else {
          answer_arr.push(res.data.answer[i]);
        }
      }
      form.setFieldValue("answer", answer_arr);

      const { auto_mark } = res.data;

      let mark_arr = auto_mark.replace("[", "").replace("]", "").split(",");
      let total_mark = 0;
      for (let i = 0; i < mark_arr.length; i++) {
        mark_arr[i] = Number(mark_arr[i]);
        if (mark_arr[i] === -1) {
          mark_arr[i] = "not marked yet";
        } else {
          total_mark += mark_arr[i];
        }
      }
      setMark(mark_arr);
      setTotalMark(total_mark);
    });
  }, [quizid, form]);

  const handleConfirm = () => {
    history(`/Quiz/${courseid}`);
  };

  const questionsItems = questions.map((item, index) => {
    if (item.type === "single") {
      return (
        <Row key={item.question}>
          <Col span={20}>
            <Form.Item
              label={`${index + 1}, ${item.question}`}
              name={["answer", index]}
            >
              <Radio.Group disabled={true}>
                <Space direction="vertical">
                  {item.options.map((opt) => {
                    return (
                      <Radio value={opt.value} key={opt.value}>
                        {opt.value} {opt.label}
                      </Radio>
                    );
                  })}
                </Space>
              </Radio.Group>
            </Form.Item>
            <Row>
              {" "}
              <strong> Score: </strong> {"\u00A0"}{" "}
              {`${mark[index]} / ${maxMark[index]}`}
            </Row>
            <Row>
              {" "}
              <strong> Right Answer: </strong> {"\u00A0"}{" "}
              {answerObj.true_answer && answerObj.true_answer[index]}
            </Row>
            <Row>
              <strong>Explanation: </strong> {"\u00A0"}{" "}
              {answerObj.exp && answerObj.exp[index]}
            </Row>
          </Col>
        </Row>
      );
    } else if (item.type === "multiple") {
      return (
        <Row key={item.question}>
          <Col span={20}>
            <Form.Item
              label={`${index + 1}, ${item.question}`}
              name={["answer", index]}
            >
              <Checkbox.Group disabled={true}>
                <Space direction="vertical">
                  {item.options.map((opt) => {
                    return (
                      <Checkbox value={opt.value} key={opt.value}>
                        {opt.value} {opt.label}
                      </Checkbox>
                    );
                  })}
                </Space>
              </Checkbox.Group>
            </Form.Item>
            <Row>
              {" "}
              <strong> Score: </strong> {"\u00A0"}{" "}
              {`${mark[index]} / ${maxMark[index]}`}
            </Row>
            <Row>
              {" "}
              <strong> Right Answer: </strong> {"\u00A0"}{" "}
              {answerObj.true_answer && answerObj.true_answer[index]}
            </Row>
            <Row>
              <strong>Explanation: </strong> {"\u00A0"}{" "}
              {answerObj.exp && answerObj.exp[index]}
            </Row>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row key={item.question}>
          <Col span={20}>
            <Form.Item
              label={`${index + 1}, ${item.question}`}
              name={["answer", index]}
            >
              <TextArea disabled={true} />
            </Form.Item>
            <Row>
              {" "}
              <strong> Score: </strong> {"\u00A0"}{" "}
              {`${mark[index]} / ${maxMark[index]}`}
            </Row>
            {mark[index] !== "not marked yet" && (
              <Row>
                {" "}
                <strong> Sample Answer: </strong> {"\u00A0"}{" "}
                {answerObj.exp && answerObj.exp[index]}
              </Row>
            )}
          </Col>
        </Row>
      );
    }
  });
  return (
    <Box>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2}>
          <Leftbar courseid={courseid} />
          <Box sx={{ py: 8, width: "86%" }}>
            <Container maxWidth="xl">
              <div className="attempt">
                {/* <Card > */}
                <Col>
                  <Form
                    name="question_form"
                    form={form}
                    layout={"vertical"}
                    initialValues={{ questions: questions }}
                  >
                    <div className="attempt-title">
                      Total Score: {"\u00A0"} {`${totalMark} / ${quizMark}`}{" "}
                    </div>
                    <Form.Item>{questionsItems}</Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={handleConfirm}>
                        Confirm
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
                {/* </Card> */}
              </div>
            </Container>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
