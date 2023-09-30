import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import { DataThresholdingOutlined } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { Container } from "@mui/system";

import { Modal, Form, Col } from "react-bootstrap";

const cookies = new Cookies();

export class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModalModify: false,
      showModalViewByTeacher: false,
      course_id: this.props.course_id,
      course_assignment_tree: [],
      course_assignmentViewByTeacher_tree: [],
      changeMarkAndFeedback: [],
      //changeFeedback:[],
      modify_ass_id: null,
      viewbyteacher_ass_id: null,
      answer_mark_by_teacher: null,
      feedback_by_teacher: null,
    };

    const n = this.props.course_id;

    axios.defaults.withCredentials = true;
    axios({
      //url:"http://129.226.223.80:8000/api/material/assignment_tree/",
      url: "http://129.226.223.80:8000/api/ass/get_ass_list/",
      data: {
        courseid: n,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      this.setState({
        course_assignment_tree: res.data.ass_list,
      });
    });
  }
  handleShow = () => {
    this.setState({ showModal: true });
  };
  handleShowModify = (ass_id) => {
    this.setState({ showModalModify: true });
    this.setState({ modify_ass_id: ass_id });
  };
  handleShowViewByTeacher = () => {
    this.setState({ showModalViewByTeacher: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };
  handleCloseModify = () => {
    this.setState({ showModalModify: false });
  };

  handleCloseViewByTeacher = () => {
    this.setState({ showModalViewByTeacher: false });
  };

  handleChange = (e) => {
    if (e.target.name == "answer_mark_by_teacher") {
      const answerid = e.target.getAttribute("answerid");
      const feedback = e.target.getAttribute("feedback");
      const mark = e.target.value;
      const index = this.state.changeMarkAndFeedback.findIndex(
        (data) => data.answerid === answerid
      );
      if (index === -1) {
        // new data
        this.state.changeMarkAndFeedback.push({
          answerid: e.target.getAttribute("answerid"),
          mark: e.target.value,
          feedback: e.target.getAttribute("feedback"),
        });
      } else {
        // exist data
        this.setState((prevState) => {
          const updatedData = [...prevState.changeMarkAndFeedback];
          updatedData[index].mark = mark;
          return { changeMarkAndFeedback: updatedData };
        });
      }
    } else if (e.target.name == "feedback_by_teacher") {
      const answerid = e.target.getAttribute("answerid");
      const mark = e.target.getAttribute("mark");
      const feedback = e.target.value;
      const index = this.state.changeMarkAndFeedback.findIndex(
        (data) => data.answerid === answerid
      );
      if (index === -1) {
        // new data
        this.state.changeMarkAndFeedback.push({
          answerid: e.target.getAttribute("answerid"),
          feedback: e.target.value,
          mark: e.target.getAttribute("mark"),
        });
      } else {
        // exist data
        this.setState((prevState) => {
          const updatedData = [...prevState.changeMarkAndFeedback];
          updatedData[index].feedback = feedback;
          return { changeMarkAndFeedback: updatedData };
        });
      }
    } else if (e.target.name == "assignment_file") {
      //console.log(e.target.files[0])
      this.setState({ [e.target.name]: event.target.files[0] });
    } else this.setState({ [e.target.name]: e.target.value });
  };
  /*
        try {
            axios({
                url: "http://129.226.223.80:8000/api/ass/create_ass/",
                //url: "http://127.0.0.1:8000/api/user/loginback/",
                withCredentials: true,
                method: "post",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                data:{
                "name":this.state.assignment_name,
                "due": this.state.due,
                "score":this.state.score,
                "courseid": this.state.course_id,
                "file": this.state.assignment_file
                }
            }).then((res) => {
                console.log('success')
            })
        } catch(error) {
            console.log(error);
        }
*/
  handleSubmit = (e) => {
    //alert(e)
    //console(e)
    //e.preventDefault();
    // handle form submission logic here
    //this.handleClose();
    const _formData = new FormData();
    _formData.append("name", this.state.assignment_name);
    _formData.append("due", this.state.due);
    _formData.append("score", this.state.score);
    _formData.append("courseid", this.state.course_id);
    _formData.append(
      "file",
      this.state.assignment_file,
      this.state.assignment_file.name
    );
    try {
      axios.defaults.withCredentials = true;
      axios
        .post("http://129.226.223.80:8000/api/ass/create_ass/", _formData, {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": cookies.get("csrftoken"),
        })
        .then((res) => {
          console.log("success");
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmitModifyStudentAnswerByTeacher = (e) => {
    //alert(e)
    //console.log(this.state.changeMark)
    //e.preventDefault();
    // handle form submission logic here
    //this.handleClose();
    //const _formData = new FormData();
    //    _formData.append('changeMarkAndFeedback', this.state.changeMarkAndFeedback);
    //_formData.append('changeFeedback', this.state.changeFeedback);
    //for (let entry of _formData.entries()) {
    //console.log(entry[0] + ': ' + entry[1]);
    //}
    for (let i = 0; i < this.state.changeMarkAndFeedback.length; i++) {
      //console.log(this.state.changeMarkAndFeedback[i]["answerid"])
      //const _formData = new FormData();
      //    _formData.append('answerid', this.state.changeMarkAndFeedback[i]["answerid"]);
      //    _formData.append('mark', this.state.changeMarkAndFeedback[i]["mark"]);
      //   _formData.append('feedback', this.state.changeMarkAndFeedback[i]["feedback"]);
      //   try {
      //       axios.defaults.withCredentials = true;
      //       axios.post('http://129.226.223.80:8000/api/ass/mark_answer/', _formData, {
      //          'Content-Type': 'multipart/form-data',
      //          'X-CSRFToken': cookies.get('csrftoken')
      //      }).then((res) => {
      //          console.log('success')
      //      })
      //  } catch(error) {
      //      console.log(error);
      //  }

      axios({
        url: "http://129.226.223.80:8000/api/ass/mark_answer/",
        method: "post",
        data: {
          answerid: this.state.changeMarkAndFeedback[i]["answerid"],
          mark: this.state.changeMarkAndFeedback[i]["mark"],
          feedback: this.state.changeMarkAndFeedback[i]["feedback"],
        },
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        console.log("success");
      });
    }
  };

  handleSubmitModify = (e) => {
    //alert(e)
    //e.preventDefault();
    // handle form submission logic here
    //this.handleClose();
    const _formData = new FormData();
    _formData.append("assid", this.state.modify_ass_id);
    _formData.append("name", this.state.assignment_name);
    _formData.append("due", this.state.due);
    _formData.append("score", this.state.score);
    _formData.append("courseid", this.state.course_id);
    _formData.append(
      "file",
      this.state.assignment_file,
      this.state.assignment_file.name
    );

    //for (let entry of _formData.entries()) {
    //console.log(entry[0] + ': ' + entry[1]);
    //}
    try {
      axios.defaults.withCredentials = true;
      axios
        .post("http://129.226.223.80:8000/api/ass/modify_ass/", _formData, {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": cookies.get("csrftoken"),
        })
        .then((res) => {
          console.log("success");
        });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const handleView = (ass_id) => {
      this.handleShowViewByTeacher();
      this.setState({ viewbyteacher_ass_id: ass_id });

      axios({
        url: "http://129.226.223.80:8000/api/ass/get_answer_list_teacher/",
        data: {
          assid: ass_id,
        },
        method: "post",
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        this.setState({
          course_assignmentViewByTeacher_tree: res.data.answer_list,
        });
      });
    };

    const handleDownload = (ass_id) => {
      axios({
        url: "http://129.226.223.80:8000/api/ass/get_ass_file/",
        method: "post",
        responseType: "blob",
        data: {
          assid: ass_id,
        },
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "downloadfile.pdf");
        document.body.appendChild(link);
        link.click();
      });
    };

    const handleDownloadAnswerByTeacher = (answerid) => {
      axios({
        //url:"//http://129.226.223.80:8000/api/ass/download_answer/",
        url: "http://129.226.223.80:8000/api/ass/download_answer/",
        method: "post",
        responseType: "blob",
        data: {
          answerid: answerid,
        },
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "downloadfile.pdf");
        document.body.appendChild(link);
        link.click();
      });
    };

    const handleDelete = (ass_id) => {
      axios({
        //url:"http://129.226.223.80:8000/api/ass/del_ass/",
        url: "http://129.226.223.80:8000/api/ass/del_ass/",
        method: "post",
        data: {
          assid: ass_id,
        },
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        console.log("delete success");
      });
    };

    return (
      <div style={{ marginTop: "50px" }}>
        <Container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Assignment Id</TableCell>
                  <TableCell align="center">Assignment Name</TableCell>
                  <TableCell align="center">Due</TableCell>
                  <TableCell align="center">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.course_assignment_tree.map((row) => (
                  <TableRow
                    key={row.assid}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.assid}</TableCell>
                    <TableCell align="center">{row.assname}</TableCell>
                    <TableCell align="center">{row.due}</TableCell>
                    <TableCell align="center">{row.score}</TableCell>

                    <TableCell align="center">
                      <Button onClick={() => handleView(row.assid)}>
                        View Student Answer
                      </Button>
                    </TableCell>

                    <TableCell align="center">
                      <Button onClick={() => handleDownload(row.assid)}>
                        DownLoad
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={() => this.handleShowModify(row.assid)}>
                        Modify
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleDelete(row.assid)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Button variant="contained" onClick={this.handleShow}>
          add
        </Button>

        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit} name="">
              <Form.Group controlId="course_id">
                <Form.Label>Course ID</Form.Label>
                <Form.Control
                  type="text"
                  name="course_id"
                  value={this.props.course_id}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="assignment_name">
                <Form.Label>Assignment Name</Form.Label>
                <Form.Control
                  type="text"
                  name="assignment_name"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="score">
                <Form.Label>Score</Form.Label>
                <Form.Control
                  type="text"
                  name="score"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="due">
                <Form.Label>Due</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="due"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="assignment_file">
                <Form.Label>Assignment File</Form.Label>
                <Form.Control
                  type="file"
                  name="assignment_file"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showModalModify}
          onHide={this.handleCloseModify}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modify Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmitModify} name="">
              <Form.Group controlId="course_id">
                <Form.Label>Course ID</Form.Label>
                <Form.Control
                  type="text"
                  name="course_id"
                  value={this.props.course_id}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="assignment_name">
                <Form.Label>Assignment Name</Form.Label>
                <Form.Control
                  type="text"
                  name="assignment_name"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="score">
                <Form.Label>Score</Form.Label>
                <Form.Control
                  type="text"
                  name="score"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="due">
                <Form.Label>Due</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="due"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="assignment_file">
                <Form.Label>Assignment File</Form.Label>
                <Form.Control
                  type="file"
                  name="assignment_file"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showModalViewByTeacher}
          onHide={this.handleCloseViewByTeacher}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>View Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={this.handleSubmitModifyStudentAnswerByTeacher}
              name=""
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Answer Id</TableCell>

                      <TableCell align="center">Assignment Name</TableCell>
                      <TableCell align="center">Uploaded Time</TableCell>

                      <TableCell align="center">Due Time</TableCell>
                      <TableCell align="center">File</TableCell>
                      <TableCell align="center">Mark</TableCell>
                      <TableCell align="center">Feedback</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.course_assignmentViewByTeacher_tree.map(
                      (row) => (
                        <TableRow
                          key={row.answerid}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{row.answerid}</TableCell>

                          <TableCell align="center">{row.ass_name}</TableCell>

                          <TableCell align="center">
                            {row.uploaded_time}
                          </TableCell>

                          <TableCell align="center">{row.due_time}</TableCell>

                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                handleDownloadAnswerByTeacher(row.answerid)
                              }
                            >
                              DownLoad
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Form.Group controlId="mark">
                              <Form.Label></Form.Label>

                              <Form.Control
                                type="text"
                                name="answer_mark_by_teacher"
                                answerid={row.answerid}
                                feedback={row.feedback}
                                defaultValue={row.mark}
                                onChange={this.handleChange}
                                required
                              />
                            </Form.Group>
                          </TableCell>
                          <TableCell align="center">
                            <Form.Group controlId="feedback">
                              <Form.Label></Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                name="feedback_by_teacher"
                                answerid={row.answerid}
                                mark={row.mark}
                                defaultValue={row.feedback}
                                onChange={this.handleChange}
                                required
                              />
                            </Form.Group>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
