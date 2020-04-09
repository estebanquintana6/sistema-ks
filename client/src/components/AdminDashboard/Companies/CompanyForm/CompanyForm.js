import 'date-fns';
import React, { Component } from "react";
import {
  Button,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import "./CompanyForm.css"
import "moment/locale/es";

class CompanyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abbreviations: [{ name: "" }]
    };
  }

  componentDidMount() {
    if (!this.props.edit) return;
    // prepare the Company data to be rendered in every field
    this.prepareCompanyForForm();
  }

  prepareCompanyForForm = () => {
    const auxObj = {}
    Object.keys(this.props.company).forEach(key => {
      auxObj[key] = this.props['company'][key];
    })
    auxObj['edit'] = this.props['edit']
    this.setState(auxObj)
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onChangeAbbreviationName = (index, e) => {
    let abbreviations = [...this.state.abbreviations];
    let abbreviation = { ...abbreviations[index] };
    abbreviation.name = e.target.value;
    abbreviations[index] = abbreviation;
    this.setState({ abbreviations });
  }

  createAbbreviation = () => {
    const abbreviations = [...this.state.abbreviations];
    abbreviations.push({
      name: "",
    })
    this.setState({ abbreviations });
  }

  deleteAbbreviation = (index) => {
    const abbreviations = [...this.state.abbreviations];
    abbreviations.splice(index, 1);
    this.setState({ abbreviations });
  }

  onSubmit = e => {
    e.preventDefault();
    // if im not editing the Company, create one
    if (!this.state.edit) {
      this.props.save(this.state);
      return;
    }
    this.props.updateCompany(this.state)
  }

  render() {
    return (
      <Form id="companyForm" onSubmit={this.onSubmit}>
        <Row>
          <Col md={6}>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="name">
                <Form.Label>Nombre de aseguradora</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.name} />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="tolerance">
                <Form.Label>Días de tolerancia</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.tolerance} type={'number'} />
              </Form.Group>
            </Form.Row>
          </Col>
          <Col md={6}>
            <Row>
              <Col md="6">
                <h5 className="swal-title form-title align-left">Claves</h5>
              </Col>
              <Col md="6">
                <Button variant="info" onClick={this.createAbbreviation}>AGREGAR</Button>
              </Col>
            </Row>
            {this.state.abbreviations.map((value, index) => {
              return (
                <Form.Row key={index}>
                  <Form.Group as={Col} md="10">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control required onChange={(e) => { this.onChangeAbbreviationName(index, e) }} value={this.state.abbreviations[index].name} />
                  </Form.Group>
                  <Col md="1">
                    <Button variant="danger" onClick={() => { this.deleteAbbreviation(index) }}><i className="fa fa-trash" /></Button>
                  </Col>
                </Form.Row>
              );
            })}
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default CompanyForm;