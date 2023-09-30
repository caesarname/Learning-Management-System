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

export class StudentAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModalMakeAnserByStudent: false,
      showModalViewByStudent: false,
      course_id: this.props.course_id,
      course_assignment_tree: [],
      course_assignmentViewByStudent_tree: [],
      modify_ass_id: null,
    };

    const n = this.props.course_id;

    axios.defaults.withCredentials = true;
    axios({
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

  handleShowMakeAnswerByStudent = (ass_id) => {
    this.setState({ showModalMakeAnserByStudent: true });
    this.setState({ modify_ass_id: ass_id });
  };
  handleShowViewByStudent = () => {
    this.setState({ showModalViewByStudent: true });
  };

  handleCloseMakeAnserByStudent = () => {
    this.setState({ showModalMakeAnserByStudent: false });
  };

  handleCloseViewByStudent = () => {
    this.setState({ showModalViewByStudent: false });
  };

  handleChange = (e) => {
    if (e.target.name == "assignment_file") {
      //console.log(e.target.files[0])
      this.setState({ [e.target.name]: event.target.files[0] });
    } else this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmitMakeAnserByStudent = (e) => {
    const zid = localStorage.getItem("zid");

    const assignment_id = this.state.modify_ass_id;
    const file = this.state.assignment_file;
    //e.preventDefault();
    const _formData = new FormData();
    _formData.append("assid", this.state.modify_ass_id);
    _formData.append("zid", zid);

    _formData.append(
      "file",
      this.state.assignment_file,
      this.state.assignment_file.name
    );
    //console.log(1,1,1)
    //e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      axios
        .post("http://129.226.223.80:8000/api/ass/make_unswer/", _formData, {
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
      this.handleShowViewByStudent();

      const zid = localStorage.getItem("zid");
      axios({
        url: "http://129.226.223.80:8000/api/ass/get_answer_list_student/",
        data: {
          zid: zid,
          assid: ass_id,
        },
        method: "post",
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        this.setState({
          course_assignmentViewByStudent_tree: res.data.answer_list,
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

    const handleDownloadAnswerByStudent = (answerid) => {
      axios({
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

    const handleDeleteAnswer = (answerid) => {
      axios({
        url: "http://129.226.223.80:8000/api/ass/del_answer/",
        method: "post",
        data: {
          answerid: answerid,
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
                        View My Answer
                      </Button>
                    </TableCell>

                    <TableCell align="center">
                      <Button onClick={() => handleDownload(row.assid)}>
                        DownLoad
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          this.handleShowMakeAnswerByStudent(row.assid)
                        }
                      >
                        Make Answer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Modal
          show={this.state.showModalMakeAnserByStudent}
          onHide={this.handleCloseMakeAnserByStudent}
        >
          <Modal.Header closeButton>
            <Modal.Title>Make Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmitMakeAnserByStudent} name="">
              <Form.Group controlId="course_id">
                <Form.Label>Course ID</Form.Label>
                <Form.Control
                  type="text"
                  name="course_id"
                  value={this.props.course_id}
                  readOnly
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
          show={this.state.showModalViewByStudent}
          onHide={this.handleCloseViewByStudent}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>View Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                    <TableCell align="center">Delete Answer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.course_assignmentViewByStudent_tree.map((row) => (
                    <TableRow
                      key={row.answerid}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row.answerid}</TableCell>
                      <TableCell align="center">{row.ass_name}</TableCell>
                      <TableCell align="center">{row.uploaded_time}</TableCell>
                      <TableCell align="center">{row.due_time}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() =>
                            handleDownloadAnswerByStudent(row.answerid)
                          }
                        >
                          DownLoad
                        </Button>
                      </TableCell>
                      <TableCell align="center">{row.mark}</TableCell>
                      <TableCell align="center">{row.feedback}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleDeleteAnswer(row.answerid)}
                        >
                          Delete Answer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
