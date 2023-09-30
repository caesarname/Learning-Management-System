import { useState, useEffect } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import axios from "axios";
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 4;
  if (!isLt2M) {
    message.error("Image must smaller than 4MB!");
  }
  return isJpgOrPng && isLt2M;
};
export const UploadAvatar = (props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    //   if (info.file.status === 'uploading') {
    //     setLoading(true);
    //     return;
    //   }
    //   if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, (url) => {
    //         console.log(url, 'url')
    //       setLoading(false);
    //       setImageUrl(url);
    //     });
    //   }
  };
  const fetchupload = (info) => {
    getBase64(info.file, (url) => {
      setLoading(false);
      setImageUrl(url);
      axios("http://129.226.223.80:8000/api/user/modify_profile_photo/", {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          zid: props.zid,
          file: url,
        },
      }).then((res) => {
        message.success("upload success!");
      });
    });
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={fetchupload}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      maxCount={1}
    >
      {imageUrl || props.imgPreviews ? (
        <img
          src={imageUrl || props.imgPreviews}
          alt="avatar"
          style={{
            width: "100%",
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
