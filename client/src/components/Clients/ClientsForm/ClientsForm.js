import 'date-fns';

import React, { Component } from "react";

import {
  Button,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import "./ClientsForm.css"
import "moment/locale/es";

class ClientsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [{name: "", telephone: ""}]
    };
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
  }

  onChangeContactName = (index, e) => {      
      let contacts = [...this.state.contacts];
      let contact = {...contacts[index]};

      contact.name = e.target.value;

      contacts[index] = contact;
      this.setState({contacts});
  }

  onChangeContactTelephone = (index, e) => {      
    let contacts = [...this.state.contacts];
    let contact = {...contacts[index]};

    contact.telephone = e.target.value;

    contacts[index] = contact;
    this.setState({contacts});
  }

  createContact = () => {
    const contacts = [...this.state.contacts];
    contacts.push({
      name: "",
      telephone: ""
    })
    this.setState({contacts});
  }

  deleteContact = (index) => {
    const contacts = [...this.state.contacts];
    contacts.splice(index, 1);
    this.setState({contacts});
  }


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
      <div>
        <Form id="clientForm" onSubmit={this.onSubmit}>
          <Container>
            <Row>
              <Col md="6">
                <Row>
                  <h5 className="swal-title form-title align-left">DATOS DEL CONTRATANTE</h5>
                </Row>
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
                    <Form.Label>Teléfono</Form.Label>
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
                  <Form.Group as={Col} controlId="comments" className={this.state.comments}>
                    <Form.Label>Comentarios</Form.Label>
                    <Form.Control as="textarea" onChange={this.onChange} value={this.state.comments} />
                  </Form.Group>


              </Col>
              <Col md="6">
                <Row>
                  <h5 className="swal-title form-title align-left">CONTACTO(S)</h5>
                </Row>
                <Row className="pt-1 pb-2">
                  <Col md="12">
                    <Button variant="info" onClick={this.createContact}>AGREGAR</Button>
                  </Col>
                </Row>
                  {this.state.contacts.map((value, index) => {
                    return (
                      <Form.Row>
                        <Form.Group as={Col} md="6" className={this.state.comments}>
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control required onChange={(e) => {this.onChangeContactName(index, e)}} value={this.state.contacts[index].name} />
                        </Form.Group>
                        <Form.Group as={Col} md="5" className={this.state.comments}>
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control required onChange={(e) => {this.onChangeContactTelephone(index, e)}} value={this.state.contacts[index].telephone} />
                        </Form.Group>
                        <Col md="1">
                          <Button variant="danger" className="align-center" onClick={() => {this.deleteContact(index)}}><i className="fa fa-trash"/></Button>
                        </Col>
                      </Form.Row> 
                    );
                  })}
              </Col>
            </Row>
          </Container>
          <Button variant="primary" type="submit">Guardar</Button>
        </Form>
      </div>
    );
  }

}

export default ClientsForm;