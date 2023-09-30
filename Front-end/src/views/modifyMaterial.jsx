import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const ModifyMaterial = () => {

    const [modifyData, setModifyData] = useState({
        material_importance:'',
        material_name:'',
        material_path:'',
    });

    const handleChange = (event) => {
        setModifyData({
            ...modifyData,
            [event.target.name]:event.target.value
        });
    }

    const modifySubmit = (fileid) => {
        axios.defaults.withCredentials = true;
        axios({
            url:"http://129.226.223.80:8000/api/material/modify_file/",
            data:{
              "file_id": fileid,
              "material_importance": modifyData.material_importance,
              "material_name": modifyData.material_name,
              "material_path": modifyData.material_path
            },
            method:"post",
            headers:{
              'X-CSRFToken': cookies.get('csrftoken')
            }
            
          }).then(res=>{
            console.log(res.data)
          })
    }
    let {id:fileid} = useParams();

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-9">
                    <div className="card">
                        <h5 className="card-header">Upload Material</h5>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label for="material_importance" className="form-label">Material Importance</label>
                                    <input type="text" onChange={handleChange} name="material_importance" id="material_importance" className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label for="material_name" className="form-label">Material Name</label>
                                    <input type="text" onChange={handleChange} name="material_name" id="material_name" className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label for="material_path" className="form-label">Week Number</label>
                                    <input type="text" onChange={handleChange} name="material_path" id="material_path" className="form-control" />
                                </div>
                                <button type="button" onClick={() => modifySubmit(fileid)} className="btn btn-primary">Modify</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
