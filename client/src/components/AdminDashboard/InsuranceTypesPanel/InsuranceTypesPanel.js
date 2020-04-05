import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Container, Button } from 'react-bootstrap'
import swal from '@sweetalert/with-react';
import "react-select/dist/react-select.css";
import "react-table/react-table.css";
import "./InsuranceTypesPanel.css";
import InsuranceTypeComponent from "./InsuranceTypeComponent/InsuranceTypeComponent";
import { getInsuranceTypes, addCompanyToInsuranceType, deleteCompanyFromInsuranceType } from '../../../actions/insuranceTypesActions'
import { getCompanies } from '../../../actions/companyActions'

class InsuranceTypesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      companies: []
    };
  }

  async componentDidMount() {
    this.refresh();
    this.props.getCompanies().then(data => {
      this.setState({ companies: data.companies });
    });
  }

  refresh = () => {
    this.props.getInsuranceTypes().then(data => {
      this.setState({ data: data.insuranceTypes });
    });
  }

  addCompany = (companyData, insuranceTypeId) => {
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

  deleteCompany = (insuranceTypeId, companyId, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar la aseguradora del ramo?`,
      text: "Una vez eliminado ya no podras recuperarlo!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmDelete(insuranceTypeId, companyId);
          swal("Tu aseguradora se ha eliminado del ramo!", {
            icon: "success",
          });
          this.refresh();
        }
      });
  }

  confirmDelete = (insuranceTypeId, companyId) => {
    this.props.deleteCompanyFromInsuranceType(insuranceTypeId, companyId);
  }


  render() {
    return (<React.Fragment>
      {this.state.data.map((insuranceType, index) => <InsuranceTypeComponent addCompany={this.addCompany} deleteCompany={this.deleteCompany} companies={this.state.companies} key={index} insuranceType={insuranceType}></InsuranceTypeComponent>)}
    </React.Fragment>)
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
  { getInsuranceTypes, addCompanyToInsuranceType, deleteCompanyFromInsuranceType, getCompanies }
)(InsuranceTypesPanel);