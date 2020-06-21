import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import swal from '@sweetalert/with-react';

import "./InvoicesModal.css";
import InvoicesForm from "../InvoicesForm/InvoicesForm";

class InvoicesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null
    }
  }

  editInvoice = (invoice) => {
    swal({
      title: `Editar recibo de cliente ${invoice.client.name || ""}`,
      text: `Modifica los campos del recibo para la póliza ${invoice.insurance.policy}`,
      content: <InvoicesForm invoice={this.props.invoice} edit={true} updateInvoice={this.props.updateInvoice} ></InvoicesForm>,
      buttons: false,
      className: "width-800pt-100h"
    })
  }

  render() {
    const { invoice } = this.props;
    return (
      < Container >
        <React.Fragment>
          <Row>
            <Col>
              <Button variant="info" className="option-button" onClick={this.editInvoice.bind(this, invoice)}>EDITAR</Button>
            </Col>
            <Col>
              <Button variant="danger" className="option-button" onClick={this.props.deleteInvoice.bind(this, invoice._id)}>ELIMINAR</Button>
            </Col>
          </Row>
        </React.Fragment>
      </Container >
    )
  }
}

export default InvoicesModal;