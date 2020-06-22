/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap'
import { connect } from "react-redux";
import { createInsurance, deleteInsurance, updateInsurance, getAllInsurances, cancelInsurance, activateInsurance, changePayStatus, removeFile, download, saveFile } from "../../../actions/insuraceActions";
import { getClients } from "../../../actions/registerClient";
import { getCompanies } from "../../../actions/companyActions";
import swal from '@sweetalert/with-react';

import InsuranceForm from "../InsuranceForm/InsuranceForm";
import InsuranceModal from "../InsuranceModal/InsuranceModal";

// Import React Table
import ReactTable from "react-table";

import "react-table/react-table.css";
import "./GeneralInsurancePanel.css";

import moment from 'moment';
import {formatShortDate, formatDateObj} from '../../component-utils';
import { DateRangePicker } from 'react-dates';
import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";


class GeneralInsurancePanel extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();

    this.state = {
      filtered: [],
      select2: undefined,
      beginStartDate: "",
      beginEndDate: "",
      payDueDateStartDate: "",
      payDueDateEndDate: "",
      dueDateStartDate: "",
      dueDateEndDate: "",
      data: [],
      clients: [],
      companies: [],
      excludedFields: ['__v', '_id', 'active_status', 'endorsements', 'comments', 'status', 'created_at', 'tolerance', 'state', 'city', 'postal_code', 'gender', 'contacts', 'begin_date', 'invoices', 'cancelation_note', 'car_model', 'languages']
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
    this.props.getAllInsurances().then(data => {
      this.setState({ data: data.insurances });
    });
  }

  generateFieldsTranslation = () => {
    let resObj = {
      _id: "id",
      client: "Contratante",
      person_type: "Tipo de persona",
      rfc: "RFC",
      colective_insurance: "Tipo de póliza",
      currency: "Moneda",
      due_date: "Fecha de vencimiento",
      endorsements: "Endosos",
      insurance: "Compañia",
      email: "Email",
      bounty: "Prima",
      insurance_company: "Aseguradora",
      insurance_type: "Producto",
      invoice: "Número de recibo",
      payment_status: "Estatus de pago",
      pay_due_date: "Fecha vto. pago",
      pay_limit: "Vigencia",
      pay_status: "Status",
      payment_type: "Tipo de pago",
      policy: "Póliza",
    }

    return resObj
  }

