import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Container, Button, Card, ListGroup } from 'react-bootstrap'
import "react-select/dist/react-select.css";
import "react-table/react-table.css";
import "./InsuranceTypeComponent.css";
import { differenceBy } from 'lodash'

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

  toggleAddingCompany = () => {
    this.setState((prevState) => {
      return { ...prevState, addingCompany: !prevState.addingCompany }
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
      <Card>
        <Card.Header>
          <h5 onClick={this.toggleDetail}>{insuranceType.name}</h5>
          {this.state.addingCompany === true ?
            <select id="newCompany" onChange={this.addCompany}>
              <option>-</option>
              {this.assignableCompanies().map((company, index) => <option key={index} value={company._id}>{company.name}</option>)}
            </select> :
            <Button onClick={this.toggleAddingCompany}>Agregar Aseguradora</Button>
          }
        </Card.Header>
        <ListGroup>
          {insuranceType.companies.map((company, index) =>
            this.state.detailed &&
            <ListGroup.Item key={index}>{company.name} <Button onClick={this.deleteCompany.bind(this, company._id)}>Agregar Aseguradora</Button></ListGroup.Item>)
          }
        </ListGroup>
      </Card>
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