import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { OutlinedInput, InputAdornment, SvgIcon } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

const cookies = new Cookies();

const CourseList = (props) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    course_list: [],
    searchQuery: "",
  });

  const zid = localStorage.getItem("zid");
  axios.defaults.withCredentials = true;

  useEffect(() => {
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
      console.log(res.data.course_list);
      setState((prevState) => ({
        ...prevState,
        course_list: res.data.course_list,
      }));
    });
  }, []);

  const handleClickCoursepage = (row) => {
    console.log("courseid", row.course_id);
    navigate(`/course/${row.course_id}`);
  };

  const handleSearchInputChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      searchQuery: event.target.value,
    }));
  };

  const courseNames = state.course_list.map((course) => course.course_name);
  localStorage.setItem("courseNames", JSON.stringify(courseNames));

  const courseIds = {};
  state.course_list.forEach((course) => {
    courseIds[course.course_name] = course.course_id;
  });
  localStorage.setItem("courseIds", JSON.stringify(courseIds));

  const filteredCourses = state.course_list.filter(
    (course) =>
      course.course_name
        .toLowerCase()
        .indexOf(state.searchQuery.toLowerCase()) !== -1
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <OutlinedInput
          placeholder="Search courses"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon fontSize="small" color="action">
                <SearchOutlined />
              </SvgIcon>
            </InputAdornment>
          }
          value={state.searchQuery}
          onChange={handleSearchInputChange}
        />
      </Box>
      <Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell align="center">Course Number</TableCell>
                <TableCell align="center">Course Year</TableCell>
                <TableCell align="center">Course Term</TableCell>
                <TableCell align="center">Course Id</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((row) => (
                <TableRow
                  key={row.course_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.course_name}
                  </TableCell>
                  <TableCell align="center">{row.course_number}</TableCell>
                  <TableCell align="center">{row.course_year}</TableCell>
                  <TableCell align="center">{row.course_term}</TableCell>
                  <TableCell align="center">{row.course_id}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleClickCoursepage(row)}
                    >
                      Go to course page
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};
export { CourseList };
