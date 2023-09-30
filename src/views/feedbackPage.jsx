import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    Paper,
    Unstable_Grid2 as Grid,
} from "@mui/material";

import { CompanyCard } from "./companies/company-card";
import { TeacherCard } from "./companies/teacher-card";
import { CompaniesSearch } from "./companies/companies-search";
import { Navbar } from "../component/navbar";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@mui/material";

import { Materials } from "../component/materials";
import { StudentMaterials } from "../component/studentMaterials";
import axios from "axios";
import Cookies from "universal-cookie";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Outline } from "../component/outline";

const cookies = new Cookies();

export const Feedback = () => {
    const history = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [quiz, setQuiz] = useState([]);

    const { courseid, quizid } = useParams();
    const [showPile, setShowPile] = useState(false);
    const getShowProfile = (isShow) => {
        console.log(isShow);
        setShowPile(isShow);
    };

    function createData(name,mark) {
        return { name,mark };
    }

    const rows = [
        createData('Attempt 1',60),
        createData('Attempt 2',88),
        createData('Attempt 3',100)
    ];


    // useEffect(() => {
    //     axios({
    //         url: "http://129.226.223.80:8000/api/quiz/get_quiz_list/",
    //         data: {
    //             courseid,
    //         },
    //         method: "post",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "X-CSRFToken": cookies.get("csrftoken"),
    //         },
    //     })
    //         .then((response) => {
    //             const newQuiz = response.data.quizlist.map((quiz) => ({
    //                 quizid: quiz.quizid,
    //                 quiz_title: quiz.name,
    //                 due_time: quiz.due,
    //                 attempt_limits: quiz.try_time,
    //                 quiz_mark: quiz.score,
    //                 created_time: quiz.created,
    //                 creator_name: quiz.creator_name,
    //                 creator_id: quiz.creator_id
    //             }));
    //             setQuiz(newQuiz);

    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, [quizid]);


    return (
        <>
            <Head>
                <title>Quiz Feedback</title>
            </Head>
            <Navbar />
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={2}>
                    <Box>
                        <List
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                            }}
                        >
                            <ListItem>
                                <Link to={process.env.PUBLIC_URL + `/course/${courseid}`}>
                                    <Button variant="contained" color="success">
                                        Outline
                                    </Button>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link
                                    to={process.env.PUBLIC_URL + `/onlineclass/${courseid}`}
                                >
                                    <Button variant="contained" color="success">
                                        Online Class
                                    </Button>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link
                                    to={process.env.PUBLIC_URL + `/materialPage/${courseid}`}
                                >
                                    <Button variant="contained" color="success">
                                        Material
                                    </Button>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to={process.env.PUBLIC_URL + `/Quiz/${courseid}`}>
                                    <Button variant="contained" color="success">
                                        Quiz
                                    </Button>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to={`#`}>
                                    <Button variant="contained" color="success">
                                        Assignment
                                    </Button>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to={`#`}>
                                    <Button variant="contained" color="success">
                                        Exam
                                    </Button>
                                </Link>
                            </ListItem>
                        </List>
                    </Box>
                    <Box sx={{ py: 8, width: "86%" }}>
                        <Container maxWidth="xl">
                            <Stack spacing={3}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={4}
                                >
                                    <Stack spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={1}
                                        ></Stack>
                                    </Stack>
                                </Stack>
                                <Card variant="outlined">
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Attempt</TableCell>
                                                    <TableCell>Mark</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.mark}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Grid container spacing={2}>
                                                                <Grid container spacing={1}>
                                                                    <Button variant="contained">view</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Stack>
                        </Container>
                    </Box>
                </Stack>
            </Box>
        </>
    );
} 
