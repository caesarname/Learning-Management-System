import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const GiveMedalPage = () => {
  let { zid: creator_zid } = useParams();

  const [medalList, setMedalList] = useState([]);
  const [stuList, setStuList] = useState([]);

  const giveMedal = (mfile, prelist) => {
    let mfilelist = prelist + ",";
    mfilelist += mfile;
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/user/arrange_medals/",
      data: {
        zid: creator_zid,
        medal: mfilelist,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      console.log(res.data);
    });
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/user/get_medals/",
      method: "get",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      setMedalList(res.data);
    });
  }, []);

  useEffect(() => {
    axios("http://129.226.223.80:8000/api/user/get_profile/", {
      method: "post",
      header: { "Content-Type": "application/json" },
      data: { zid: creator_zid },
    }).then((res) => {
      setStuList(res.data.medal.split(","));
    });
  }, [creator_zid]);

  let currList = medalList.filter(function (listitem) {
    return listitem;
  });
  let newList = medalList.filter(function (listitem) {
    return listitem;
  });

  if (stuList !== []) {
    newList = medalList.filter(function (listitem) {
      return stuList.find(function (mymedal) {
        return mymedal == listitem.mfile;
      });
    });

    currList = medalList.filter(function (listitem) {
      if (!newList.includes(listitem)) {
        return listitem;
      }
    });
  }

  return (
    <div className="container mt-4">
      {`${creator_zid}`}'s Medal List
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>mid</TableCell>
              <TableCell>medal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newList.map((row) => (
              <TableRow
                key={row.mid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.mid}
                </TableCell>
                <TableCell component="th" scope="row">
                  <img
                    src={"http://" + `${row.mfile}`}
                    width="42"
                    height="42"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      Medal List
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>mid</TableCell>
              <TableCell>medal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currList.map((row) => (
              <TableRow
                key={row.mid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.mid}
                </TableCell>
                <TableCell component="th" scope="row">
                  <img
                    src={"http://" + `${row.mfile}`}
                    width="42"
                    height="42"
                  />
                </TableCell>

                <TableCell align="center">
                  <Button onClick={() => giveMedal(row.mfile, stuList)}>
                    Give this Medal
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
