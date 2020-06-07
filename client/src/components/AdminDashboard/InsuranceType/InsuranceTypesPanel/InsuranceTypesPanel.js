import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import swal from '@sweetalert/with-react';


import InsuranceTypeComponent from "../InsuranceTypeComponent/InsuranceTypeComponent";

import { Row } from 'react-bootstrap'

import { getInsuranceTypes, addCompanyToInsuranceType, deleteCompanyFromInsuranceType } from '../../../../actions/insuranceTypesActions'
import { listUsers } from '../../../../actions/userActions';

import "react-table/react-table.css";
import "./InsuranceTypesPanel.css";

class InsuranceTypesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      companies: [],
      update: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.change !== prevProps.change) {
      this.refresh();
      this.refreshCompanies();
    }
  }

  componentDidMount() {
    this.refresh();
    this.refreshCompanies();
  }

  refreshCompanies = () => {
    this.props.listUsers().then(data => {
      this.setState({ users: data });
    });
  }

  refresh = () => {
    this.props.getInsuranceTypes().then(data => {
      this.setState({ data: data.insuranceTypes });
    });
  }

  addUser = (companyData, insuranceTypeId) => {
    this.props.addCompanyToInsuranceType(
      companyData, insuranceTypeId)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Aseguradora añadida</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al añadir aseguradora</h2>,
          });
        }
        this.refresh();
      });
  }

  deleteUser = (insuranceTypeId, email, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar a este encargado del ramo?`,
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmDelete(insuranceTypeId, email);
          swal("El encargado se ha eliminado!", {
            icon: "success",
          }).then(() => {
            this.refresh();
          });
        }
      });
  }

  confirmDelete = (insuranceTypeId, email) => {
    this.props.deleteCompanyFromInsuranceType(insuranceTypeId, email);
  }


  render() {
    return (
      <React.Fragment>
        <Row>
          {this.state.data.map((insuranceType, index) => {
            return (<InsuranceTypeComponent
              addUser={this.addUser}
              deleteUser={this.deleteUser}
              users={this.state.users}
              key={index}
              insuranceType={insuranceType}>

            </InsuranceTypeComponent>)
          })
          }
        </Row>
      </React.Fragment>
    )
  }
}

InsuranceTypesPanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getInsuranceTypes, addCompanyToInsuranceType, deleteCompanyFromInsuranceType, listUsers }
)(InsuranceTypesPanel);