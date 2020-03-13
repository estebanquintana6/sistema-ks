import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import {registerSecom, getSecoms, deleteSecom, makeClient} from "../../../actions/registerSecom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { 
    Button,
    Col, 
    Container, 
    Form,
    Row} from 'react-bootstrap';

import { ExportSecomCSV } from "../../ExportCSV/ExportCSV";

import ReactTable from "react-table";

import moment from "moment";
import cloneDeep from 'lodash/cloneDeep';
import swal from '@sweetalert/with-react';

import "./SecomReport.css"
import "react-table/react-table.css";

class SecomReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filtered: [],
            upperLimit: "",
            lowerLimit: "",
        };

        this.handleUpper = this.handleUpper.bind(this);
        this.handleLower = this.handleLower.bind(this);
    }

    async componentDidMount(){
        moment.locale('es');
        this.pullData();
    }

    pullData = () => {
        this.props.getSecoms().then(data => {
            const secoms = this.parseDate(data.secoms);
            
            this.setState({data: secoms})
            this.setState({filtered: secoms})

            const respaldo = cloneDeep(secoms);
            this.respaldo = respaldo;
        });
    }


    handleUpper(event) {
        this.setState({upperLimit: event.target.value});
    }

    handleLower(event) {
        this.setState({lowerLimit: event.target.value});
    }

    resetFilters(event) {
        this.setState({
            data: this.respaldo,
            filtered: this.respaldo,
            upperLimit: "",
            lowerLimit: ""
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

    parseDate =(data) => {
        let result = [];

        for (var k in data){
            let secom = data[k];
            const nombreCompleto = secom.name + " " + secom.last_name1 + " " + secom.last_name2;
            secom["nombreCompleto"] = nombreCompleto;
            delete secom.name;
            delete secom.last_name1;
            delete secom.last_name2;
            delete secom.__v;

            let date_str = secom.fecha.substr(0, 10);
            var separatedDate = date_str.split("-");

            secom["fecha"] = separatedDate[2] + '/' + separatedDate[1]  + "/" + separatedDate[0];

            if(secom.callDate){
                let date_str = secom.callDate.substr(0, 10);
                separatedDate = date_str.split("-");

                secom["callDate"] = separatedDate[2] + '/' + separatedDate[1]  + "/" + separatedDate[0];
            }
            result.push(secom);
        }

        return result;
    }

    async searchByDate() {
        const result = [];

        let lowerLimit = 0;
        var upperLimit = new Date().getTime();

        if(this.state.lowerLimit){
            lowerLimit = Date.parse(this.state.lowerLimit);
        }

        if(this.state.upperLimit){
            upperLimit = Date.parse(this.state.upperLimit);
        }

        for (var k in this.respaldo){
            let secom = this.respaldo[k];
            let fechDate = moment(secom.fecha, "DD-MM-YYYY");
            if(fechDate.isValid()){
                let callDate = fechDate.toDate().getTime() - 21600000; //utf adds 6 hours
                if(callDate <= upperLimit && callDate >= lowerLimit){
                    result.push(secom);
                }
            }
        }
        this.setState({data: result})
    }

    eliminarSecom = (name, id, e) => {
        swal({
            title: `¿Estas seguro de querer eliminar a ${name}?`,
            text: "Una vez eliminado ya no podras recuperarlo!",
            icon: "warning",
            buttons: true,
            sucessMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              this.props.deleteSecom(id);
              swal("Puf! Tu registro se ha eliminado!", {
                icon: "success",
              });
              this.pullData();
            }
          }); 
    }

    hacerCliente = (name, id, e) => {
        swal({
            title: `¿Estas seguro de querer hacer cliente a ${name}?`,
            icon: "warning",
            buttons: true,
            sucessMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              this.props.makeClient(id);
              swal(`Ahora ${name} es cliente!`, {
                icon: "success",
              }).then(() => {
                this.pullData();
              });

            }
          }); 
    }

    openSecomModal = (secom) => {
        swal({
            content: 
            <Container>
                <Row className="mt-4">
                    <h5 className="text-center">{secom.nombreCompleto}</h5>
                    <table className="buttons">
                        <tr>
                            <td>
                                <Button onClick={this.hacerCliente.bind(this, secom.nombreCompleto, secom._id)}>
                                    Hacer cliente
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={this.eliminarSecom.bind(this, secom.nombreCompleto, secom._id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    </table>
                </Row>
            </Container>,
            buttons:false
        })
    }



    getTrProps = (state, rowInfo, instance) => {
        if (rowInfo) {
            return {
                style: {
                    cursor: "pointer",
                },
                onClick: (e) => {
                    this.openSecomModal(rowInfo.original);
                }
            }
        }
        return {};
    }

    render() {
        const { data } = this.state;

        return(
            <>      
                <Col md="12">
                    <h2>Reporte SECOM</h2>
                </Col>
                <Col className="mt-4">
                    <h6>Busqueda</h6>
                    <Form.Row>
                        <Form.Group as={Col} md="4" controlId="callDate">
                            <Form.Label>De la fecha:</Form.Label>
                            <Form.Control value={this.state.lowerLimit} type="date" placeholder="..." onChange={this.handleLower}  />
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="callDate">
                            <Form.Label>A la fecha:</Form.Label>
                                <Form.Control value={this.state.upperLimit} type="date" placeholder="..." onChange={this.handleUpper}  />
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" type="submit" onClick={this.searchByDate.bind(this)}>
                            Buscar
                    </Button>    
                    <Button variant="primary" type="submit" className="ml-3" onClick={this.resetFilters.bind(this)}>
                            Reiniciar
                    </Button>
                    <ExportSecomCSV title="Exportar"  csvData={this.state.filtered} fileName="reporteSecom" />
                    <div className="mt-4">
                        <ReactTable
                            data={data}
                            filterable
                            filtered={this.state.filtered}
                            onFilteredChange={(filtered, column, value) => {
                                this.onFilteredChangeCustom(value, column.id || column.accessor);
                            }}
                            defaultFilterMethod={(filter, row, column) => {   
                                const id = filter.pivotId || filter.id;
                                filter.value = filter.value.toUpperCase();
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
                                        Header: "Fecha",
                                        accessor: "fecha",
                                        filterable: false,
                                    },
                                    {
                                        Header: "Nombre",
                                        accessor: "nombreCompleto",
                                    },
                                    {
                                        Header: "Campaña",
                                        accessor: "campana",
                                    },
                                    {
                                        Header: "Status",
                                        accessor: "status",
                                    },
                                    {
                                        Header: "Telefono",
                                        accessor: "telefono",
                                    },  
                                    {
                                        Header: "Fecha de llamada",
                                        accessor: "callDate",
                                        filterable: false,
                                    },                                       
                                ]
                                }
                            ]}
                            defaultPageSize={10}
                            className="-highlight"
                            getTrProps={this.getTrProps}
                        >
                        </ReactTable>
                    </div>
                </Col>
        </>
        );
    }

}
SecomReport.propTypes = {
    registerSecom: PropTypes.func.isRequired,
    getSecoms: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

  export default connect(
    mapStateToProps,
    { registerSecom, getSecoms, deleteSecom, makeClient }
  )(withRouter(SecomReport));