import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap'
import { connect } from "react-redux";
import { createInsurance, deleteInsurance, updateInsurance, getInsurances } from "../../../actions/insuraceActions";
import { getClients } from "../../../actions/registerClient";
import { getCompanies } from "../../../actions/companyActions";
import { ExportClientCSV } from "../../ExportCSV/ExportCSV";
import swal from '@sweetalert/with-react';

import InsuranceForm from "../InsuranceForm/InsuranceForm";
import InsuranceModal from "../InsuranceModal/InsuranceModal";


import "react-select/dist/react-select.css";
// Import React Table
import ReactTable from "react-table";



import "react-table/react-table.css";
import "./InsurancePanel.css";

import moment from 'moment'
import {formatShortDate} from '../../component-utils'
import { DateRangePicker } from 'react-dates'


class InsurancePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      select2: undefined,
      beginStartDate: moment().startOf('month'),
      beginEndDate: moment().startOf('month'),
      payDueDateStartDate: moment().startOf('month'),
      payDueDateEndDate: moment().startOf('month'),
      dueDateStartDate: moment().startOf('month'),
      dueDateEndDate: moment().startOf('month'),
      data: [],
      clients: [],
      companies: []
    };
  }

  async componentDidMount() {
    this.prepareClientsForForm();
    this.prepareCompaniesForForm();
    this.refresh();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.variant !== prevProps.variant) {
      // si cambia el tipo de seguro que estamos viendo
      this.refresh()
    }
  }

  refresh = () => {
    this.props.getInsurances(this.props.variant).then(data => {
      this.setState({ data: data.insurances });
    });
  }

  prepareClientsForForm = () => {
    this.props.getClients().then(data => {
      this.setState({ clients: data.clients });
    });
  }

  prepareCompaniesForForm = () => {
    this.props.getCompanies().then(data => {
      this.setState({ companies: data.companies });
    });
  }


  onFilteredChangeCustom = (value, accessor) => {
    const notFilterable = ['begin_date', 'due_date', 'pay_due_date']
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

  openModificationModal(insurance) {
    swal({
      content: <InsuranceModal
        insurance={insurance}
        clients={this.state.clients}
        companies={this.state.companies}
        updateInsurance={this.updateInsurance}
        deleteInsurance={this.deleteInsurance}>
      </InsuranceModal>,
      buttons: false,
      title: `Póliza: ${insurance.policy}`
    });
  }

  addInsurance(variant) {
    swal({
      title: `Registro de póliza de ${variant}`,
      text: "Captura los datos de la nueva póliza",
      content:
        <InsuranceForm
          type={variant}
          clients={this.state.clients}
          companies={this.state.companies}
          save={this.registerInsurance}
          updateInsurance={this.updateInsurance}
          deleteInsurance={this.deleteInsurance}
        >
        </InsuranceForm>,
      className: "width-800pt-100h",
      buttons: false
    });
  }

  registerInsurance = (insuranceData) => {
    this.props.createInsurance(insuranceData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Poliza guardada</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar la poliza</h2>,
          });
        }
        this.refresh();
      });
  }

  updateInsurance = (insuranceData) => {
    this.props.updateInsurance(
      insuranceData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Poliza Actualizada</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar la poliza</h2>,
          });
        }
        this.refresh();
      });
  }

  deleteInsurance = (id, name, e) => {
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
          swal("Puf! Tu poliza se ha eliminado!", {
            icon: "success",
          });
          this.refresh();
        }
      });
  }

  confirmDelete = (id) => {
    this.props.deleteInsurance(id);
  }

  render() {
    const { data } = this.state;
    const { variant } = this.props;
    return (
      <React.Fragment>
        <Container fluid className="mt-4">
          <Row>
            <h2>Pólizas {variant}</h2>
          </Row>
          <Row className="mt-4">
            <a onClick={this.addInsurance.bind(this, variant)} className="btn-primary">Registrar nuevo</a>
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
              const notFilterable = ['begin_date', 'due_date', 'pay_due_date']

              if(notFilterable.includes(filter.id)) {
                const id = filter.pivotId || filter.id;
                const res = row[id] !== undefined ? moment(row[id], 'DD/MM/YYYY').clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') :true 
                return res
              }

              if (filter.id !== "email" && !notFilterable.includes(filter.id)) {
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
                  Header: "RFC Cliente",
                  id: "rfc",
                  accessor: d => d.client.rfc
                },
                {
                  Header: "Cliente",
                  id: "client",
                  accessor: d => d.client.name
                },
                {
                  Header: "Aseguradora",
                  id: "insurance_company",
                  accessor: d => d.insurance_company.name
                },
                {
                  Header: "Poliza",
                  id: "policy",
                  accessor: d => d.policy
                },
                {
                  Header: "Fecha inicio",
                  id: "begin_date",
                  accessor: d => formatShortDate(d.begin_date),
                  width: 330,
                  Filter: ({filter, onChange}) => (
                    <DateRangePicker
                      startDateId="start1"
                      endDateId="end1"
                      startDate={this.state.beginStartDate}
                      endDate={this.state.beginEndDate}
                      onDatesChange={({ startDate, endDate }) => {
                        this.setState({ beginStartDate: startDate, beginEndDate: endDate }); 
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
                  Header: "Fecha pago",
                  id: "pay_due_date",
                  accessor: d => formatShortDate(d.pay_due_date),
                  width: 330,
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
                },
                {
                  Header: "Fecha vto.",
                  id: "due_date",
                  accessor: d => formatShortDate(d.due_date),
                  width: 330,
                  Filter: ({filter, onChange}) => (
                    <DateRangePicker
                      startDateId="start3"
                      endDateId="end3"
                      startDate={this.state.dueDateStartDate}
                      endDate={this.state.dueDateEndDate}
                      onDatesChange={({ startDate, endDate }) => {
                        this.setState({ dueDateStartDate: startDate, dueDateEndDate: endDate }); 
                        onChange({startDate, endDate});}}
                      focusedInput={this.state.focusedInput3}
                      onFocusChange={focusedInput => this.setState({ focusedInput3: focusedInput })}
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

InsurancePanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getClients, getCompanies, createInsurance, deleteInsurance, updateInsurance, getInsurances }
)(InsurancePanel);
