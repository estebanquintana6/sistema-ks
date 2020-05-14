import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  Card,
  Col,
  Button,
  Form,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'

import { connect } from "react-redux";
import { differenceBy } from 'lodash'
import swal from '@sweetalert/with-react';

import "react-table/react-table.css";
import "./InsuranceTypeComponent.css";

class InsuranceTypesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailed: false,
      addingCompany: false
    };
  }

  toggleDetail = () => {
    this.setState((prevState) => {
      return { ...prevState, detailed: !prevState.detailed }
    })
    console.log('CHANGE', this.state)
  }

  toggleAddingCompany = insuranceType => {
    console.log(insuranceType)
    swal({
      title: `Ramo de ${insuranceType.name}`,
      icon: "info",
      content:
        <Form.Group controlId="newCompany" onChange={this.addCompany}>
          <Form.Label>Aseguradoras</Form.Label>
          <Form.Control as="select">
            <option></option>
            {this.assignableCompanies().map((company, index) => <option key={index} value={company._id}>{company.name}</option>)}
          </Form.Control>
        </Form.Group>,
      buttons: false
    })
  }

  addCompany = e => {
    if (!e.target.value) return;
    const companyId = e.target.value;
    const companyData = { _id: companyId }
    this.props.addCompany(companyData, this.props.insuranceType._id)
    this.setState({ [e.target.id]: e.target.value, addingCompany: false });
  }

  deleteCompany = id => {
    const companyId = id;
    this.props.deleteCompany(this.props.insuranceType._id, companyId);
    this.setState({ detailed: false })
  }

  assignableCompanies = () => {
    // array A -  array B
    return differenceBy(this.props.companies, this.props.insuranceType.companies, 'name')
  }

  render() {
    const { insuranceType } = this.props
    return (
      <Col md="6" className="mt-4">
        <Card>
          <Card.Header>
            {insuranceType.name}
          </Card.Header>
          <Card.Body>
            <ListGroup className="list-group-flush">
              {insuranceType.companies.map((company, index) => {
                return (
                  <ListGroupItem key={index}>
                    {company.name}
                    <Button variant="danger" className="float-right" onClick={this.deleteCompany.bind(this, company._id)}>
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <Button variant="info" className="float-right" onClick={this.toggleAddingCompany.bind(this, insuranceType)}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    )
  }
}

InsuranceTypesComponent.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(InsuranceTypesComponent);