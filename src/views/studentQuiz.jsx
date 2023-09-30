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
import { Leftbar } from "../component/leftbar";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@mui/material";
import dayjs from 'dayjs'
import { Materials } from "../component/materials";
import { StudentMaterials } from "../component/studentMaterials";
import axios from "axios";
import Cookies from "universal-cookie";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Outline } from "../component/outline";
import { Modal, Popconfirm, message } from "antd";
import { array } from "prop-types";

const cookies = new Cookies();

export const StudentQuiz = () => {
    const history = useNavigate();

    // const [quiz, setQuiz] = useState([]);

    const { courseid, quizid } = useParams();
    const [student, setStudent] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        axios({
            url: "http://129.226.223.80:8000/api/quiz/get_all_ans_teacher/",
            data: {
                quizid,
            },
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken"),
            },
        })
            .then((res) => {
                const { student_list } = res.data
                let newStudent = []

                let temp_status = ""
                for (let i = 0; i < student_list.length; i++) {
                    if (JSON.stringify(student_list[i].answer_status) === "{}") {
                        temp_status = "Not Attempted"
                    } else {
                        let mark_arr = student_list[i].answer_status.auto_mark.replace("[", "").replace("]", "").split(",")
                        for (let i = 0; i < mark_arr.length; i++) {
                            mark_arr[i] = Number(mark_arr[i])
                        }
                        // check if there is open-ended question not marked yet
                        // if it is, mark status is "not marked"
                        // if not, mark status is the total mark
                        if (mark_arr.indexOf(-1) !== -1) {
                            temp_status = "Not Marked"
                        } else {
                            temp_status = mark_arr.reduce((sum, value) => { return sum + value }, 0)
                        }
                    }

                    newStudent.push({
                        zid: student_list[i].zid,
                        name: student_list[i].name,
                        status: temp_status
                    })
                }
                setStudent(newStudent)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [quizid]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const markQuiz = (studentid, status) => {
        if (status !== "Not Attempted") {
            history(`/MarkQuiz/${courseid}/${quizid}/${studentid}`)
        } else {
            showModal();
        }
    }

    return (
        <>
            <Head>
                <title>Quiz</title>
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
                                                    <TableCell>Student ID</TableCell>
                                                    <TableCell>Student Name</TableCell>
                                                    <TableCell>Mark</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {student.map((item) => (
                                                    <TableRow
                                                        key={item.zid}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {item.zid}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {item.name}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {item.status}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Grid container spacing={2}>
                                                                <Grid container spacing={1}>
                                                                    <Button variant="contained" onClick={() => { markQuiz(item.zid, item.status) }}>Mark</Button>
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
            <Modal title="Sorry!" open={isModalOpen}
                onOk={handleOk} cancelButtonProps={{ style: { display: 'none' } }}>
                <p>The student hasn't attempted the quiz yet!</p>
            </Modal>
        </>
    );
};
