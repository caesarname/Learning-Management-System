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

import { Modal, Button, Form } from "@mui/material";
import { DataThresholdingOutlined } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { Container } from "@mui/system";

//import { Modal, Form } from 'react-bootstrap';

const cookies = new Cookies();

export class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      username: "",
      password: "",

      pdfurl: "",
      material_type: "",
      material_imporatance: "",
      material_name: "",
      material_path: "",
      course_id: "",
      course_material_tree: [],
    };

    const n = this.props.course_id;
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/material/material_tree/",
      data: {
        course_id: n,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      console.log(res.data);
      this.setState({
        course_material_tree: res.data.file_tree,
      });
    });
  }
  handleShow = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic here
    this.handleClose();
  };

  render() {
    const handleView = (filetype, fileid) => {
      axios({
        url: "http://129.226.223.80:8000/api/material/view_pdf/",
        method: "post",
        data: {
          file_id: fileid,
        },
        responseType: "blob",
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        const url = URL.createObjectURL(res.data);
        this.setState({
          pdfurl: url,
        });
      });
    };

    const handleDownload = (fileid, filename) => {
      axios({
        url: "http://129.226.223.80:8000/api/material/download_file/",
        method: "post",
        responseType: "blob",
        data: {
          file_id: fileid,
        },
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        console.log(res.data);
      });
    };

    const handleDelete = (fileid) => {
      axios({
        url: "http://129.226.223.80:8000/api/material/delete_file/",
        method: "post",
        data: {
          file_id: fileid,
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
                  <TableCell>Week</TableCell>
                  <TableCell align="center">Filename</TableCell>
                  <TableCell align="center">Importance</TableCell>
                  <TableCell align="center">FileId</TableCell>
                  <TableCell align="center">Filetype</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.course_material_tree.map((row) => (
                  <TableRow
                    key={row.file_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.file_week}
                    </TableCell>
                    <TableCell align="center">{row.file_name}</TableCell>
                    <TableCell align="center">{row.file_importance}</TableCell>
                    <TableCell align="center">{row.file_id}</TableCell>
                    <TableCell align="center">{row.file_type}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => handleView(row.file_type, row.file_id)}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          handleDownload(row.file_id, row.file_name)
                        }
                      >
                        DownLoad
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        href={
                          process.env.PUBLIC_URL +
                          `/ModifyMaterial/${row.file_id}`
                        }
                      >
                        Modify
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleDelete(row.file_id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            href={
              process.env.PUBLIC_URL + `/UploadMaterial/${this.props.course_id}`
            }
          >
            Add
          </Button>

          <Button variant="primary" onClick={this.handleShow}>
            Open Modal
          </Button>

          <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>

        <iframe
          src={`${this.state.pdfurl}`}
          frameborder="0"
          align="middle"
          height="100%"
          width="100%"
        ></iframe>
      </div>
    );
  }
}