generateHeaders = () => {
  let resArr = ['Contratante Tipo de persona', 'Contratante', 'Contratante RFC', 'Póliza', 'Producto', 'Tipo de póliza', 'Moneda', 'Fecha de vencimiento', 'Tipo de pago', 'Aseguradora']

  return resArr
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
      if(!rowInfo.original.active_status){
        return {
          style: {
            cursor: "pointer",
            backgroundColor: "#ccc"
          },
          onClick: (e) => {
            this.openModificationModal(rowInfo.original);
          }
        }      }
      return {
        style: {
          cursor: "pointer",
        },
        onClick: (e) => {
          this.openModificationModal(rowInfo.original);
        }
      }
    }
    return {};
  }

  openModificationModal(insurance) {
    let cancelation_note = "";

    if(!insurance.active_status) cancelation_note = `NOTA DE CANCELACIÓN: ${insurance.cancelation_note}`;

    swal({
      text: `${cancelation_note}`,
      content: <InsuranceModal
        type={insurance.insurance_type}
        insurance={insurance}
        clients={this.state.clients}
        companies={this.state.companies}
        updateInsurance={this.updateInsurance}
        deleteInsurance={this.deleteInsurance}
        cancelInsurance={this.cancelInsurance}
        activateInsurance={this.activateInsurance}
        changePayStatus={this.changePayStatus}
        download={this.download}
        removeFile={this.removeFile}
        refresh={this.refresh}
        saveFile={this.saveFile}>
      </InsuranceModal>,
      buttons: false,
      title: `Póliza: ${insurance.policy}`
    });
  }

  saveFile = (file, id) => {
    this.props.saveFile(file, id);
  }

  download = (file) => {
    this.confirmDownload(file);
  }

  removeFile = (file, clientId) => {
    console.log(file);
    this.props.removeFile(file, clientId);
    this.refresh();
  }

  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    console.log('B64', b64Data)
    console.log(contentType)
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    console.log('BA', byteArrays)
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  determineContentType = (extension) => {
    return extension === 'PDF' ? 'application/pdf' : `image/${extension}`
  }

  confirmDownload  = async (file) => {
    try {
      const response = await this.props.download(file)
      const data = response.data
      const  {encoded, fullName, extension} = data
      console.log('DATA', data)
      const contentType = this.determineContentType(extension)
      const blob = this.b64toBlob(encoded, contentType);
      const blobUrl = URL.createObjectURL(blob);
      console.log('RESPONSE', blobUrl, contentType, blob)
      var a = document.createElement('A');
      a.href = blobUrl;
      a.download = `${fullName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch(err) {

    }
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

  cancelInsurance = (insurance, note, e) => {
    swal({
      title: `¿Estas seguro de querer cancelar ${insurance.policy}?`,
      text: `Nota de cancelación: ${note}`,
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmCancel(insurance._id, note);
          swal("Tu poliza se ha cancelado!", {
            icon: "success",
          }).then(() =>{
            this.refresh();
          });
        }
      });  
  }

  activateInsurance = (insurance, e) => {
    swal({
      title: `¿Estas seguro de querer activar ${insurance.policy}?`,
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmActivation(insurance._id);
          swal("Tu poliza se ha activado!", {
            icon: "success",
          }).then(() =>{
            this.refresh();
          });
        }
      });  
  }

  changePayStatus = (insurance, e) => {
    swal({
      title: `¿Estas seguro de querer cambiar el estatus de pago de ${insurance.policy}?`,
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmPayChange(insurance._id);
          swal("Tu poliza ha cambiado!", {
            icon: "success",
          }).then(() =>{
            this.refresh();
          });
        }
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

  validateField = (field) => {
    if(field) return field;
    return '';
  }

  confirmDelete = (id) => {
    this.props.deleteInsurance(id);
  }

  confirmCancel = (id, note) => {
    this.props.cancelInsurance(id, note);
  }

  confirmActivation = (id) => {
    this.props.activateInsurance(id);
  }

  confirmPayChange = (id) => {
    this.props.changePayStatus(id);
  }

  render() {
    this.refresh();

    const { data } = this.state;
    const { variant } = this.props;
    let excelToExport = [];

    const current = this.reactTable.current;
    if (current)
    {
      const allData = current.getResolvedState().sortedData;
      excelToExport = allData.map((data) => data._original)
    }
    

    const columns = [{
      Header: "Datos",
      columns: [
        {
          Header: "Aseguradora",
          id: "insurance_company",
          width: 90,
          accessor: d => this.validateField(d.insurance_company.name)
        },
        {
          Header: "Cliente",
          id: "client",
          accessor: d => {
            if(d.client){
              return this.validateField(d.client.name)
            } else {
              return '';
            }
          }
        },
        {
          Header: "Poliza",
          id: "policy",
          width: 140,
          accessor: d => this.validateField(d.policy)
        },
        {
          Header: "Forma de pago",
          id: "payment_type",
          width: 140,
          accessor: d => this.validateField(d.payment_type)
        },
        {
          Header: "Fecha inicio",
          id: "begin_date",
          width: 130,
          Cell: c => <span>{c.original.begin_date && formatShortDate(c.original.begin_date)}</span>,
          accessor: d => moment(d.begin_date).unix(),
          filterable: false
        },
        {
          Header: "Fecha vencimiento",
          id: "due_date",
          Cell: c => <span>{c.original.due_date && formatShortDate(c.original.due_date)}</span>,
          accessor: d => moment(d.due_date).unix(),
          width: 300,
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
            const res = row[filter.id] !== undefined ? moment.unix(row[filter.id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') : true 
            return res
          }
        },
        {
          Header: "Vto. pago",
          id: "pay_due_date",
          Cell: c => {
            if(c.original.invoices.length > 0){
              const currentDate = new Date();
              currentDate.setHours(0,0,0);

              const dates = [];
              const allDates = [];

              c.original.invoices.map((invoice) => {
                let due_date = new Date(invoice.due_date);
                due_date.setDate(due_date.getDate() + 1);
                due_date.setHours(0,0,0);

                if(due_date >= currentDate) dates.push(due_date);
                allDates.push(due_date);
              });

            if(dates.length !== 0){
              const minDate = new Date(Math.min.apply(null,dates));
              return <span>{formatDateObj(minDate)}</span>
            } else {
              const maxDate = new Date(Math.max.apply(null,allDates));
              return <span>{formatDateObj(maxDate)}</span>
            }
          }
          
          },
          accessor: d => {
            if(d.invoices.length === 1){
              return moment(d.invoices[0].due_date);
            }
            else if(d.invoices.length > 0){
              const currentDate = new Date();
              currentDate.setHours(0,0,0);

              const dates = [];
              const allDates = [];

              d.invoices.map((invoice) => {
                let due_date = new Date(invoice.due_date);
                due_date.setDate(due_date.getDate() + 1);
                due_date.setHours(0,0,0);

                if(due_date >= currentDate) dates.push(due_date);
                allDates.push(due_date);
              });
              
              if(dates.length !== 0){
                const minDate = new Date(Math.min.apply(null,dates));
              return moment(minDate).unix();
              } else {
                const maxDate = new Date(Math.max.apply(null,allDates));
                return moment(maxDate).unix();
              }
              
            } else {
              return "SIN RECIBOS";
            }

          },
          width: 300,
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
            const res = row[filter.id] !== undefined ? moment.unix(row[filter.id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') : true 
            return res
          }
        },
        {
          Header: "Status",
          id: "pay_status",
          accessor: d => this.validateField(d.pay_status)
        },
      ]
    }
    ];

    return (
      <React.Fragment>
        <Container fluid className="mt-4">
          <Row>
            <h2>Pólizas {variant}</h2>
          </Row>
        </Container>
        <br />
        <div className="full-width">
          <ReactTable
            ref={this.reactTable}
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
                const res = row[id] !== undefined ? moment.unix(row[id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') : true 
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
            columns={columns}
            defaultPageSize={10}
            className="-striped -highlight"
            getTrProps={this.getTrProps}
          />
          <div className="row">
            <div className="col-md-4 center mt-4">
              {/* <ExportClientCSV csvData={this.state.data} fileName="reporteClientes" /> */}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4 center mt-4">
            <ExportDataToCSV csvData={excelToExport} fileName={`reporteSeguros_${this.props.variant}`} onComplete={this.refresh} fieldTranslation={this.generateFieldsTranslation()} excludedFields={this.state.excludedFields} header={this.generateHeaders()} sortableColumn={'Contratante'}></ExportDataToCSV>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

GeneralInsurancePanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getClients, getCompanies, createInsurance, deleteInsurance, updateInsurance, getAllInsurances, cancelInsurance, activateInsurance, changePayStatus, removeFile, download, saveFile }
)(GeneralInsurancePanel);
