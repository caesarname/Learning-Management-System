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
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Leftbar } from "../component/leftbar";
import { Outline } from "../component/outline";
import React from "react";

export const ClassPage = () => {
  let { id: courseid, urlid: channelId } = useParams();
  const src = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1`;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2}>
          <Leftbar courseid={courseid} />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: "16 / 9",
            }}
          >
            <iframe
              title="Class Video"
              width="95%"
              height="95%"
              src={src}
              frameborder="0"
              allowfullscreen
            ></iframe>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
