import React, { Component } from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getClients, updateClient, deleteClient } from "../../../actions/registerClient";
import { ExportClientCSV } from "../../ExportCSV/ExportCSV";

import swal from '@sweetalert/with-react';

import "react-select/dist/react-select.css";

// Import React Table
import ReactTable from "react-table";

import ClientModal from "../ClientModal/ClientModal";

import "react-table/react-table.css";
import "./ClientsReport.css";


class ClientsReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: [],
            select2: undefined
        };
    }

    async componentDidMount(){
      this.props.getClients().then(data => {
          this.setState({data: data.clients});
      });
    }

    getTrProps = (state, rowInfo, instance) => {
      if (rowInfo) {
        if(rowInfo.row.origen === "SECOM"){
          return {
            style: {
              cursor: "pointer",
              background: "#447abd",
              color: 'white'
            },
            onClick: (e) => {
              this.openModificationModal(rowInfo.original);
            }
          }
        } else {
          return {
            style: {
              cursor: "pointer"
            },
            onClick: (e) => {
              this.openModificationModal(rowInfo.original);
            }
          }
        }
      }
      return {};
    }

    refresh = () => {
      this.props.getClients().then(data => {
        this.setState({data: data.clients});
      });
    }

    openModificationModal(client) {
      swal({
        content: <ClientModal client={client} update={this.props.updateClient} refresh={this.refresh} delete={this.props.deleteClient}></ClientModal>,
        buttons: false
      }).then(results => {
 
      })
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


      render() {
        const { data } = this.state;
        return (
          <div className="full-width">
            <ReactTable
              data={data}
              filterable
              filtered={this.state.filtered}
              onFilteredChange={(filtered, column, value) => {
                this.onFilteredChangeCustom(value, column.id || column.accessor);
              }}
              defaultFilterMethod={(filter, row, column) => {
                if(filter.id !== "email" ){
                  filter.value = filter.value.toUpperCase();
                }                
                const id = filter.pivotId || filter.id;
                if (typeof filter.value === "object") {
                  return row[id] !== undefined
                    ? filter.value.indexOf(row[id]) > -1
                    : true;
                } else {
                  if(row[id] !== undefined){
                    return row[id] !== undefined
                      ? String(row[id]).indexOf(filter.value) > -1
                      : true;
                  }
                }
              }}
              columns={[
                {
                  Header: "Datos",
                  columns: [
                    {
                      Header: "Origen",
                      accessor: "origen"
                    },
                    {
                        Header: "Razon",
                        accessor: "razon_social"
                    },
                    {
                      Header: "Nombre",
                      id: "name",
                      accessor: d => { 
                        if(d.last_name1 && d.last_name2){
                          return d.name + " " + d.last_name1 + " " + d.last_name2 
                        }
                        else if(d.last_name1 && !d.last_name2){
                          return d.name + " " + d.last_name1;
                        } else{
                          return d.name
                        }
                      }
                    },
                    {
                        Header: "Sexo",
                        id: "sexo",
                        accessor: d => d.sexo
                    },
                    {
                        Header: "Ocupacion",
                        id: "ocupacion",
                        accessor: d => d.ocupacion
                    },
                    {
                        Header: "E. Civil",
                        id: "civil",
                        accessor: d => d.civil
                    }
                  ]
                },
                {
                  Header: "Ubicacion",
                  columns: [
                    {
                      Header: "Edo.",
                      id: "estado",
                      accessor: d => d.estado
                    },
                    {
                        Header: "Col.",
                        id: "colonia",
                        accessor: d => d.colonia
                    },
                    {
                        Header: "C.P",
                        id: "cp",
                        accessor: d => d.cp
                    }
                  ]
                },
                {
                    Header: "Contacto",
                    columns: [{
                        Header: "Email",
                        id: "email",
                        accessor: d => d.email
                    },
                    {
                        Header: "Tel.",
                        id: "telefono",
                        accessor: d => d.telefono
                    },
                    {
                        Header: "Whats",
                        id: "whatsapp",
                        accessor: d => d.whatsapp
                    },
                    {
                        Header: "Fecha llamada",
                        id: "callDate",
                        accessor: d => d.callDate
                    }
                    ]
                },
                {
                    Header: "Productos",
                    columns: [{
                        Header: "Productos",
                        id: "productos",
                        accessor: d => {
                            let arr = d.productos;
                            let result = "";
                            for(let i in arr){
                                let prod = arr[i];

                                result = result + " " + prod;
                            }
                            return result;
                        }
                    }, 
                    {
                        Header: "Gastos medicos",
                        id: "gastosmedicos",
                        accessor: d => d.gastosmedicos
                    },
                    {
                        Header: "Seguro vida",
                        id: "segurovida",
                        accessor: d => d.segurovida
                    },
                    {
                        Header: "Afore",
                        id: "afore",
                        accessor: d => d.afore
                    }
                    ]
                }
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
              getTrProps={this.getTrProps}
            />
            <div className="row">
              <div className="col-md-4 center mt-4">
                  <ExportClientCSV csvData={this.state.data} fileName="reporteClientes" />
              </div>
            </div>

          </div>
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
    { getClients, updateClient, deleteClient }
  )(withRouter(ClientsReport));