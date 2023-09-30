import { Box, Container } from "@mui/system";
import { useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { OnlineClass } from "./onlineclass";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Input, message } from "antd";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Leftbar } from "../component/leftbar";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect } from "react";

const cookies = new Cookies();

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

export const PostPage = () => {
  let { tid: topicid } = useParams();
  const [postData, setPostData] = useState([]);
  const [replies, setReplies] = useState([]);
  const [currMedal, setCurrMedal] = useState();
  const [currAvatar, setCurrAvatar] = useState();
  const [flag, setFlag] = useState();

  var flagobj = {};
  flagobj.flag = true;

  var zidobj = {};
  zidobj.zid = "";

  const role = localStorage.getItem("role");

  if (role === "student") {
    flagobj.flag = false;
  }

  const [comment, setComment] = useState({
    content: "",
  });

  const handleChange = (event) => {
    setComment({
      ...comment,
      [event.target.name]: event.target.value,
    });
  };

  const commentSubmit = () => {
    if (comment.content === "") {
      message.error("please input comment");
    } else {
      axios.defaults.withCredentials = true;
      axios({
        url: "http://129.226.223.80:8000/api/forum/create_reply/",
        data: {
          zid: localStorage.getItem("zid"),
          topicid: topicid,
          content: comment.content,
        },
        method: "post",
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        console.log(res.data);
      });
    }
  };

  const handleDelete = (replyid) => {
    axios({
      url: "http://129.226.223.80:8000/api/forum/del_reply/",
      method: "post",
      data: {
        replyid: replyid,
      },
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      console.log("delete success");
    });
  };

  useEffect(() => {
    const getImage = async () => {
      axios.defaults.withCredentials = true;
      axios("http://129.226.223.80:8000/api/user/get_images/", {
        method: "post",
        header: { "Content-Type": "application/json" },
        data: { zid: zidobj.zid },
      }).then((res) => {
        if (res.data.set_medal === "") {
          setFlag(false);
        } else {
          setFlag(true);
          setCurrMedal(res.data.set_medal);
          setCurrAvatar(res.data.photo);
        }
      });
    };

    const getTopic = async (topicid) => {
      axios.defaults.withCredentials = true;
      axios({
        url: "http://129.226.223.80:8000/api/forum/get_tpoic_and_reply/",
        data: {
          topicid: topicid,
        },
        method: "post",
        headers: {
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      }).then((res) => {
        setPostData(res.data);
        setReplies(res.data.replies);
        zidobj.zid = res.data.creator_zid;
        getImage();
      });
    };
    getTopic(topicid);
  }, [topicid]);

  return (
    <Box>
      <Navbar />
      <Stack direction="row" spacing={5}>
        <div style={{ marginTop: "50px" }}>
          <h1>Title: {`${postData.title}`}</h1>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={<SmallAvatar src={"http://" + `${currMedal}`} />}
          >
            <Avatar src={"http://" + `${currAvatar}`} />
          </Badge>

          {flagobj.flag ? (
            <h4>
              Created by:
              <Button
                href={
                  process.env.PUBLIC_URL +
                  `/GiveMedalPage/${postData.creator_zid}`
                }
              >
                {`${postData.creator_name}`}
              </Button>
            </h4>
          ) : (
            <h4>Created by: {`${postData.creator_name}`}</h4>
          )}

          <h6>Time: {`${postData.created}`}</h6>
          <h1>Content: </h1>
          <div dangerouslySetInnerHTML={{ __html: postData.content }}></div>

          <div>
            <h1>Comment: </h1>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Commented By</TableCell>
                    <TableCell align="center">content</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {replies.map((row) => (
                    <TableRow
                      key={row.replyid}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.creator_name}
                      </TableCell>
                      <TableCell align="center">{row.content}</TableCell>
                      {flagobj.flag ? (
                        <TableCell align="center">
                          <Button onClick={() => handleDelete(row.replyid)}>
                            Delete
                          </Button>
                        </TableCell>
                      ) : (
                        <h1></h1>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <input
            type="text"
            onChange={handleChange}
            name="content"
            id="content"
            className="form-control"
          />
          <button
            type="button"
            onClick={() => commentSubmit()}
            className="btn btn-primary"
          >
            submit comment
          </button>
        </div>
      </Stack>
    </Box>
  );
};
