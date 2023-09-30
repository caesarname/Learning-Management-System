import { Box } from "@mui/system";
import { useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Assignment } from "../component/assignment";
import { StudentAssignment } from "../component/studentAssignment";
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

export const AssignmentPage = () => {
  let { id: courseid } = useParams();
  var flagobj = {};
  flagobj.flag = true;

  const role = localStorage.getItem("role");
  console.log(role);
  if (role === "teacher") {
    flagobj.flag = false;
    console.log(role);
  }

  return (
    <Box>
      <Navbar />
      <Stack direction="row" spacing={5}>
        <Leftbar courseid={courseid} />
        <div className="container">
          <div className="col-8">
            <h1>Course ID: {`${courseid}`} Course Assignment</h1>
            {flagobj.flag ? (
              <StudentAssignment course_id={courseid} />
            ) : (
              <Assignment course_id={courseid} />
            )}
          </div>
        </div>
      </Stack>
    </Box>
  );
};
//{ flagobj.flag ? <Materials course_id={courseid}/> : <StudentMaterials course_id={courseid}/>}
