import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

import {Col} from 'react-bootstrap';

const FileUpload = (props) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);


  const validateSize= (event) =>{
    let file = event.target.files[0];
    let size = 4000000;
    let err = '';
    console.log("File size", file.size);
    if (file.size > size) {
      err = file.type+'el tamaño del archivo es muy grande, no debe sobrepasar 4mb \n';
      setMessage(err);
    }
    return true
  };

  const onChange = e => {
    if(validateSize(e)){ 
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  };




  const onSubmit = async e => {
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
      setMessage('Archivo subido');
      props.refresh();
    } catch (err) {
      console.log(err);
      if (err.response.status === 500) {
        setMessage('Ocurrió un error en el servidor');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />
        <Col>
          <input
            type='submit'
            value='Subir'
            className='btn btn-primary btn-block mt-4'
          />
        </Col>

      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;