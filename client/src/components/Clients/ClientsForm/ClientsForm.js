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
      contacts: [{ name: "", telephone: "", email: "", observation: "" }]
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
    if(e.target.id === 'person_type' && e.target.value === 'MORAL'){
      this.setState({[e.target.id]: e.target.value, gender: ''})
    }
    this.setState({ [e.target.id]: e.target.value });
  }

  onChangeContactName = (index, e) => {
    let contacts = [...this.state.contacts];
    let contact = { ...contacts[index] };

    contact.name = e.target.value;

    contacts[index] = contact;
    this.setState({ contacts });
  }

  onChangeContactTelephone = (index, e) => {
    let contacts = [...this.state.contacts];
    let contact = { ...contacts[index] };

    contact.telephone = e.target.value;

    contacts[index] = contact;
    this.setState({ contacts });
  }

  onChangeContactEmail = (index, e) => {
    let contacts = [...this.state.contacts];
    let contact = { ...contacts[index] };
    contact.email = e.target.value;
    contacts[index] = contact;
    this.setState({ contacts });
  }

  onChangeContactObservation = (index, e) => {
    let contacts = [...this.state.contacts];
    let contact = { ...contacts[index] };
    contact.observation = e.target.value;
    contacts[index] = contact;
    this.setState({ contacts });
  }

  createContact = () => {
    const contacts = [...this.state.contacts];
    contacts.push({
      name: "",
      telephone: "",
      email: ""
    })
    this.setState({ contacts });
  }

  deleteContact = (index) => {
    const contacts = [...this.state.contacts];
    contacts.splice(index, 1);
    this.setState({ contacts });
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
              <Col md="5">
                <Row>
                  <h5 className="swal-title form-title align-left">DATOS DEL CONTRATANTE</h5>
                </Row>
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="person_type">
                    <Form.Label>Tipo de persona</Form.Label>
                    <Form.Control required as="select" onChange={this.onChange} value={this.state.person_type}>
                      <option></option>
                      <option value="FISICA">Persona fisica</option>
                      <option value="MORAL">Persona moral</option>
                    </Form.Control>
                  </Form.Group>
                 { this.state.person_type === 'FISICA' && <Form.Group as={Col} md="6" controlId="gender">
                    <Form.Label>Sexo</Form.Label>
                    <Form.Control required as="select" onChange={this.onChange} value={this.state.gender}>
                      <option></option>
                      <option value="MASCULINO">MASCULINO</option>
                      <option value="FEMENINO">FEMENINO</option>
                    </Form.Control>
                  </Form.Group>}
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} md={this.state.nameSize} controlId="name">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control required onChange={this.onChange} value={this.state.name} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} md="8" controlId="rfc" className={this.state.showRazonSocial}>
                    <Form.Label>{this.getPersonTypeId()}</Form.Label>
                    <Form.Control required onChange={this.onChange} value={this.state.rfc} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="state">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control as="select" onChange={this.onChange} value={this.state.state}>
                        <option></option>
                        <option value="AGUASCALIENTES">Aguascalientes</option>
                        <option value="BAJA CALIFORNIA">Baja California</option>
                        <option value="BAJA CALIFORNIA SUR">Baja California Sur</option>
                        <option value="CAMPECHE">Campeche</option>
                        <option value="CHIAPAS">Chiapas</option>
                        <option value="CHIHUAHUA">Chihuahua</option>
                        <option value="CDMX">Ciudad de México</option>
                        <option value="COAHUILA">Coahuila</option>
                        <option value="COLIMA">Colima</option>
                        <option value="DURANGO">Durango</option>
                        <option value="ESTADO DE MEXICO">Estado de México</option>
                        <option value="GUANAJUATO">Guanajuato</option>
                        <option value="GUERRERO">Guerrero</option>
                        <option value="HIDALGO">Hidalgo</option>
                        <option value="JALISCO">Jalisco</option>
                        <option value="MICHOACAN">Michoacán</option>
                        <option value="MORELOS">Morelos</option>
                        <option value="NAYARIT">Nayarit</option>
                        <option value="NUEVO LEON">Nuevo León</option>
                        <option value="OAXACA">Oaxaca</option>
                        <option value="PUEBLA">Puebla</option>
                        <option value="QUERETARO">Querétaro</option>
                        <option value="QUINTANA ROO">Quintana Roo</option>
                        <option value="SAN LUIS POTOSI">San Luis Potosí</option>
                        <option value="SINALOA">Sinaloa</option>
                        <option value="SONORA">Sonora</option>
                        <option value="TABASCO">Tabasco</option>
                        <option value="TAMAULIPAS">Tamaulipas</option>
                        <option value="TLAXCALA">Tlaxcala</option>
                        <option value="VERACRUZ">Veracruz</option>
                        <option value="YUCATAN">Yucatán</option>
                        <option value="ZACATECAS">Zacatecas</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="city">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control onChange={this.onChange} value={this.state.city} />
                    </Form.Group>
                </Form.Row>
                
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="postal_code">
                        <Form.Label>Código postal</Form.Label>
                        <Form.Control onChange={this.onChange} value={this.state.postal_code} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="languages">
                    <Form.Label>Idioma</Form.Label>
                    <Form.Control as="select" onChange={this.onChange} value={this.state.languages}>
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
              <Col md="7">
                <Row>
                  <h5 className="swal-title form-title align-left">CONTACTO(S)</h5>
                </Row>
                <Row className="pt-1 pb-2 justify-content-md-center">
                  <Button variant="info" onClick={this.createContact}>AGREGAR</Button>
                </Row>
                {this.state.contacts.map((value, index) => {
                  return (
                    <React.Fragment style={{}}>
                      <Form.Row>
                        <Form.Group as={Col} md="6">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control onChange={(e) => { this.onChangeContactName(index, e) }} value={this.state.contacts[index].name} />
                        </Form.Group>
                        <Form.Group as={Col} md="5">
                          <Form.Label>Email</Form.Label>
                          <Form.Control onChange={(e) => { this.onChangeContactEmail(index, e) }} value={this.state.contacts[index].email} />
                        </Form.Group>
                        <Col md="1">
                          <Button variant="danger" className="align-center" onClick={() => { this.deleteContact(index) }}><i className="fa fa-trash" /></Button>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="6">
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control onChange={(e) => { this.onChangeContactTelephone(index, e) }} value={this.state.contacts[index].telephone} />
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label>Observaciones</Form.Label>
                          <Form.Control onChange={(e) => { this.onChangeContactObservation(index, e) }} value={this.state.contacts[index].observation} />
                        </Form.Group>
                      </Form.Row>
                      <hr></hr>
                    </React.Fragment>
                  );
                })}
              </Col>
            </Row>
          </Container>
          <Button className="btn-primary" type="submit">Guardar</Button>
        </Form>
      </div>
    );
  }

}

export default ClientsForm;