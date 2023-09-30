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
import { Leftbar } from "../component/leftbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect } from "react";
import { Input } from "antd";

const cookies = new Cookies();

const { Search } = Input;

export const ForumPage = () => {
  let { id: courseid } = useParams();
  const n = courseid;

  var flagobj = {};
  flagobj.flag = true;

  const role = localStorage.getItem("role");

  if (role === "student") {
    flagobj.flag = false;
  }

  const [topicData, setTopicData] = useState([]);

  const onSearch = (value) => {
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/forum/topic_search/",
      data: {
        key_word: value,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      setTopicData(res.data.topic_list);
    });
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/forum/get_topic_list_course/",
      data: {
        courseid: n,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      setTopicData(res.data.topic_list);
    });
  }, [n]);

  const handleDelete = (topicid) => {
    axios({
      url: "http://129.226.223.80:8000/api/forum/del_topic/",
      method: "post",
      data: {
        topicid: topicid,
      },
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      console.log("delete success");
    });
  };

  return (
    <Box>
      <Navbar />
      <Stack direction="row" spacing={5}>
        <Leftbar courseid={courseid} />
        <div style={{ marginTop: "50px" }}>
          <h1>Course ID: {`${courseid}`} Course Forum</h1>
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
          <Container>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Posted By</TableCell>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Classification</TableCell>
                    <TableCell align="center">Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {topicData.map((row) => (
                    <TableRow
                      key={row.topicid}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.creator_name}
                      </TableCell>
                      <TableCell align="center">{row.topic}</TableCell>
                      <TableCell align="center">no Classification</TableCell>
                      <TableCell align="center">{row.created}</TableCell>
                      <TableCell align="center">
                        <Button
                          href={
                            process.env.PUBLIC_URL + `/PostPage/${row.topicid}`
                          }
                        >
                          view post
                        </Button>
                      </TableCell>
                      {flagobj.flag ? (
                        <TableCell align="center">
                          <Button
                            href={
                              process.env.PUBLIC_URL +
                              `/ModifyPost/${row.topicid}`
                            }
                          >
                            modify post
                          </Button>
                        </TableCell>
                      ) : (
                        <h1></h1>
                      )}
                      {flagobj.flag ? (
                        <TableCell align="center">
                          <Button onClick={() => handleDelete(row.topicid)}>
                            delete post
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

            <Button
              variant="contained"
              href={process.env.PUBLIC_URL + `/UploadPost/${courseid}`}
            >
              Post
            </Button>
          </Container>
        </div>
      </Stack>
    </Box>
  );
};
