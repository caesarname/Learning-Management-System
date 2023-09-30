import { Box } from "@mui/system";
import { useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Materials } from "../component/materials";
import { StudentMaterials } from "../component/studentMaterials";
import { OnlineClass } from "./onlineclass";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Leftbar } from "../component/leftbar";

const cookies = new Cookies();

export const MaterialPage = () => {
  let { id: courseid } = useParams();
  var flagobj = {};
  flagobj.flag = true;

  const role = localStorage.getItem("role");

  if (role === "teacher") {
    flagobj.flag = false;
  }

  return (
    <Box>
      <Navbar />
      <Stack direction="row" spacing={5}>
        <Leftbar courseid={courseid} />
        <div className="container">
          <div className="col-8">
            <h1>Course ID: {`${courseid}`} Course Material</h1>
            {flagobj.flag ? (
              <StudentMaterials course_id={courseid} />
            ) : (
              <Materials course_id={courseid} />
            )}
          </div>
        </div>
      </Stack>
    </Box>
  );
};
