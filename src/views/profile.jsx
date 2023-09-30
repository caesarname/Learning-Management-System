import { useState, useEffect } from "react";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  Upload,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Box } from "@mui/material";
import { Container } from "@mui/system";
import "../style/profile.css";
import { UploadAvatar } from "../component/uploadAvatar";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const { Option } = Select;
export const Profile = () => {
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const history = useNavigate();
  const [img, setImg] = useState();
  const [medalList, setMedalList] = useState([]);
  const [currMedal, setCurrMedal] = useState();
  const [flag, setFlag] = useState();
  const zid = localStorage.getItem("zid");

  useEffect(() => {
    axios("http://129.226.223.80:8000/api/user/get_profile/", {
      method: "post",
      header: { "Content-Type": "application/json" },
      data: { zid },
    }).then((res) => {
      const data = res.data;
      form.setFieldsValue(data);
      if (res.data.medal) {
        setMedalList(res.data.medal.split(","));
      }
      if (data.photo !== "no photo") {
        const img_src = `data:image/jpeg;base64,${data.photo}`;
        setImg(img_src);
      } else {
        setImg("");
      }
    });
  }, [zid, form]);

  useEffect(() => {
    axios("http://129.226.223.80:8000/api/user/get_images/", {
      method: "post",
      header: { "Content-Type": "application/json" },
      data: { zid },
    }).then((res) => {
      if (res.data.set_medal === "") {
        setFlag(false);
      } else {
        setFlag(true);

        setCurrMedal(res.data.set_medal);
      }
    });
  }, [zid]);

  const onFinish = (values) => {
    const { ID, email, first_name, last_name, set_medal } = values;
    axios("http://129.226.223.80:8000/api/user/modify_profile/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        zid: ID,
        email,
        first_name,
        last_name,
        set_medal,
      },
    })
      .then((res) => {
        if (res.data.status === "success") {
          messageApi.open({
            type: "success",
            content: "Update Successfully!",
          });
        } else {
          messageApi.open({
            type: "error",
            content: res.data.success,
          });
        }
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: "request error!",
        });
      });
  };

  const SetMedal = (mfile) => {
    axios("http://129.226.223.80:8000/api/user/modify_profile/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        zid: form.getFieldValue("ID"),
        email: form.getFieldValue("email"),
        first_name: form.getFieldValue("first_name"),
        last_name: form.getFieldValue("last_name"),
        set_medal: mfile,
      },
    })
      .then((res) => {
        if (res.data.status === "success") {
          messageApi.open({
            type: "success",
            content: "Update Successfully!",
          });
        } else {
          messageApi.open({
            type: "error",
            content: res.data.success,
          });
        }
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: "request error!",
        });
      });
  };

  let newList = medalList.filter(function (listitem) {
    return listitem != "";
  });

  return (
    <Box>
      <Navbar />
      <Container>
        <div className="profile_container">
          <div className="profile_title">My Profile</div>
          {contextHolder}
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            labelAlign={"right"}
            labelCol={{
              style: { width: 160 },
            }}
            wrapperCol={{
              style: { width: "200px" },
            }}
            scrollToFirstError
          >
            <Form.Item label="ID" name="ID">
              <Input disabled={true} />
            </Form.Item>
            <Form.Item name="role" label="Role">
              <Input disabled={true} />
            </Form.Item>
            <Form.Item name="email" label="E-mail">
              <Input />
            </Form.Item>

            <Form.Item name="first_name" label="First Name">
              <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name">
              <Input />
            </Form.Item>
            <Form.Item label="Photo" valuePropName="fileList">
              {flag ? (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <SmallAvatar src={"http://" + `${currMedal}`} />
                  }
                >
                  <UploadAvatar
                    zid={form.getFieldValue("ID")}
                    imgPreviews={img}
                  />
                </Badge>
              ) : (
                <UploadAvatar
                  zid={form.getFieldValue("ID")}
                  imgPreviews={img}
                />
              )}
            </Form.Item>

            {flag ? (
              <Form.Item name="set_medal" label="Set Medal">
                <Input />
              </Form.Item>
            ) : (
              <h1></h1>
            )}

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
          {flag ? <h6>My Medal List</h6> : <h1></h1>}

          {flag ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>medal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newList.map((row) => (
                    <TableRow
                      key={row}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <img
                          src={"http://" + `${row}`}
                          width="42"
                          height="42"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Button onClick={() => SetMedal(row)}>
                          Use this Medal
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <h1></h1>
          )}
        </div>
      </Container>
    </Box>
  );
};
