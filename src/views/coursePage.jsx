import { Box } from "@mui/system";
import { useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Outline } from "../component/outline";
import { Link } from "react-router-dom";
import { MaterialPage } from "./materialPage";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { OnlineClass } from "./onlineclass";
import { Leftbar } from "../component/leftbar";
import ListItemText from "@mui/material/ListItemText";

export const CoursePage = () => {
  let { id: courseid } = useParams();
  return (
    <Box>
      <Navbar />
      <Stack direction="row" spacing={5}>
        <Leftbar courseid={courseid} />
        <div className="container">
          <div className="row">
            <div className="col-4">Course Outine</div>
            <div className="col-8">
              <h1>
                Course ID {`${courseid}`} Outline Details
                <Outline course_id={courseid} />
              </h1>
            </div>
          </div>
        </div>
      </Stack>
    </Box>
  );
};
