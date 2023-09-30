import { AppBar, styled, Toolbar, Typography, Box, Stack } from "@mui/material";
import Badge from "@mui/material/Badge";
import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SearchBox } from "../component/searchBox";
import { Navbar } from "../component/navbar";
import { Profile } from "../component/profile";
import { Container } from "@mui/system";
import { Search } from "@mui/icons-material";
import { CourseList } from "../component/courseList";
import { Component } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

export const MainPage = () => {
  const role = localStorage.getItem("role");

  const [broadcastList, setBroadcastList] = useState([]);
  const initialReadState = localStorage.getItem("readState")
    ? JSON.parse(localStorage.getItem("readState"))
    : {};
  const [readState, setReadState] = useState(initialReadState);
  const [expandedState, setExpandedState] = useState(
    broadcastList.map((broadcast) => false)
  );
  const [trueCount, setTrueCount] = useState(0);

  useEffect(() => {
    const newTrueCount = Object.values(readState).filter(
      (val) => val === false
    ).length;
    setTrueCount(newTrueCount);
    localStorage.setItem("trueCount", newTrueCount);
  }, [readState]);
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
    console.log("readState:", readState);
    localStorage.setItem("readState", JSON.stringify(readState));
  }, [readState]);

  return (
    <Box>
      {/* <Navbar getShowProfile={getShowProfile} /> */}
      <Navbar />
      <Container>
        <CourseList />
      </Container>
    </Box>
  );
};
//<SearchBox/>
