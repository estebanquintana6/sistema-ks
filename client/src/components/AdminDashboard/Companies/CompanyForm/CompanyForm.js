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
    this.state = {};
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
          <Col>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="name">
                <Form.Label>Nombre de aseguradora</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.name} />
              </Form.Group>
            </Form.Row>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default CompanyForm;