import React, { Component } from "react";

import {
  Button,
  Container,
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
      edit: null
    }
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
    })
  }

  render() {
    const { insurance } = this.props;
    return (
      < Container >
        <React.Fragment>
          <Row className="mt-4">
            <Col>
              <h5 className="text-center">{`Cliente: ${insurance.client.name}`}</h5>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <Button variant="info" className="option-button" onClick={this.editInsurance.bind(this, insurance)}>EDITAR</Button>
            </Col>
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