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

const cookies = new Cookies();

export class StudentMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      this.setState({
        course_material_tree: res.data.file_tree,
      });
    });
  }

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <div>
          <iframe
            src={`${this.state.pdfurl}`}
            frameborder="0"
            align="middle"
            height="500"
            width="500"
          ></iframe>
        </div>
      </div>
    );
  }
}
