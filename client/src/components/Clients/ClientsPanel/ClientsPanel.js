import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap';
import { connect } from "react-redux";
import { getClients, updateClient, deleteClient, registerClient } from "../../../actions/registerClient";
import swal from '@sweetalert/with-react';

import ClientsForm from "../ClientsForm/ClientsForm";
import ClientModal from '../ClientModal/ClientModal'
import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";

// Import React Table
import ReactTable from "react-table";

import "react-select/dist/react-select.css";


import "react-table/react-table.css";
import "./ClientsPanel.css";


class ClientsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      select2: undefined,
      data: [],
      fieldTranslation: {
        comments: "Comentarios",
        contacts: "Contacto ",
        email: "Correo",
        name: "Nombre",
        observation: "Observaciones",
        telephone: "Teléfono",
        created_at: "Fecha de alta",
        languages: "Lenguajes",
        name: "Nombre",
        person_type: "Tipo de Persona",
        rfc: "RFC"
      },
      excludedFields: ['__v', '_id']
    };
  }

  async componentDidMount() {
    this.props.getClients().then(data => {
      this.setState({ data: data.clients });
    });
  }

  refresh = () => {
    this.props.getClients().then(data => {
      this.setState({ data: data.clients });
    });
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

  registerClient = (clientData) => {
    this.props.registerClient(
      clientData,
      this.props.history)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Cliente guardado</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar al cliente</h2>,
          });
        }
        this.refresh();
      });
  }

  updateClient = (clientData) => {
    this.props.updateClient(
      clientData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Cliente actualizado</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar al cliente</h2>,
          });
        }
        this.refresh();
      });
  }

  addClient = e => {
    swal({
      title: `Registro de cliente`,
      text: "Captura los datos del nuevo cliente",
      className: "width-800pt", 
      content: <ClientsForm save={this.registerClient}></ClientsForm>,
      buttons: false
    })
  }

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

  openModificationModal(client) {
    swal({
      content: <ClientModal
        client={client}
        updateClient={this.updateClient}
        deleteClient={this.deleteClient}>
      </ClientModal>,
      buttons: false,
      title: `${client.name}`,
      className: "width-800pt"
    });
  }

  deleteClient = (id, name, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar a ${name}?`,
      text: "Una vez eliminado ya no podras recuperarlo!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmDelete(id);
          swal("Puf! Tu usuario se ha eliminado!", {
            icon: "success",
          });
          this.refresh();
        }
      });
  }

  confirmDelete = (id) => {
    this.props.deleteClient(id);
  }

  validateField = (field) => {
    if(field) return field;
    return '';
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Container fluid className="mt-4">
            <Row>
              <h2>Clientes</h2>
            </Row>
            <Row className="mt-4">
              <a onClick={this.addClient} className="btn-primary">Registrar nuevo</a>
            </Row>
          </Container>
          <br />
          <div className="full-width">
            <ReactTable
              data={data}
              filterable
              filtered={this.state.filtered}
              onFilteredChange={(filtered, column, value) => {
                this.onFilteredChangeCustom(value, column.id || column.accessor);
              }}
              defaultFilterMethod={(filter, row, column) => {
                if (filter.id !== "email") {
                  filter.value = filter.value.toUpperCase();
                }
                const id = filter.pivotId || filter.id;
                if (typeof filter.value === "object") {
                  return row[id] !== undefined
                    ? filter.value.indexOf(row[id]) > -1
                    : true;
                } else {
                  if (row[id] !== undefined) {
                    return row[id] !== undefined
                      ? String(row[id]).indexOf(filter.value) > -1
                      : true;
                  }
                }
              }}
            columns={[{
              Header: "Datos",
              columns: [
                {
                  Header: "Nombre",
                  id: "name",
                  accessor: d => this.validateField(d.name)
                },
                {
                  Header: "RFC/Razon social",
                  id: "rfc",
                  accessor: d => this.validateField(d.rfc)
                },
                {
                  Header: "Correo",
                  id: "email",
                  accessor: d => {
                    if(d.contacts[0]){
                      return d.contacts[0].email;
                    }
                    return '';
                  }
                },
                {
                  Header: "Telefono",
                  id: "telephone",
                  accessor: d => {
                    if(d.contacts[0]){
                      return d.contacts[0].telephone;
                    }
                    return '';
                  },
                },
                {
                  Header: "Estado",
                  id: "state",
                  accessor: d => this.validateField(d.state)
                },
                {
                  Header: "Ciudad",
                  id: "city",
                  accessor: d => this.validateField(d.city)
                }
              ]
            }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            getTrProps={this.getTrProps}
          />
          </div>
        </Container>
        <ExportDataToCSV csvData={this.state.data} fileName={'clientes'} fieldTranslation={this.state.fieldTranslation} excludedFields={this.state.excludedFields}></ExportDataToCSV>
      </React.Fragment>
    );
  }
}

ClientsPanel.propTypes = {
  getClients: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getClients, updateClient, deleteClient, registerClient }
)(ClientsPanel);
