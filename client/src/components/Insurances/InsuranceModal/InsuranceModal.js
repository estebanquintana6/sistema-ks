import React, { Component } from "react";

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import InsuranceForm from "../InsuranceForm/InsuranceForm";
import FileUpload from '../../GenericUploader/FileUpload'

import swal from '@sweetalert/with-react';

import "./InsuranceModal.css";

class InsuranceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null,
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  }
  

  editInsurance = (event, insurance, invoices = false) => {
    let title = "Editar seguros";
    let text = "Modifica los campos del seguro";

    if(invoices){
      title = "Vista de recibos";
      text = "Modifica los campos de los recibos."
    }

    swal({
      title: title,
      text: text,
      content: <InsuranceForm 
                  invoicePanel={invoices}
                  type={this.props.type}
                  insurance={this.props.insurance} 
                  clients={this.props.clients} 
                  companies={this.props.companies} 
                  edit={true} 
                  updateInsurance={this.props.updateInsurance} >
                </InsuranceForm>,
      buttons: false,
      className: "width-800pt-100h"
    });
  }

  cancelInsurance = (insurance) => {
    swal({
      title: `Cancelar seguro`,
      icon: "warning",
      text: "Escribe una nota de cancelación",
      content: 
      <Form onSubmit={() => {
          this.props.cancelInsurance(insurance, this.state.cancelation_note)
        }}>
        <Form.Row>
          <Form.Group as={Col} md={{span: 12}} controlId="cancelation_note">
            <Form.Label>Nota</Form.Label>
            <Form.Control type="textarea" onChange={this.onChange} value={this.state.cancelation_note}/>
          </Form.Group>
        </Form.Row>
        <Row className="justify-content-md-center">
          <Button variant="warning" type="submit">OK</Button>
        </Row>
      </Form>,
      buttons: false
    });
  }

  viewFiles = (insurance) => {
    swal({
      title: `Archivos`,
      text: `Archivos de póliza ${insurance.policy}`,
      className: "width-800pt-100h",
      content: 
      <div>
          <Row>                
            <h2 className="swal-title form-title align-left">Archivos</h2>
          </Row>
          <Row>
          {insurance.files.map(file => {
            return (<React.Fragment>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{file.path.replace(/^.*[\\\/]/, '')}</Card.Title>
                  <Row>
                    <Col>
                      <Button variant="info" onClick={this.props.download.bind(this, file.path)}><i class="fa fa-arrow-down" aria-hidden="true"></i></Button>
                    </Col>
                    <Col>
                      <Button variant="danger" onClick={this.props.removeFile.bind(this, file.path, insurance._id)}><i class="fa fa-trash" aria-hidden="true"></i></Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </React.Fragment>)
          })}
          </Row>
          <Row>                
            <h2 className="swal-title form-title align-left">Subir nuevo archivo</h2>
          </Row>
          <FileUpload entity={'insurances'} refresh={this.props.refresh} target={insurance}></FileUpload>
      </div>
    });
  }

  render() {
    const { insurance } = this.props;
    return (
      < Container >
        <React.Fragment>
          <Row>
            <Col md="12">
              <Button variant="info" className="button-modal" onClick={this.editInsurance.bind(this, insurance)}>VER POLIZA</Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md="12">
              <Button variant="info" className="button-modal" onClick={this.editInsurance.bind(this, insurance, true)}>RECIBOS</Button>
            </Col>  
          </Row>

          <Row className="mt-2">
            <Col md="12">
              <Button variant="info" className="button-modal" onClick={this.viewFiles.bind(this, insurance)}>ARCHIVOS</Button>
            </Col>  
          </Row>

          <Row className="mt-2">
            <Col md="12">
              <Button variant="success" className="button-modal" onClick={this.props.changePayStatus.bind(this, insurance)}>CAMBIAR STATUS PAGO</Button>
            </Col>
          </Row>

          <Row className="mt-2">
          { insurance.active_status &&
            <Col md="12">
              <Button variant="warning" className="button-modal" onClick={this.cancelInsurance.bind(this, insurance)}>CANCELAR POLIZA</Button>
            </Col>
            }
            { !insurance.active_status && 
              <Col md="12">
              <Button variant="success" className="button-modal" onClick={this.props.activateInsurance.bind(this, insurance)}>ACTIVAR POLIZA</Button>
              </Col>            
            }
          </Row>

          <Row className="mt-2">
             <Col md="12">
              <Button variant="danger" className="button-modal" onClick={this.props.deleteInsurance.bind(this, insurance._id, insurance.policy)}>ELIMINAR POLIZA</Button>
            </Col>
          </Row>

        </React.Fragment>
      </Container >
    )
  }
}

export default InsuranceModal;