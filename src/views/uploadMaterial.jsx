import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const UploadMaterial = () => {
  const [materialData, setMaterialData] = useState({
    material_type: "",
    material_importance: "",
    material_name: "",
    material_path: "",
    course_id: "",
    material_file: "",
  });

  const handleChange = (event) => {
    setMaterialData({
      ...materialData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setMaterialData({
      ...materialData,
      [event.target.name]: event.target.files[0],
    });

    //console.log(event.target.files[0])
  };

  let { id: courseid } = useParams();

  const formSubmit = () => {
    const _formData = new FormData();

    _formData.append("material_type", materialData.material_type);
    _formData.append("material_importance", materialData.material_importance);
    _formData.append("material_name", materialData.material_name);
    _formData.append("material_path", materialData.material_path);
    _formData.append("course_id", courseid);

    _formData.append("file", materialData.file, materialData.file.name);

    try {
      axios.defaults.withCredentials = true;
      axios
        .post(
          "http://129.226.223.80:8000/api/material/upload_file/",
          _formData,
          {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": cookies.get("csrftoken"),
          }
        )
        .then((res) => {
          console.log("success");
        });
    } catch (error) {}
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-9">
          <div className="card">
            <h5 className="card-header">Upload Material</h5>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label for="material_type" className="form-label">
                    Material Type
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="material_type"
                    id="material_type"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label for="material_importance" className="form-label">
                    Material Importance
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="material_importance"
                    id="material_importance"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label for="material_name" className="form-label">
                    Material Name
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="material_name"
                    id="material_name"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label for="material_path" className="form-label">
                    Week Number
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="material_path"
                    id="material_path"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label for="file" className="form-label">
                    Material File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="file"
                    id="file"
                    className="form-control"
                  />
                </div>
                <button
                  type="button"
                  onClick={formSubmit}
                  className="btn btn-primary"
                >
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
