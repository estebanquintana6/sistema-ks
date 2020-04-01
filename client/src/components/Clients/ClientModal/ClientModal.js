import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import ClientsForm from "../ClientsForm/ClientsForm";

class ClientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null
    }
  }

  editUser = () => {
    this.setState({ edit: true })
  }

  render() {
    const { client } = this.props;
    return (
      < Container >
        {
          this.state.edit ? <ClientsForm client={client} edit={this.state.edit} updateClient={this.props.updateClient} ></ClientsForm> :
            <React.Fragment>
              <Row className="mt-4">
                <Col>
                  <h5 className="text-center">{client.name + ' ' + client.last_name}</h5>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col>
                  <Button variant="info" onClick={this.editUser}>Editar</Button>
                </Col>
                <Col>
                  <Button variant="danger" onClick={this.props.deleteClient.bind(this, client._id, client.name)}>ELIMINAR</Button>
                </Col>
              </Row>
            </React.Fragment>
        }</Container >
    )
  }
}

export default ClientModal;