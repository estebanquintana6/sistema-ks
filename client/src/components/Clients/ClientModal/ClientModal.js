import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import ClientsForm from "../ClientsForm/ClientsForm";

import "./ClientModal.css";
import swal from '@sweetalert/with-react';

class ClientModal extends Component {

  editUser = () => {
    const { client } = this.props;
    swal({
      title: `${client.name} ${client.last_name}`,
      text: "Edita los campos y presiona guardar para modificar la información del cliente",
      content: <ClientsForm 
                  client={client} 
                  edit={true} 
                  updateClient={this.props.updateClient}>
                </ClientsForm>,
      className: "width-800pt" ,
      buttons: false
    });
  }

  render() {
    const { client } = this.props;
    return (
      < Container >
        {
            <React.Fragment>
              <Row className="mt-4">
                <Col>
                  <h5 className="text-center">{client.name + ' ' + client.last_name}</h5>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col>
                  <Button className="panel-btn" variant="info" onClick={this.editUser}>EDITAR</Button>
                </Col>
                <Col>
                  <Button className="panel-btn" variant="danger" onClick={this.props.deleteClient.bind(this, client._id, client.name)}>ELIMINAR</Button>
                </Col>
              </Row>
            </React.Fragment>
        }</Container >
    )
  }
}

export default ClientModal;