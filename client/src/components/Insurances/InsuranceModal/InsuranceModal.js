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
import {formatShortDate} from '../../component-utils';

import "./InsuranceModal.css";
import FileVisualizer from '../../Files/FileVisualizer'

class InsuranceModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: null,
      insurance: this.props.insurance
    }
  }

  refresh = () => {
    this.props.getInsurance(this.state.insurance._id).then(data => {
      this.setState({
        insurance: data
      });
    }).finally(() => {
      this.viewFiles();
      this.props.refresh();
    });
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
                  updateInsurance={this.props.updateInsurance} 
                  refreshPanel={this.props.refresh}
                  >
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

  downloadFile = (filepath) => {
    this.props.download(filepath);
  }

  confirmRemoveFile = (file, id) => {
    swal({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar el archivo ${file.replace(/^.*[\\\/]/, '')}`,
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.props.removeFile(file, id);

        swal("Eliminado!", "Tu archivo ha sido eliminado!", "success").then(() =>{
          this.props.refresh()
        });
      }
    });
  }

  saveFile = (file, id) => {
      this.props.saveFile(file, id);
      this.props.refresh();
  }

  viewFiles = () => {
    swal({
      title: `Archivos`,
      text: `Archivos de póliza ${this.state.insurance.policy}`,
      className: "width-800pt-100h",
      content: 
      <div>
        <FileVisualizer entity={this.state.insurance} downloadFile={this.downloadFile} refresh={this.refresh} removeFile={this.props.removeFile} saveFile={this.saveFile}></FileVisualizer>
          <Row>                
            <h2 className="swal-title form-title align-left">Subir nuevo archivo</h2>
          </Row>
          <FileUpload entity={'insurances'} refresh={this.refresh} target={this.state.insurance} finally={() => console.log("done")}></FileUpload>
      </div>
    });
  }

  render() {
    const { insurance } = this.state;
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
              <Button variant="info" className="button-modal" onClick={this.viewFiles}>ARCHIVOS</Button>
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