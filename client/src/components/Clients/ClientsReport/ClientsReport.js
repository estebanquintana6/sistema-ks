import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap'
import { connect } from "react-redux";
import { getClients, updateClient, deleteClient, registerClient } from "../../../actions/registerClient";
import { ExportClientCSV } from "../../ExportCSV/ExportCSV";
import swal from '@sweetalert/with-react';

import ClientForm from "../ClientsForm/ClientsForm";


import "react-select/dist/react-select.css";
// Import React Table
import ReactTable from "react-table";


import "react-table/react-table.css";
import "./ClientsReport.css";


class ClientsReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      select2: undefined,
      data: []
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
                  const {status} = response;
                  if(status === 200){
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

  addClient = e => {
    swal({
      title: `Registro de cliente`,
      text: "Captura los datos del nuevo cliente",
      content: <ClientForm save={this.registerClient}></ClientForm>,
      buttons: false
    })
    //this.props.history.push('/dashboard/clientes/new')
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Row>
          <h2>Clientes</h2>
        </Row>
        <Container className="mt-4">
          <Row>
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
                  accessor: d => d.name
                },
                {
                  Header: "Apellido",
                  id: "last_name",
                  accessor: d => d.last_name
                },
                {
                  Header: "Telefono",
                  id: "telephone",
                  accessor: d => d.telephone
                },
                {
                  Header: "Correo",
                  id: "email",
                  accessor: d => d.email
                },
                {
                  Header: "RFC/Razon social",
                  id: "rfc",
                  accessor: d => d.rfc
                },
                {
                  Header: "Opciones",
                  id: "options",
                }
              ]
            }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <div className="row">
            <div className="col-md-4 center mt-4">
              <ExportClientCSV csvData={this.state.data} fileName="reporteClientes" />
            </div>
          </div>

        </div>
      </React.Fragment>
    );
  }
}

ClientsReport.propTypes = {
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
)(ClientsReport);
