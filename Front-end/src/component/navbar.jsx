import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUnread } from "../hooks/unread";
import axios from "axios";
import "../style/message.css";
const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "rgb(246, 249, 249)",
  padding: "0",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "40px",
  alignItems: "center",
}));

const BackButton = styled(Button)({
  color: "rgb(52, 53, 65)",
  marginLeft: "-16px",
  marginRight: "16px",
  "&:hover": {
    backgroundColor: "transparent",
  },
});
const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    borderRadius: 0,
  },
});

export const Navbar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState();
  const { trueCount, trueCountnew, lastUnreadMessageText } = useUnread();
  const history = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const logout = () => {
    for (const [key, value] of Object.entries(localStorage)) {
      if (key !== "readState") {
        localStorage.removeItem(key);
      }
    }

    history("/");
  };

  const back = () => {
    history("/MainPage");
  };

  const toProfile = () => {
    // props.getShowProfile(true);
    history("/profile");
  };

  useEffect(() => {
    // get profile
    axios("http://129.226.223.80:8000/api/user/get_profile/", {
      method: "post",
      header: { "Content-Type": "application/json" },
      data: { zid: localStorage.getItem("zid") },
    }).then((res) => {
      const data = res.data;
      if (data.photo !== "no photo") {
        const img_src = `data:image/jpeg;base64,${data.photo}`;
        setAvatar(img_src);
      } else {
        setAvatar("");
      }
    });
  }, []);

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#fff", color: "#222", padding: "0" }}
    >
      <StyledToolbar>
        {location.pathname !== "/" && (
          <BackButton onClick={back}>
            <ArrowBackIcon />
          </BackButton>
        )}
        <Typography variant="h5" sx={{ marginLeft: "190px" }}>
          {role}
        </Typography>

        <Icons>
          <Box
            sx={{
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: 0,
              backgroundColor: "rgb(246, 249, 249)",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 0 0 0px #fff",
              "&:hover": {
                backgroundColor: "rgb(213, 214, 222)",
                boxShadow: "0 0 0 8px rgb(213, 214, 222)",
              },
            }}
          >
            <Link to="/ChatBot" style={{ textDecoration: "none" }}>
              <IconButton sx={{ padding: 0, margin: 0 }}>
                <ChatIcon sx={{ width: 40, height: 40 }} />
              </IconButton>
            </Link>
          </Box>

          <Box
            sx={{
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: 0,
              backgroundColor: "rgb(246, 249, 249)",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 0 0 0px #fff",
              "&:hover": {
                backgroundColor: "rgb(213, 214, 222)",
                boxShadow: "0 0 0 8px rgb(213, 214, 222)",
              },
            }}
          >
            <Link to="/BroadcastPage" style={{ textDecoration: "none" }}>
              <IconButton sx={{ padding: 0, margin: 0 }}>
                {role === "student" ? (
                  location.pathname === "/BroadcastPage" ? (
                    trueCountnew !== null ? (
                      <Badge
                        badgeContent={
                          trueCountnew === "0" ? null : trueCountnew
                        }
                        color="error"
                      >
                        <NotificationsIcon sx={{ width: 40, height: 40 }} />
                      </Badge>
                    ) : (
                      <Badge
                        badgeContent={trueCount === 0 ? null : trueCount}
                        color="error"
                      >
                        <NotificationsIcon sx={{ width: 40, height: 40 }} />
                      </Badge>
                    )
                  ) : location.pathname === "/MainPage" ? (
                    trueCountnew !== null ? (
                      <Badge
                        badgeContent={
                          trueCountnew === "0" ? null : trueCountnew
                        }
                        color="error"
                      >
                        <NotificationsIcon sx={{ width: 40, height: 40 }} />
                      </Badge>
                    ) : (
                      <Badge
                        badgeContent={trueCount === 0 ? null : trueCount}
                        color="error"
                      >
                        <NotificationsIcon sx={{ width: 40, height: 40 }} />
                      </Badge>
                    )
                  ) : trueCountnew !== null ? (
                    <Badge
                      badgeContent={trueCountnew === "0" ? null : trueCountnew}
                      color="error"
                    >
                      <NotificationsIcon sx={{ width: 40, height: 40 }} />
                    </Badge>
                  ) : (
                    <Badge badgeContent={null} color="error">
                      <NotificationsIcon sx={{ width: 40, height: 40 }} />
                    </Badge>
                  )
                ) : (
                  <Badge badgeContent={null} color="error">
                    <NotificationsIcon sx={{ width: 40, height: 40 }} />
                  </Badge>
                )}
              </IconButton>
            </Link>
          </Box>

          <Box
            sx={{
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: 0,
              backgroundColor: "rgb(246, 249, 249)",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 0 0 0px #fff",
              "&:hover": {
                backgroundColor: "rgb(213, 214, 222)",
                boxShadow: "0 0 0 8px rgb(213, 214, 222)",
              },
            }}
          >
            <IconButton
              sx={{
                width: 40,
                height: 40,
                padding: 0,
                borderRadius: "50%",
                backgroundColor: "",
                border: "2px solid #fff",
                boxSizing: "border-box",
              }}
              onMouseDown={(e) => setMenuOpen(true)}
            >
              <img
                src={
                  avatar ||
                  "https://img2.baidu.com/it/u=3726660842,3936973858&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300"
                }
                alt="User"
                width="40"
                height="40"
                style={{ borderRadius: "50%" }}
              />
            </IconButton>
          </Box>
        </Icons>
      </StyledToolbar>
      <StyledMenu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={menuOpen}
        onClose={(e) => setMenuOpen(false)}
        anchorOrigin={{
          vertical: 65,
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiTab-root": {
            backgroundColor: "rgb(246, 249, 249)",
            border: "1px solid #000",
          },
        }}
      >
        <MenuItem onClick={toProfile}>My Profile</MenuItem>
        <MenuItem onClick={logout}>Log out</MenuItem>
      </StyledMenu>
      {role === "student" && location.pathname !== "/BroadcastPage" && (
        <marquee scrollamount={15}>{lastUnreadMessageText}</marquee>
      )}
    </AppBar>
  );
};
