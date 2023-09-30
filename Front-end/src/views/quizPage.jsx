import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Paper,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { CompanyCard } from "./companies/company-card";
import { TeacherCard } from "./companies/teacher-card";
import { CompaniesSearch } from "./companies/companies-search";
import { Navbar } from "../component/navbar";
import { Leftbar } from "../component/leftbar";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@mui/material";
import dayjs from "dayjs";
import { Materials } from "../component/materials";
import { StudentMaterials } from "../component/studentMaterials";
import axios from "axios";
import Cookies from "universal-cookie";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Outline } from "../component/outline";
import { Modal, Popconfirm, message } from "antd";

const cookies = new Cookies();

export const Quiz = () => {
  const history = useNavigate();
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [ifDel, setIfDel] = useState(0);

  const { id: courseid } = useParams();

  var flagobj = {};
  flagobj.flag = true;
  const role = localStorage.getItem("role");

  if (role === "student") {
    flagobj.flag = false;
  }

  useEffect(() => {
    axios({
      url: "http://129.226.223.80:8000/api/quiz/get_quiz_list/",
      data: {
        courseid,
      },
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    })
      .then((response) => {
        const newQuiz = response.data.quizlist.map((quiz) => ({
          quizid: quiz.quizid,
          quiz_title: quiz.name,
          due_time: quiz.due,
          time_limit: quiz.time_limit,
          attempt_limits: quiz.try_time,
          quiz_mark: quiz.score,
          created_time: quiz.created,
          creator_name: quiz.creator_name,
          creator_id: quiz.creator_id,
        }));
        setQuiz(newQuiz);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ifDel, courseid]);

  const showModal1 = () => {
    setIsModal1Open(true);
  };

  const handleOk1 = () => {
    setIsModal1Open(false);
  };

  const attemptQuiz = (item) => {
    const { quizid, attempt_limits, time_limit, due_time } = item;
    const currentTime = new Date(+new Date() + 10 * 3600 * 1000).toISOString();
    if (due_time < currentTime) {
      showModal1();
    } else {
      axios({
        url: "http://129.226.223.80:8000/api/quiz/get_quiz_answer_student/",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: {
          zid: localStorage.getItem("zid"),
          quizid,
        },
      }).then((res) => {
        if (res.data.tried) {
          const tried_time = Number(res.data.tried);
          if (tried_time >= attempt_limits) {
            showModal3();
          } else {
            history(
              `/AttemptQuiz/${courseid}/${quizid}?try_time=${tried_time}&time_limit=${time_limit}`
            );
          }
        } else {
          history(
            `/AttemptQuiz/${courseid}/${quizid}?try_time=0&time_limit=${time_limit}`
          );
        }
      });
    }
  };

  const getFeedback = (item) => {
    const { quizid, try_time, time_limit } = item;
    axios({
      url: "http://129.226.223.80:8000/api/quiz/get_quiz_answer_student/",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        zid: localStorage.getItem("zid"),
        quizid,
      },
    }).then((res) => {
      if (res.data.status === "not_tried") {
        showModal2();
      } else {
        const tried_time = Number(res.data.tried);
        history(`/QuizFeedback/${courseid}/${quizid}?try_time=${tried_time}`);
      }
    });
  };
  const showModal2 = () => {
    setIsModal2Open(true);
  };

  const handleOk2 = () => {
    setIsModal2Open(false);
  };

  const showModal3 = () => {
    setIsModal3Open(true);
  };

  const handleOk3 = () => {
    setIsModal3Open(false);
  };

  const cancel = (e) => {
    message.error("Cancel");
  };

  const confirm = (item) => {
    const { quizid } = item;
    axios({
      url: "http://129.226.223.80:8000/api/quiz/del_quiz/",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        quizid,
      },
    }).then((res) => {
      setIfDel(ifDel + 1);
      message.success("Delete Successfully!");
    });
  };

  const getStudentinfo = (item) => {
    const { quizid } = item;
    history(`/StudentQuiz/${courseid}/${quizid}`);
  };

  if (flagobj.flag) {
    return (
      <>
        <Head>
          <title>Quiz</title>
        </Head>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <Leftbar courseid={courseid} />
            <Box sx={{ py: 8, width: "86%" }}>
              <Container maxWidth="xl">
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                  >
                    <Stack spacing={1}>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      ></Stack>
                    </Stack>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid xs={8}>
                      <div className="link">
                        <Link
                          to={
                            process.env.PUBLIC_URL + `/AddQuiz/${courseid}/new`
                          }
                        >
                          <Button variant="contained">Add New Quiz</Button>
                        </Link>
                      </div>
                    </Grid>
                  </Grid>
                  <Card variant="outlined">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Quiz</TableCell>
                            <TableCell>Due Time</TableCell>
                            <TableCell>Attempt Limit</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quiz.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {item.quiz_title}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.due_time.slice(0, 19).replace("T", " ")}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.attempt_limits}
                              </TableCell>
                              <TableCell align="left">
                                <Grid container spacing={2}>
                                  <Grid container spacing={1}>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        history(
                                          `/addQuiz/${courseid}/${item.quizid}`
                                        );
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </Grid>
                                  <Grid container spacing={1}>
                                    <Popconfirm
                                      placement="top"
                                      title={"Do you want to delete this quiz?"}
                                      onCancel={cancel}
                                      onConfirm={() => {
                                        confirm(item);
                                      }}
                                      okText="yes"
                                      cancelText="no"
                                    >
                                      <Button variant="contained">
                                        Delete
                                      </Button>
                                    </Popconfirm>
                                  </Grid>
                                  <Grid container spacing={1}>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        getStudentinfo(item);
                                      }}
                                    >
                                      Give Feedback
                                    </Button>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>
                </Stack>
              </Container>
            </Box>
          </Stack>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Quiz</title>
        </Head>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <Leftbar courseid={courseid} />
            <Box sx={{ py: 8, width: "86%" }}>
              <Container maxWidth="xl">
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                  >
                    <Stack spacing={1}>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      ></Stack>
                    </Stack>
                  </Stack>
                  <Card variant="outlined">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Quiz</TableCell>
                            <TableCell>Due Time</TableCell>
                            <TableCell>Attempt Limit</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quiz.map((item) => (
                            <TableRow
                              key={item.quizid}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {item.quiz_title}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.due_time.slice(0, 19).replace("T", " ")}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.attempt_limits}
                              </TableCell>
                              <TableCell align="left">
                                <Grid container spacing={2}>
                                  <Grid container spacing={1}>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        attemptQuiz(item);
                                      }}
                                    >
                                      Attempt
                                    </Button>
                                  </Grid>
                                  <Grid container spacing={1}>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        getFeedback(item);
                                      }}
                                    >
                                      Feedback
                                    </Button>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>
                </Stack>
              </Container>
            </Box>
          </Stack>
        </Box>
        <Modal
          title="Sorry!"
          open={isModal1Open}
          onOk={handleOk1}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p>The quiz is overdue!</p>
        </Modal>
        <Modal
          title="Sorry!"
          open={isModal2Open}
          onOk={handleOk2}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p>You haven't taken the quiz yet. Please attempt the quiz first!</p>
        </Modal>
        <Modal
          title="Sorry!"
          open={isModal3Open}
          onOk={handleOk3}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p>
            You have reached the attempt limits. You can no longer take the
            quiz!!
          </p>
        </Modal>
      </>
    );
  }
};
