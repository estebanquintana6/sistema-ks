import React, { Component } from "react";

import {
  Button,
  Container,
  Row
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
            <Row className="mt-4">
              <h5 className="text-center">{client.email}</h5>
              <table className="buttons">
                <tbody>
                  <tr>
                    <td>
                      <Button variant="info" onClick={this.editUser}>Editar</Button>
                    </td>
                    <td>
                      <Button variant="danger" onClick={this.props.deleteClient.bind(this, client._id, client.name)}>ELIMINAR</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
        }</Container >
    )
  }
}

export default ClientModal;