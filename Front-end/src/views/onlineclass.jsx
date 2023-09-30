import Head from "next/head";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { CompanyCard } from "./companies/company-card";
import { TeacherCard } from "./companies/teacher-card";
import { CompaniesSearch } from "./companies/companies-search";
import { Navbar } from "../component/navbar";
import { Leftbar } from "../component/leftbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const cookies = new Cookies();

export const OnlineClass = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineClass, setOnlineClass] = useState([]);

  let { id: courseid } = useParams();
  const [showPile, setShowPile] = useState(false);
  const getShowProfile = (isShow) => {
    console.log(isShow);
    setShowPile(isShow);
  };

  var flagobj = {};
  flagobj.flag = true;
  const role = localStorage.getItem("role");

  if (role === "student") {
    flagobj.flag = false;
  }

  useEffect(() => {
    axios({
      url: "http://129.226.223.80:8000/api/material/class_list/",
      data: {
        courseid: courseid,
      },
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    })
      .then((response) => {
        const newClasses = response.data.class_list.map((course) => ({
          classid: course.classid,
          class_time: course.class_time,
          location: course.location,
          teacher_id: course.teacher_id,
          teacher_name: course.teacher_name,
          link: course.link,
        }));
        setOnlineClass(newClasses);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [courseid]);

  const filteredClass = onlineClass.filter(
    (course) =>
      course.location.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
      course.teacher_name.toLowerCase().indexOf(searchQuery.toLowerCase()) !==
        -1 ||
      course.class_time.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
  );

  if (flagobj.flag) {
    return (
      <>
        <Head>
          <title>onlineClass</title>
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
                      <Typography variant="h4">Teachers</Typography>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      ></Stack>
                    </Stack>
                  </Stack>
                  <CompaniesSearch setSearchQuery={setSearchQuery} />
                  <Grid container spacing={3}>
                    {filteredClass.map((company, index) => (
                      <Grid xs={12} md={6} lg={4} key={company.classid}>
                        <TeacherCard company={company} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  ></Box>
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
          <title>onlineClass</title>
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
                      <Typography variant="h4">Sessions</Typography>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      ></Stack>
                    </Stack>
                  </Stack>
                  <CompaniesSearch setSearchQuery={setSearchQuery} />
                  <Grid container spacing={3}>
                    {filteredClass.map((company, index) => (
                      <Grid xs={12} md={6} lg={4} key={company.classid}>
                        <CompanyCard company={company} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  ></Box>
                </Stack>
              </Container>
            </Box>
          </Stack>
        </Box>
      </>
    );
  }
};
