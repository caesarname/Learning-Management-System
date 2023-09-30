import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

const cookies = new Cookies();

export class Outline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      course_outline: "",
    };
    //this.state.course_id = this.props.course_id;
    const n = this.props.course_id;
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/material/course_outline/",
      data: {
        course_id: n,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      this.setState({
        course_outline: res.data.html,
      });
    });
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: this.state.course_outline }}
      ></div>
    );
  }
}
