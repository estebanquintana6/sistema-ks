import 'date-fns';

import React, { Component } from "react";

import {
  Button,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import "./ClientsForm.css"
import "moment/locale/es";

class ClientsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.edit) return;
    // prepare the client data to be rendered in every field
    this.prepareClientForForm();
  }

  prepareClientForForm = () => {
    const auxObj = {}
    Object.keys(this.props.client).forEach(key => {
      auxObj[key] = this.props['client'][key];
    })
    auxObj['edit'] = this.props['edit']
    this.setState(auxObj)
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  prepareClientDataForSave = (data) => {
    const newData = data
    delete newData.__v
    delete newData.edit
    return newData
  }

  onSubmit = e => {
    e.preventDefault();
    // if im not editing the client, create one
    if (!this.state.edit) {
      this.props.save(this.state);
      return;
    }
    const newClientData = this.prepareClientDataForSave(this.state)
    this.props.updateClient(newClientData)
  }

  getPersonTypeId = () => {
    return this.state.person_type && this.state.person_type === 'Moral' ? 'Razón Social' : 'RFC'
  }

  render() {
    return (
      <Form id="clientForm" onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="person_type">
                <Form.Label>Tipo de persona</Form.Label>
                <Form.Control required as="select" onChange={this.onChange} value={this.state.person_type}>
                  <option></option>
                  <option value="Fisica">Persona fisica</option>
                  <option value="Moral">Persona moral</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md={this.state.nameSize} controlId="name">
                <Form.Label>Nombre(s)</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.name} />
              </Form.Group>
              <Form.Group as={Col} controlId="last_name" className={this.state.showRazonSocial}>
                <Form.Label>Apellido(s)</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.last_name} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="telephone" className={this.state.showRazonSocial}>
                <Form.Label>Telefono</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.telephone} />
              </Form.Group>
              <Form.Group as={Col} controlId="email" className={this.state.showRazonSocial}>
                <Form.Label>Correo</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.email} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="rfc" className={this.state.showRazonSocial}>
                <Form.Label>{this.getPersonTypeId()}</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.rfc} />
              </Form.Group>
              <Form.Group as={Col} controlId="languages">
                <Form.Label>Idioma</Form.Label>
                <Form.Control required as="select" onChange={this.onChange} value={this.state.languages}>
                  <option></option>
                  <option value="Coreano">Coreano</option>
                  <option value="Español">Español</option>
                  <option value="Ambos">Ambos</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default ClientsForm;