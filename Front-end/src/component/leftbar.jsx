import React from "react";
import {
  Box,
  List,
  ListItem,
  Button,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Assignment,
  Book,
  Info,
  QuestionAnswer,
  School,
  VideoLibrary,
} from "@mui/icons-material";

export const Leftbar = ({ courseid }) => {
  return (
    <Box
      sx={{ width: "250px", bgcolor: "rgb(42, 43, 49)", minHeight: "100vh" }}
    >
      <List sx={{ color: "white" }}>
        <ListItem
          button
          component={Link}
          to={process.env.PUBLIC_URL + `/course/${courseid}`}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Info />
          </ListItemIcon>
          <ListItemText primary="Outline" sx={{ color: "white" }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={process.env.PUBLIC_URL + `/onlineclass/${courseid}`}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <VideoLibrary />
          </ListItemIcon>
          <ListItemText primary="Online Class" sx={{ color: "white" }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={process.env.PUBLIC_URL + `/materialPage/${courseid}`}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Book />
          </ListItemIcon>
          <ListItemText primary="Material" sx={{ color: "white" }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={process.env.PUBLIC_URL + `/Quiz/${courseid}`}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <QuestionAnswer />
          </ListItemIcon>
          <ListItemText primary="Quiz" sx={{ color: "white" }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={process.env.PUBLIC_URL + `/assignmentPage/${courseid}`}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Assignment" sx={{ color: "white" }} />
        </ListItem>

        <ListItem
          button
          component={Link}
          to={process.env.PUBLIC_URL + `/forumPage/${courseid}`}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <School />
          </ListItemIcon>
          <ListItemText primary="Forum" sx={{ color: "white" }} />
        </ListItem>
      </List>
    </Box>
  );
};
