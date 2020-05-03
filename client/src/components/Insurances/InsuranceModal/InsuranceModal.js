import React, { Component } from "react";

import {
  Button,
  Container,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import InsuranceForm from "../InsuranceForm/InsuranceForm";
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
  

  editInsurance = (insurance) => {
    swal({
      title: `Editar seguro`,
      text: `Modifica los campos del seguro`,
      content: <InsuranceForm 
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
          <Button variant="warning" type="submit">Cancelar</Button>
        </Row>
      </Form>,
      buttons: false
    });
  }

  render() {
    const { insurance } = this.props;
    return (
      < Container >
        <React.Fragment>
          <Row>
            <Col>
              <Button variant="info" className="option-button" onClick={this.editInsurance.bind(this, insurance)}>VER</Button>
            </Col>
            { insurance.active_status &&
            <Col>
              <Button variant="warning" className="option-button" onClick={this.cancelInsurance.bind(this, insurance)}>CANCELAR</Button>
            </Col>
            }
            { !insurance.active_status && 
              <Col>
              <Button variant="success" className="option-button" onClick={this.props.activateInsurance.bind(this, insurance)}>ACTIVAR</Button>
              </Col>            
            }
          </Row>
          <Row className="mt-4">
            <Col>
              <Button variant="danger" className="option-button" onClick={this.props.deleteInsurance.bind(this, insurance._id, insurance.policy)}>ELIMINAR</Button>
            </Col>
          </Row>
        </React.Fragment>
      </Container >
    )
  }
}

export default InsuranceModal;