import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap';
import { connect } from "react-redux";
import { getClients } from "../../../actions/registerClient";

import swal from '@sweetalert/with-react';

import ReactTable from "react-table";

import SinesterForm from "../SinesterForm/SinesterForm"


import "react-table/react-table.css";


class SinesterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    this.prepareClientsForForm();
  }

  prepareClientsForForm = () => {
    this.props.getClients().then(data => {
      this.setState({ clients: data.clients });
    });
  }

  refresh = () => {
    
  }

  onFilteredChangeCustom = (value, accessor) => {
    let filtered = this.state.filtered;
    let insertNewFilter = 1;

    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) filtered.splice(i, 1);
          else filter["value"] = value;

          insertNewFilter = 0;
        }
      });
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value });
    }

    this.setState({ filtered: filtered });
  };

  getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
      return {
        style: {
          cursor: "pointer"
        },
        onClick: (e) => {
          this.openModificationModal(rowInfo.original);
        }
      }
    }
    return {};
  }

  validateField = (field) => {
    if(field) return field;
    return '';
  }

  createSinester = () => {
    swal({
      title: `Registro de siniestro`,
      text: "Captura los datos del siniestro",
      className: "width-800pt", 
      content: <SinesterForm clients={this.state.clients}></SinesterForm>,
      buttons: false
    })
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Container fluid className="mt-4">
            <Row>
              <h2>Siniestros</h2>
            </Row>
            <Row className="mt-4">
              <a onClick={this.createSinester} className="btn-primary">Registrar nuevo</a>
            </Row>
          </Container>
          <br />
          <div className="full-width">
            
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

SinesterPanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getClients }
)(SinesterPanel);
