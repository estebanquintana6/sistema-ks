import React, { Component } from "react";

import {
    Col,
    Form,
    Button,
    Row,
  } from 'react-bootstrap';

  import { ToastContainer, toast } from 'react-toastify';


  import {FormFile} from 'react-bootstrap/Form'

class ClientFiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
      }


    onChangeHandler = event => {
        var file = event.target.files[0];
        console.log(file);
        console.log(this.validateSize(event));
        if(this.validateSize(event)){ 
          console.log(file);
      // if return true allow to setState
         this.setState({
          selectedFile: file
          });
        }
    }

    validateSize=(event)=>{
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

    render() {
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
                        <form method="post" action="#" id="#">
                            <div className="form-group files">
                                <label>Selecciona un archivo </label>
                                <input type="file" name="file" className="form-control" onChange={this.onChangeHandler}/>
                            </div>
                            <div>
                            <button width="100%" type="button" className="btn btn-info" onClick={this.fileUploadHandler}><i class="fa fa-arrow-up" aria-hidden="true"></i></button>
                            </div>
                        </form>                 
                    </Row>
                </Col>
            </Row>
       </React.Fragment> 
      );
    }
}

export default ClientFiles;