import {
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  message,
  Row,
  Col,
  Card,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/resetPassword.css";
import "../style/quiz.css";
import QuizForm from "../component/quizForm";
import OpenQuestion from "../component/openQuestion";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Navbar } from "../component/navbar";
import { Leftbar } from "../component/leftbar";
import { Box, Stack } from "@mui/material";
import { Container } from "@mui/system";
export const AddQuiz = () => {
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
  const { id: courseid, quizid } = useParams();
  const [form] = Form.useForm();
  const history = useNavigate();

  const [mcq, setMcq] = useState([]);
  const [openEnded, setOpenEnded] = useState([]);
  // const [questionsObj, setQuestionsObj] = useState({});

  useEffect(() => {
    if (quizid !== "new") {
      axios({
        url: "http://129.226.223.80:8000/api/quiz/quiz_info/",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: {
          quizid: Number(quizid),
        },
      }).then((res) => {
        const quiz = res.data.quiz;
        form.setFieldValue("title", quiz.name);
        form.setFieldValue("attempt_limits", quiz.try_time);
        form.setFieldValue("time_limits", quiz.time_limit);
        form.setFieldValue("mark", quiz.score);
        const date = dayjs(quiz.due, "YYYY-MM-DD HH:mm:ss");
        form.setFieldValue("due_date", date);
        let mcq_arr = [];
        let open_arr = [];
        for (let i = 0; i < quiz.quiz_file.length; i++) {
          if (quiz.quiz_file[i].type === "open") {
            open_arr.push({
              question: quiz.quiz_file[i].question,
              explain: quiz.quiz_file[i].explain,
              value: quiz.quiz_file[i].value,
            });
          } else {
            mcq_arr.push({
              question: quiz.quiz_file[i].question,
              options: quiz.quiz_file[i].options,
              true_ans: quiz.quiz_file[i].true_ans,
              value: quiz.quiz_file[i].value,
              explain: quiz.quiz_file[i].explain,
            });
          }
        }
        setMcq(mcq_arr);
        setOpenEnded(open_arr);
      });
    }
  }, [quizid, form]);

  const getQuestion = (data) => {
    let question_list = [];
    data.forEach((item) => {
      let options_list = [];
      item.options.forEach((option) => {
        if (option.value) {
          options_list.push({
            [option.label]: option.value,
          });
        }
      });

      question_list.push({
        question: item.question,
        type: item.type,
        options: options_list,
        value: Number(item.value),
        explain: item.explain,
        true_ans: item.true_ans,
      });
    });
    setMcq(question_list);
  };

  const openQuestion = (data) => {
    let question_list = [];
    data.forEach((item) => {
      question_list.push({
        question: item.question,
        type: item.type,
        options: [],
        value: Number(item.value),
        explain: item.explain,
        true_ans: [],
      });
    });
    setOpenEnded(question_list);
  };

  const onSubmit = () => {
    const FormData = form.getFieldsValue();
    const { title, attempt_limits, due_date, time_limits, mark } = FormData;
    // const due_time = due_date.toISOString().slice(0,19) + "Z"
    // const due_time = due_date.format("YYYY-MM-DDTHH:mm:ss")+"Z"
    const due_time = new Date(+due_date + 20 * 3600 * 1000).toISOString();
    mcq.forEach((item) => {
      item.options.forEach((opt) => {
        delete opt.label;
        delete opt.value;
      });
      if (item.true_ans.length > 1) {
        item.type = "multiple";
      } else {
        item.type = "single";
      }
    });
    openEnded.forEach((item) => {
      item.type = "open";
      item.true_ans = [];
      item.options = [];
    });
    const questions = [...mcq, ...openEnded];

    const params = {
      name: title,
      due_time,
      time_limit: time_limits,
      try_time: attempt_limits,
      questions,
      score: mark,
      courseid,
      zid: localStorage.getItem("zid"),
    };

    // modify quiz
    if (quizid !== "new") {
      params.quizid = quizid;
      axios({
        url: "http://129.226.223.80:8000/api/quiz/modify_quiz/",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: params,
      }).then((res) => {
        if (res.data.status === "success") {
          message.success("Update Quiz Successfully!");
          history(`/Quiz/${courseid}`);
        }
      });
    } else {
      // create new quiz
      axios({
        url: "http://129.226.223.80:8000/api/quiz/create_quiz/",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: params,
      }).then((res) => {
        if (res.data.status === "success") {
          message.success("Create New Quiz Successfully!");
          history(`/Quiz/${courseid}`);
        }
      });
    }
  };

  const onFinish = (values) => {};
  return (
    <Box>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2}>
          <Leftbar courseid={courseid} />
          <Box sx={{ py: 8, width: "86%" }}>
            <Container maxWidth="xl">
              {/* <div className='quiz'> */}
              <Card>
                {quizid !== "new" ? (
                  <div className="title">Update Quiz</div>
                ) : (
                  <div className="title">Create New Quiz</div>
                )}
                <Row>
                  <Col>
                    <Form
                      form={form}
                      name="basic"
                      initialValues={{
                        remember: true,
                      }}
                      {...formItemLayout}
                      onFinish={onFinish}
                      autoComplete="off"
                    >
                      <Form.Item
                        name="title"
                        label="Quiz Title"
                        rules={[
                          {
                            required: true,
                            message: "Please input the quiz title!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="due_date"
                        label="Due Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select the due date!",
                          },
                        ]}
                      >
                        <DatePicker showTime />
                      </Form.Item>
                      <Form.Item
                        name="attempt_limits"
                        label="Attempt Limits"
                        rules={[
                          {
                            required: true,
                            message: "Please input the attempt limits!",
                          },
                          {
                            pattern: /^[1-9]\d*$/,
                            message:
                              "The attempt limits must be an integer and at least 1",
                            trigger: "blur",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="time_limits"
                        label="Time Limits"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please input the time limits in minutes! If there is no limit, please enter 0.",
                          },
                          {
                            pattern: /^[0-9]\d*$/,
                            message: "The time limits must be an integer!",
                            trigger: "blur",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="mark"
                        label="Total Mark"
                        rules={[
                          {
                            required: true,
                            message: "Please input the quiz mark!",
                          },
                          {
                            pattern: /^\d+(.\d{1,2})?$/,
                            message: "Please input valid mark!",
                            trigger: "blur",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <QuizForm
                        getQuestion={getQuestion}
                        questions={mcq}
                      ></QuizForm>
                      <OpenQuestion
                        openQuestion={openQuestion}
                        questions={openEnded}
                      ></OpenQuestion>
                      <Form.Item>
                        {quizid !== "new" ? (
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginLeft: 0 }}
                            onClick={onSubmit}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginLeft: 0 }}
                            onClick={onSubmit}
                          >
                            Submit
                          </Button>
                        )}
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Card>
              {/* </div> */}
            </Container>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
