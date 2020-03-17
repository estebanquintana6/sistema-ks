import 'date-fns';

import React, { Component } from "react";

import { registerClient } from "../../../actions/registerClient";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import {
  Form,
  Col,
  Row,
  Button
} from 'react-bootstrap';
import "./ClientsForm.css"
import "moment/locale/es";

class ClientsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.registerClient(this.state, this.props.history);
  }

  getPersonTypeId = () => {
    return this.state.person_type && this.state.person_type === 'Moral' ? 'Razón Social' : 'RFC'
  }

  render() {
    return (
      <>
        <Row>
          <h2>Registro de cliente</h2>
        </Row>
        <Row>
          <Form id="clientForm" onSubmit={this.onSubmit}>
            <Row>
              <Col>
                <Form.Row>
                  <Form.Group as={Col} md="3" controlId="person_type">
                    <Form.Label>Tipo de persona</Form.Label>
                    <Form.Control required as="select" onChange={this.onChange}>
                      <option></option>
                      <option value="Fisica">Persona fisica</option>
                      <option value="Moral">Persona moral</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="languages">
                    <Form.Label>Idioma</Form.Label>
                    <Form.Control required as="select" onChange={this.onChange}>
                      <option></option>
                      <option value="Coreano">Coreano</option>
                      <option value="Español">Español</option>
                      <option value="Ambos">Ambos</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md='2' controlId="telephone" className={this.state.showRazonSocial}>
                    <Form.Label>Telefono</Form.Label>
                    <Form.Control required onChange={this.onChange} />
                  </Form.Group>
                  <Form.Group as={Col} md='5' controlId="email" className={this.state.showRazonSocial}>
                    <Form.Label>Correo</Form.Label>
                    <Form.Control required onChange={this.onChange} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md={this.state.nameSize} controlId="name">
                    <Form.Label>Nombre(s)</Form.Label>
                    <Form.Control required onChange={this.onChange} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="last_name" className={this.state.showRazonSocial}>
                    <Form.Label>Apellido(s)</Form.Label>
                    <Form.Control required onChange={this.onChange} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>

                  <Form.Group as={Col} controlId="rfc" className={this.state.showRazonSocial}>
                    <Form.Label>{this.getPersonTypeId()}</Form.Label>
                    <Form.Control required onChange={this.onChange} />
                  </Form.Group>
                </Form.Row>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Row>
      </>
    );
  }

}

ClientsForm.propTypes = {
  registerClient: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerClient }
)(ClientsForm);
