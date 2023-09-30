import { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Home, ExpandMore, ExpandLess } from "@mui/icons-material";

export const Notificationbar = () => {
  const [open, setOpen] = useState(false);
  const courseNames = JSON.parse(localStorage.getItem("courseNames"));
  const courses = JSON.parse(localStorage.getItem("courses"));
  const courseIds = JSON.parse(localStorage.getItem("courseIds"));

  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  const handleCourseClick = (id) => {
    window.location.href = `http://localhost:3000/course/${id}`;
  };
  return (
    <Box
      sx={{
        width: "250px",
        bgcolor: "rgb(42, 43, 49)",
        minHeight: "100vh",
      }}
    >
      <List sx={{ color: "white" }}>
        <ListItem
          button
          onClick={handleClick}
          sx={{ "&:hover": { bgcolor: "rgb(52, 53, 65)" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Home />
          </ListItemIcon>
          <ListItemText primary="My courses" />
          {open ? (
            <IconButton
              sx={{ color: "white", ml: "auto" }}
              aria-expanded={open ? "true" : "false"}
              aria-label="show less"
              size="small"
              onClick={handleClick}
            >
              <ExpandLess />
            </IconButton>
          ) : (
            <IconButton
              sx={{ color: "white", ml: "auto" }}
              aria-expanded={open ? "true" : "false"}
              aria-label="show more"
              size="small"
              onClick={handleClick}
            >
              <ExpandMore />
            </IconButton>
          )}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: "70px" }}>
            {courseNames.map((courseName) => (
              <ListItem
                button
                key={courseName}
                onClick={() => handleCourseClick(courseIds[courseName])}
              >
                <ListItemText primary={courseName} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};
