import React, { useState } from "react";
import Progress from "./Progress/Progress";

import {
    Col,
    Form,
    Button,
    Row,
  } from 'react-bootstrap';


  import axios from 'axios';
  import { toast } from 'react-toastify';


  const ClientFiles = (props) => {
    const [file, setFile] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChangeHandler = event => {
        var file = event.target.files[0];
        console.log(file);
        console.log(validateSize(event));
        if(validateSize(event)){ 
            console.log(file);
            setFile(file);
        }
    }

    const validateSize=(event)=>{
        let file = event.target.files[0];
        let size = 30000;
        let err = '';
        console.log("File size", file.size);
        if (file.size > size) {
         err = file.type+'el tamaño del archivo es muy grande, no debe sobrepasar 30000bytes \n';
         toast.error(err);
       }
       return true
    };

    const fileUploadHandler = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', props.client._id)
        const token = localStorage.getItem("jwtToken");
        formData.append('token', token)

        
        try {
            const res = await axios.post(`/api/${props.entity}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              onUploadProgress: progressEvent => {
                setUploadPercentage(
                  parseInt(
                    Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  )
                );
      
                // Clear percentage
                setTimeout(() => setUploadPercentage(0), 10000);
              }
            });
      
            const { fileName, filePath } = res;
      
          } catch (err) {
            if (err.response.status === 500) {
            } else {
            }
          }

    };

    return (
       <React.Fragment>
            <Row>
                <Col>
                    <Row>                
                        <h2 className="swal-title form-title align-left">Archivos</h2>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Row>                
                        <h2 className="swal-title form-title align-left">Subir nuevo archivo</h2>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Progress percentage={uploadPercentage} />
                        <form method="post" action="#" id="#" >
                            <div className="form-group files">
                                <label>Selecciona un archivo </label>
                                <input type="file" name="file" className="form-control" onChange={onChangeHandler}/>
                            </div>
                            <div>
                            <button width="100%" type="button" className="btn btn-info" onClick={fileUploadHandler}><i class="fa fa-arrow-up" aria-hidden="true"></i></button>
                            </div>
                        </form>                 
                    </Row>
                </Col>
            </Row>
       </React.Fragment> 
    );
}

export default ClientFiles;