import { convertToRaw } from "draft-js";
import React from "react";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const UploadPost = () => {
  const [postData, setPostData] = useState({
    courseid: "",
    zid: "",
    title: "",
  });

  const [editorState, setEditorState] = useState("");
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  let { id: courseid } = useParams();
  let zid = localStorage.getItem("zid");

  const formSubmit = () => {
    axios.defaults.withCredentials = true;
    axios({
      url: "http://129.226.223.80:8000/api/forum/create_topic/",
      data: {
        title: postData.title,
        courseid: courseid,
        zid: zid,
        content: content,
      },
      method: "post",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    }).then((res) => {
      console.log(res.data);
    });
  };

  const uploadImageCallBack = (image) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("image", image);

      try {
        axios.defaults.withCredentials = true;
        axios
          .post(
            "http://129.226.223.80:8000/api/forum/upload_image/",
            formData,
            {
              "Content-Type": "multipart/form-data",
              "X-CSRFToken": cookies.get("csrftoken"),
            }
          )
          .then((res) => {
            resolve({ data: { link: res.data.image_url } });
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  return (
    <div>
      <h1>Upload Post</h1>
      <form>
        <div className="mb-3">
          <label for="title" className="form-label">
            Post Title
          </label>
          <input
            type="text"
            onChange={handleChange}
            name="title"
            id="title"
            className="form-control"
          />
        </div>
      </form>
      <div className="card">
        <div className="card-body">
          <Editor
            editorState={editorState}
            toolbar={{
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: true,
                uploadCallback: uploadImageCallBack,
                previewImage: true,
                inputAccept:
                  "image/gif, image/jpeg, image/jpg, image/png, image/svg",
                alt: { present: true, mandatory: true },
              },
            }}
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(editorState) => setEditorState(editorState)}
            onBlur={() => {
              setContent(
                draftToHtml(convertToRaw(editorState.getCurrentContent()))
              );
            }}
          />
        </div>
      </div>
      <Button variant="contained" color="success" onClick={formSubmit}>
        Post
      </Button>
    </div>
  );
};
