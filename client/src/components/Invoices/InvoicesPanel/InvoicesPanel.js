import React, { Component } from "react";
import PropTypes from "prop-types";

import { Container, Row } from 'react-bootstrap'

import { connect } from "react-redux";
import { getInvoices } from "../../../actions/invoiceActions";
import {formatShortDate} from '../../component-utils'
import { DateRangePicker } from 'react-dates';

import ReactTable from "react-table";


import "react-select/dist/react-select.css";
import "react-table/react-table.css";

import moment from 'moment';


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
            }
          }
        }
        return {};
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
                                console.log(filter.id); 
                                const id = filter.pivotId || filter.id;
                                const res = row[id] !== undefined ? moment(row[id], 'DD/MM/YYYY').clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') :true
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
                                accessor: d => d.client.name
                            },
                            {
                                Header: "Póliza",
                                id: "policy",
                                accessor: d => d.insurance.policy
                            },
                            {
                                Header: "Recibo",
                                id: "recibo",
                                accessor: d => d.invoice
                            },
                            {
                                Header: "Fecha vto.",
                                id: "due_date",
                                accessor: d => formatShortDate(d.due_date),
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
                                    if (moment(row[filter.id]).isBetween(filter.value.startDate, filter.value.endDate)) {
                                      // Found row matching filter
                                      return true
                                    }
                                  }
                            },
                            {
                                Header: "Fecha vto. pago",
                                id: "pay_limit",
                                accessor: d => formatShortDate(d.pay_limit),
                                Filter: ({filter, onChange}) => (
                                    <DateRangePicker
                                      startDateId="start2"
                                      endDateId="end2"
                                      startDate={this.state.payDueDateStartDate}
                                      endDate={this.state.payDueDateEndDate}
                                      onDatesChange={({ startDate, endDate }) => {
                                        this.setState({ payDueDateStartDate: startDate, payDueDateEndDate: endDate }); 
                                        onChange({startDate, endDate});}}
                                      focusedInput={this.state.focusedInput2}
                                      onFocusChange={focusedInput => this.setState({ focusedInput2: focusedInput })}
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
                                    if (moment(row[filter.id]).isBetween(filter.value.startDate, filter.value.endDate)) {
                                      // Found row matching filter
                                      return true
                                    }
                                  }
                            }
                            ]
                        }
                        ]}
                        defaultPageSize={10}
                        className="-striped -highlight"
                        getTrProps={this.getTrProps}
                        />
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
    { getInvoices }
)(InvoicePanel);
  