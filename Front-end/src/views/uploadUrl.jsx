import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Leftbar } from "../component/leftbar";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { CompanyCard } from "./companies/company-card";
import { TeacherCard } from "./companies/teacher-card";
import { CompaniesSearch } from "./companies/companies-search";
import { Navbar } from "../component/navbar";
import { useParams } from "react-router-dom";

import { Materials } from "../component/materials";
import { StudentMaterials } from "../component/studentMaterials";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Outline } from "../component/outline";

const cookies = new Cookies();

export const UploadUrl = () => {
  const [classUrl, setClassUrl] = useState("");
  const { courseid, classid } = useParams();
  const parsedClassId = parseInt(classid);
  var flagobj = {};
  flagobj.flag = true;
  const role = localStorage.getItem("role");

  if (role === "student") {
    flagobj.flag = false;
  }

  const handleUploadClick = () => {
    try {
      const data = { classid: classid, classUrl: classUrl };

      axios.post(
        "http://129.226.223.80:8000/api/material/set_course_link/",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.get("csrftoken"),
          },
        }
      );

      alert("Data uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload data. Please try again later.");
    }
  };

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
                    {}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="classurl-input"
                      label="Class URL"
                      type="text"
                      size="small"
                      value={classUrl}
                      onChange={(event) => setClassUrl(event.target.value)}
                    />
                    <Button variant="contained" onClick={handleUploadClick}>
                      Upload
                    </Button>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {}
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
