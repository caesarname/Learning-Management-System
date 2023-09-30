import Head from "next/head";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Navbar } from "../component/navbar";
import { Notificationbar } from "../component/notificationbar";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const BroadcastPage = () => {
  var flagobj = {};
  flagobj.flag = true;
  const role = localStorage.getItem("role");
  const test = localStorage.getItem("readState");

  if (role === "student") {
    flagobj.flag = false;
  }

  const [to, setTo] = useState("");
  const [body, setBody] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [broadcastList, setBroadcastList] = useState([]);
  const [isNotifying, setIsNotifying] = useState(false);
  const initialReadState = localStorage.getItem("readState")
    ? JSON.parse(localStorage.getItem("readState"))
    : {};

  const [readState, setReadState] = useState(initialReadState);
  const [expandedState, setExpandedState] = useState(
    broadcastList.map((broadcast) => false)
  );
  const trueCount = Object.values(readState).filter(
    (val) => val === false
  ).length;
  useEffect(() => {
    localStorage.setItem("readState", JSON.stringify(readState));
    localStorage.setItem("trueCountnew", trueCount);
    localStorage.setItem("trueCount", trueCount);
  }, [readState, trueCount]);

  const handleExpandClick = (created) => {
    const index = broadcastList.findIndex(
      (broadcast) => broadcast.created === created
    );
    setExpandedState((prev) => {
      prev[index] = !prev[index];
      return [...prev];
    });
    setBroadcastList((prev) => {
      prev[index].read = true;
      return [...prev];
    });
    setReadState((prev) => {
      return {
        ...prev,
        [created]: true,
      };
    });
    if (!readState[created]) {
      const newReadState = { ...readState, [created]: true };
      const newTrueCount = Object.values(newReadState).filter(
        (val) => !val
      ).length;
      localStorage.setItem("trueCount", newTrueCount);
      setReadState(newReadState);
    }
  };

  useEffect(() => {
    const zid = localStorage.getItem("zid");
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/mainpage/",
      data: {
        zid: zid,
      },
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      setCourseList(res.data.course_list);
    });
  }, []);

  const fetchBroadcastList = () => {
    const zid = localStorage.getItem("zid");

    axios({
      url: "http://129.226.223.80:8000/api/broadcast/student_broadcast/",
      data: {
        zid: zid,
      },
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      const formattedBroadcastList = res.data.broadcast_list.map(
        (broadcast) => ({
          ...broadcast,
          read: false,
        })
      );

      setBroadcastList(formattedBroadcastList);
    });
  };
  useEffect(() => {
    fetchBroadcastList();
    const interval = setInterval(fetchBroadcastList, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const readStateCopy = { ...readState };
    broadcastList.forEach((broadcast) => {
      if (readStateCopy[broadcast.created] === undefined) {
        readStateCopy[broadcast.created] = broadcast.read;
      }
    });
    setReadState(readStateCopy);
  }, [broadcastList, readState]);

  useEffect(() => {
    localStorage.setItem("readState", JSON.stringify(readState));
  }, [readState]);

  const courseNames = courseList.map((course) => course.course_name);
  const handleUpload = () => {
    const course = courseList.find((c) => c.course_name === to);
    const courseId = course.course_id;
    const zid = localStorage.getItem("zid");

    axios
      .post(
        "http://129.226.223.80:8000/api/broadcast/create_broadcast/",
        {
          zid: zid,
          message: body,
          courseid: courseId,
          is_email: isNotifying,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
          },
        }
      )
      .then((res) => {
        setTo("");
        setBody("");
        setIsNotifying(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (flagobj.flag) {
    return (
      <>
        <Head>
          <title>Compose</title>
        </Head>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <Notificationbar />
            <Box sx={{ py: 8, width: "calc(100% - 320px)" }}>
              <Container maxWidth="xl">
                <Stack spacing={3}>
                  <Typography variant="h6">New Message</Typography>
                  <FormControl fullWidth>
                    <InputLabel id="to-label">To: </InputLabel>
                    <Select
                      labelId="to-label"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      fullWidth
                      MenuProps={{ disableAnimation: true }}
                    >
                      {courseList.map((course) => (
                        <MenuItem
                          key={course.course_id}
                          value={course.course_name}
                        >
                          {course.course_name} /Term {course.course_term}
                          {" /"}
                          {course.course_year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    multiline
                    rows={10}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Checkbox
                      checked={isNotifying}
                      onChange={(e) => setIsNotifying(e.target.checked)}
                    />
                    <Typography variant="body1">
                      Notify students by email
                    </Typography>
                  </Stack>

                  <Button variant="contained" onClick={handleUpload}>
                    Upload
                  </Button>
                </Stack>
              </Container>
            </Box>
            {/* ... */}
          </Stack>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Notifications</title>
        </Head>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <Notificationbar />
            <Box sx={{ py: 8, width: "calc(100% - 320px)" }}>
              <Container maxWidth="xl">
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontSize: "24px" }}>
                    Notifications
                  </Typography>

                  <Box sx={{ border: "1px solid black", p: 2 }}>
                    <Grid container spacing={3} marginTop="-9px">
                      {broadcastList
                        .sort(
                          (a, b) => new Date(b.created) - new Date(a.created)
                        )
                        .map((broadcast, index) => {
                          const read =
                            readState[broadcast.created] || broadcast.read;

                          return (
                            <Grid
                              item
                              key={broadcast.created}
                              xs={12}
                              sx={{
                                border: read
                                  ? "2px solid grey"
                                  : "2px solid rgb(60, 135, 201)",
                                p: 2,
                                marginBottom: "5px",
                                position: "relative",
                              }}
                            >
                              {!read && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "-6px",
                                    right: "-5px",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "red",
                                  }}
                                />
                              )}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  p: 2,
                                }}
                              >
                                <Box>
                                  <Typography variant="h6">
                                    {broadcast.creator}
                                  </Typography>
                                  <Box sx={{ py: 2 }}>
                                    {expandedState[index] ? (
                                      <Typography
                                        variant="body1"
                                        dangerouslySetInnerHTML={{
                                          __html: broadcast.message.replace(
                                            /\n/g,
                                            "<br>"
                                          ),
                                        }}
                                      />
                                    ) : (
                                      <Typography variant="body1">
                                        {broadcast.message.substring(0, 100)}...
                                      </Typography>
                                    )}
                                    <Button
                                      onClick={() =>
                                        handleExpandClick(broadcast.created)
                                      }
                                    >
                                      {expandedState[index]
                                        ? "Hide"
                                        : "Read more"}
                                    </Button>
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="caption">
                                    {new Date(
                                      broadcast.created
                                    ).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Box>
                </Stack>
              </Container>
            </Box>
          </Stack>
        </Box>
      </>
    );
  }
};
