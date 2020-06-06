import React, { Component } from "react";
import PropTypes from "prop-types";

import { Container, Row } from 'react-bootstrap'

import { connect } from "react-redux";
import { getInvoices, updateInvoice, deleteInvoice } from "../../../actions/invoiceActions";
import {formatShortDate} from '../../component-utils'
import { DateRangePicker } from 'react-dates';

import ReactTable from "react-table";


import "react-table/react-table.css";

import moment from 'moment';

import InvoicesModal from "../InvoicesModal/InvoicesModal";
import swal from '@sweetalert/with-react';

import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";



class InvoicePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: [],
            payDueDateStartDate: moment().startOf('month'),
            payDueDateEndDate: moment().startOf('month'),
            dueDateStartDate: moment().startOf('month'),
            dueDateEndDate: moment().startOf('month')
        }
      }

    async componentDidMount() {
        this.props.getInvoices().then(data => {
            this.setState({ data: data.invoices });
        });
    }

    refresh = () => {
        this.props.getInvoices().then(data => {
          this.setState({ data: data.invoices });
        });
    }

    onFilteredChangeCustom = (value, accessor) => {
        const notFilterable = ['due_date', 'pay_limit']
        // if (Object.keys(value).includes(null)) return;
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
    
        if (insertNewFilter || notFilterable.includes(accessor)) {
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

    openModificationModal(invoice) {
      swal({
        content: <InvoicesModal
          invoice={invoice}
          updateInvoice={this.updateInvoice}
          deleteInvoice={this.deleteInvoice}>
        </InvoicesModal>,
        buttons: false,
        title: `Recibo: ${invoice.invoice}`
      });
    }

    updateInvoice = (invoiceData) => {
      this.props.updateInvoice(
        invoiceData)
        .then((response) => {
          const { status } = response;
          if (status === 200) {
            swal({
              icon: "success",
              content: <h2>Recibo Actualizado</h2>,
            });
          } else {
            swal({
              icon: "error",
              content: <h2>Error al guardar el recibo</h2>,
            });
          }
          this.refresh();
        });
    }

    deleteInvoice = (invoiceId, e) => {
      swal({
        title: `¿Estas seguro de querer eliminar el recibo?`,
        text: "Una vez eliminado ya no podras recuperarlo!",
        icon: "warning",
        buttons: true,
        sucessMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            this.confirmDelete(invoiceId);
            swal("Recibo eliminado!", {
              icon: "success",
            });
          }
        }).finally(()=> {
          this.refresh();
        });
    }
  
    confirmDelete = (invoiceId) => {
      this.props.deleteInvoice(invoiceId);
    }

    validateField = (field) => {
      if(field) return field;
      return '';
    }


    render() {
        const { data } = this.state;
        return (
            <React.Fragment>
                    <Container fluid className="mt-4 mb-4">
                        <Row>
                        <h2>Recibos</h2>
                        </Row>
                    </Container>    
                    <div className="full-width">
                        <ReactTable
                        data={data}
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={(filtered, column, value) => {
                            this.onFilteredChangeCustom(value, column.id || column.accessor);
                        }}
                        defaultFilterMethod={(filter, row, column) => {
                            const notFilterable = ['due_date', 'pay_limit']

                            if(notFilterable.includes(filter.id)) {
                                const id = filter.pivotId || filter.id;
                                const res = row[id] !== undefined ? moment.unix(row[id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') :true
                                return res
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
                                Header: "Cliente",
                                id: "client_name",
                                accessor: d => {
                                  if(d.client){
                                    return this.validateField(d.client.name)
                                  }
                                }
                            },
                            {
                                Header: "Póliza",
                                id: "policy",
                                accessor: d => {
                                  if(d.insurance){
                                    return this.validateField(d.insurance.policy)
                                  }
                                }
                            },
                            {
                                Header: "Recibo",
                                id: "recibo",
                                accessor: d => d.invoice
                            },
                            {
                                Header: "Fecha vto.",
                                id: "due_date",
                                width: 350,
                                Cell: c => <span>{c.original.due_date && formatShortDate(c.original.due_date)}</span>,
                                accessor: d => moment(d.due_date).unix(),
                                Filter: ({filter, onChange}) => (
                                    <DateRangePicker
                                      startDateId="start3"
                                      endDateId="end3"
                                      startDate={this.state.dueDateStartDate}
                                      endDate={this.state.dueDateEndDate}
                                      onDatesChange={({ startDate, endDate }) => {
                                        this.setState({ dueDateStartDate: startDate, dueDateEndDate: endDate }); 
                                        onChange({startDate, endDate});}}
                                      focusedInput={this.state.focusedInput1}
                                      onFocusChange={focusedInput => this.setState({ focusedInput1: focusedInput })}
                                      isOutsideRange={() => false}
                                      withPortal={true}
                                      showClearDates={true}
                                    />
                                  ),
                                  filterMethod: (filter, row) => {
                                    if (filter.value.startDate === null || filter.value.endDate === null) {
                                      // Incomplet or cleared date picker
                                      return true
                                    }
                                    const res = row[filter.id] !== undefined ? moment.unix(row[filter.id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') : true 
                                    return res
                                  }
                            },
                            {
                              Header: "Monto",
                              id: "bounty",
                              accessor: d => d.bounty
                            },
                            {
                              Header: "Status",
                              id: "payment_status",
                              accessor: d => d.payment_status
                            },
                            ]
                        }
                        ]}
                        defaultPageSize={10}
                        className="-striped -highlight"
                        getTrProps={this.getTrProps}
                        />
                    </div>
                    <div className="row">
                      <div className="col-md-4 center mt-4">
                      <ExportDataToCSV csvData={this.state.filtered} 
                                      fileName={'reporteRecibos'} 
                                      type="invoices"
                                      onComplete={this.refresh}
                                      fieldTranslation={()=>{return []}} 
                                      excludedFields={() => {return []}} 
                                      header={['EMPRESA', 'RECIBO', 'PRODUCTO', 'PRIMA', 'STATUS', 'VENCIMIENTO DE PAGO']}>                
                      </ExportDataToCSV>
                      </div>
                    </div>
            </React.Fragment>
        );
    }

}

InvoicePanel.propTypes = {
    getInvoices: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });


export default connect(
    mapStateToProps,
    { getInvoices, updateInvoice, deleteInvoice }
)(InvoicePanel);
  