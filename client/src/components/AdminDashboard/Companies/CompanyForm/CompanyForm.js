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
          <Col md={12}>
            <Form.Row>
              <Form.Group as={Col} md={{ span: 12 }} controlId="name">
                <Form.Label>Nombre de aseguradora</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.name} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md={{ span: 6, offset: 3 }} controlId="tolerance">
                <Form.Label>Días de tolerancia</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.tolerance} type={'number'} />
              </Form.Group>
            </Form.Row>
          </Col>
        </Row>
          <Row className="justify-content-md-center">
              <h5 className="swal-title form-title align-left">CLAVES</h5>
          </Row>
          <Row>
            <Col md="12">
              <Button variant="info" onClick={this.createAbbreviation}><i className="fa fa-plus" aria-hidden="true"></i></Button>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            {this.state.abbreviations.map((value, index) => {
              return (
                <Form.Row key={index}>
                  <Form.Group as={Col} md="8">
                    <Form.Label>Clave</Form.Label>
                    <Form.Control required onChange={(e) => { this.onChangeAbbreviationName(index, e) }} value={this.state.abbreviations[index].name} />
                  </Form.Group>
                  <Col md="4">
                    <Button variant="danger" className="button-margin" onClick={() => { this.deleteAbbreviation(index) }}><i className="fa fa-trash"/></Button>
                  </Col>
                </Form.Row>
              );
            })}
          </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default CompanyForm;