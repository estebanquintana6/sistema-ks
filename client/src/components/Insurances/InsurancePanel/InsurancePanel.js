/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Form, Col, Container, Row } from 'react-bootstrap'
import { connect } from "react-redux";

import {
  createInsurance,
  deleteInsurance,
  updateInsurance,
  getInsurance,
  getInsurances,
  cancelInsurance,
  activateInsurance,
  changePayStatus,
  download,
  removeFile,
  saveFile
} from "../../../actions/insuraceActions";

import { getClients } from "../../../actions/registerClient";
import { getCompanies } from "../../../actions/companyActions";
import swal from '@sweetalert/with-react';

import InsuranceForm from "../InsuranceForm/InsuranceForm";
import InsuranceModal from "../InsuranceModal/InsuranceModal";
import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";

// Import React Table
import ReactTable from "react-table";

import "react-table/react-table.css";
import "./InsurancePanel.css";

import moment from 'moment';
import { formatShortDate, formatDateObj } from '../../component-utils';
import { DateRangePicker } from 'react-dates';


const InsurancePanel = (props) => {
  const reactTable = React.createRef();
  const [filtered, setFiltered] = useState([])
  const [payDueDateStartDate, setPayDueDateStartDate] = useState("")
  const [payDueDateEndDate, setPayDueDateEndDate] = useState("")
  const [dueDateStartDate, setDueDateStartDate] = useState("")
  const [dueDateEndDate, setDueDateEndDate] = useState("")

  const [focusedInput, setFocusedInput] = useState("")
  const [focusedInput2, setFocusedInput2] = useState("")

  const [data, setData] = useState([])
  const [clients, setClients] = useState([])
  const [companies, setCompanies] = useState([])

  const [excelData, setExcelData] = useState([]);

  const excelRef = useRef(excelData)
  const filterRef = useRef(filtered)

  const excludedFields = props.variant === 'GM' ?
    ['__v',
      '_id',
      'files',
      'active_status',
      'promoter',
      'car_float',
      'endorsements',
      'comments',
      'status',
      'created_at',
      'tolerance',
      'state',
      'city',
      'postal_code',
      'gender',
      'contacts',
      'begin_date',
      'invoices',
      'cancelation_note',
      'car_model',
      'languages',
      'damage_product',
      'bounty',
      'currency',
      'Moneda'] :
    ['__v',
      '_id',
      'files',
      'active_status',
      'promoter',
      'car_float',
      'endorsements',
      'comments',
      'status',
      'created_at',
      'tolerance',
      'state',
      'city',
      'postal_code',
      'gender',
      'contacts',
      'begin_date',
      'invoices',
      'cancelation_note',
      'car_model',
      'languages',
      'damage_product']


  useEffect(() => {
    prepareClientsForForm();
    prepareCompaniesForForm();
    refresh();
  }, [props.variant])


  const refresh = () => {
    props.getInsurances(props.variant).then(data => {
      setData(data.insurances)
    });
  }

  const generateFieldsTranslation = () => {
    let resObj = {
      _id: "id",
      client: "Contratante",
      person_type: "Tipo de persona",
      rfc: "RFC",
      colective_insurance: "Tipo de póliza",
      due_date: "Fecha de vencimiento",
      endorsements: "Endosos",
      insurance: "Compañia",
      email: "Email",
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

    if (props.variant === 'AUTOS') {
      resObj = {
        ...resObj,
        car_brand: "Marca",
        car_color: "Color de coche",
        car_description: "Descripción de coche",
        car_motor: "Número de motor",
        car_placas: "Número de placas",
        car_series_number: "Número de serie",
        car_year: "Modelo",
        cis: "CIS"
      }
    }

    if (props.variant !== 'GM') {
      resObj = {
        ...resObj,
        net_bounty: "Prima neta",
        bounty: "Prima total",
        currency: "Moneda"
      }
    }

    return resObj
  }

  const generateHeaders = () => {
    //Contrantante/#póliza/F de vencimiento de póliza/prima/modelo/marca/Descripción/# de serie/Aseguradoras/lo demás

    let resArr = [
      'Contratante',
      'Póliza',
      'Fecha de vencimiento',
      'Status',
      'Fecha vto. pago',
      'Tipo de pago',
      'Aseguradora',
      'Producto',
      'Tipo de póliza',
      'Contratante RFC',
      'Contratante Tipo de persona',
      'Moneda',
    ];

    if (props.variant === "GM") {
      resArr = [
        'Contratante',
        'Póliza',
        'Fecha de vencimiento',
        'Status',
        'Fecha vto. pago',
        'Tipo de pago',
        'Aseguradora',
        'Producto',
        'Tipo de póliza',
        'Contratante RFC',
        'Contratante Tipo de persona'
      ];
    }
    if (props.variant === 'AUTOS') {
      resArr = [
        'Contratante',
        'Póliza',
        'Fecha de vencimiento',
        "Marca",
        "Descripción de coche",
        "Modelo",
        "Número de placas",
        'Prima',
        'Status',
        'Fecha vto. pago',
        'Tipo de pago',
        'Aseguradora',
        "Número de serie",
        "Número de motor",
        "Color de coche",
        "CIS",
        'Contratante Tipo de persona', 'Contratante RFC', 'Producto', 'Tipo de póliza', 'Tipo de pago', 'Moneda'
      ]
    }
    if (props.variant === 'DANOS') {
      resArr = [
        'Contratante',
        'Póliza',
        'Fecha de vencimiento',
        'Status',
        'Fecha vto. pago',
        'Tipo de pago',
        'Aseguradora',
        'Producto',
        'Tipo de póliza',
        'Contratante Tipo de persona',
        'Contratante RFC',
      ];
    } if (props.variant === "VIDA") {
      resArr = [
        'Contratante',
        'Póliza',
        'Fecha de vencimiento',
        'Status',
        'Fecha vto. pago',
        'Tipo de pago',
        'Aseguradora',
        'Producto',
        'Tipo de póliza',
        'Moneda',
        'Contratante RFC',
        'Contratante Tipo de persona',
      ];
    }
    return resArr
  }

  const prepareClientsForForm = () => {
    props.getClients().then(data => {
      setClients(data.clients)
    });
  }

  const prepareCompaniesForForm = () => {
    props.getCompanies().then(data => {
      setCompanies(data.companies)
    });
  }


  const onFilteredChangeCustom = (value, accessor) => {
    const notFilterable = ['begin_date', 'due_date', 'pay_due_date']
    // if (Object.keys(value).includes(null)) return;
    let filters = filtered;

    let insertNewFilter = 1;

    if (filters.length) {
      filters.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) filters.splice(i, 1);
          else filter["value"] = value;

          insertNewFilter = 0;
        }
      });
    }

    if (insertNewFilter || notFilterable.includes(accessor)) {
      filters.push({
        id: accessor,
        value: value
      })
    }

    setFiltered(
      filters
    )

    const tableContent = reactTable.current;
    const allData = tableContent?.getResolvedState().sortedData;
    const excelToExport = allData?.map((data) => data._original)
    setExcelData(excelToExport)
  }


  const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
      if (!rowInfo.original.active_status) {
        return {
          style: {
            cursor: "pointer",
            backgroundColor: "#ccc"
          },
          onClick: (e) => {
            openModificationModal(rowInfo.original);
          }
        }
      }
      return {
        style: {
          cursor: "pointer",
        },
        onClick: (e) => {
          openModificationModal(rowInfo.original);
        }
      }
    }
    return {};
  }

  const openModificationModal = (insurance, invoicePanel = false) => {
    let cancelation_note = "";

    if (!insurance.active_status) cancelation_note = `NOTA DE CANCELACIÓN: ${insurance.cancelation_note}`;

    swal({
      text: `${cancelation_note}`,
      content: <InsuranceModal
        type={insurance.insurance_type}
        insurance={insurance}
        clients={clients}
        companies={companies}
        updateInsurance={updateInsurance}
        deleteInsurance={deleteInsurance}
        cancelInsurance={cancelInsurance}
        activateInsurance={activateInsurance}
        changePayStatus={changePayStatus}
        download={download}
        saveFile={saveFile}
        removeFile={confirmRemoveFile}
        refresh={refresh}
        getInsurances={props.getInsurances}
        getInsurance={props.getInsurance}
      >
      </InsuranceModal>,
      buttons: false,
      title: `Póliza: ${insurance.policy}`
    });
  }

  const addInsurance = (variant) => {
    swal({
      title: `Registro de póliza de ${variant}`,
      text: "Captura los datos de la nueva póliza",
      content:
        <InsuranceForm
          invoicePanel={false}
          type={variant}
          clients={clients}
          companies={companies}
          save={registerInsurance}
          updateInsurance={updateInsurance}
          deleteInsurance={deleteInsurance}
        />,
      className: "width-800pt-100h",
      buttons: false
    });
  }

  const registerInsurance = (insuranceData) => {
    props.createInsurance(insuranceData)
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
        refresh();
      });
  }

  const updateInsurance = (insuranceData) => {
    props.updateInsurance(
      insuranceData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Poliza Actualizada</h2>,
          }).then(() => {
            refresh();
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar la poliza</h2>,
          }).then(() => {
            refresh();
          });;
        }

      });
  }

  const cancelInsurance = (insurance, note, e) => {
    swal({
      title: `¿Estas seguro de querer cancelar ${insurance.policy}?`,
      text: `Nota de cancelación: ${note}`,
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          confirmCancel(insurance._id, note);
          swal("Tu poliza se ha cancelado!", {
            icon: "success",
          }).then(() => {
            refresh();
          });
        }
      });
  }

  const activateInsurance = (insurance, e) => {
    swal({
      title: `¿Estas seguro de querer activar ${insurance.policy}?`,
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          confirmActivation(insurance._id);
          swal("Tu poliza se ha activado!", {
            icon: "success",
          }).then(() => {
            refresh();
          });
        }
      });
  }


  const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
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

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const determineContentType = (extension) => {
    let type = "";
    let fileExtension = extension.toLowerCase();

    switch (fileExtension) {
      case "PDF":
        type = 'application/pdf';
        break;
      case "xlsx":
        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case "docx":
        type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break
      default:
        type = `image/${extension}`
    }
    return type;
  }

  const confirmDownload = async (file) => {
    try {
      const response = await props.download(file)
      const data = response.data
      console.log(data);

      const { encoded, fullName, extension } = data
      console.log('DATA', data)
      const contentType = determineContentType(extension)
      const blob = b64toBlob(encoded, contentType);
      const blobUrl = URL.createObjectURL(blob);
      var a = document.createElement('A');
      a.href = blobUrl;
      a.download = `${fullName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {

    }
  }

  const download = (file) => {
    confirmDownload(file);
  }

  const confirmRemoveFile = (file, id) => {
    swal({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar el archivo ${file.replace(/^.*[\\\/]/, '')}`,
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          props.removeFile(file, id);

          swal("Eliminado!", "Tu archivo ha sido eliminado!", "success").then(() => {
            refresh();
          });
        }
      });
  }

  const saveFile = (file, id) => {
    props.saveFile(file, id);
  }

  const changePayStatus = (insurance, e) => {
    let newStatus;

    swal({
      title: `Cambiar status de ${insurance.policy}`,
      icon: "warning",
      content: <React.Fragment>
        <Form.Group as={Col} md="12">
          <Form.Control required as="select" onChange={(e) => { newStatus = e.target.value }} value={newStatus}>
            <option></option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PAGADO">PAGADA</option>
            <option value="COTIZACION">COTIZACION</option>
            <option value="RENOVACION">RENOVACION</option>
            <option value="CANCELADA">CANCELADA</option>
          </Form.Control>
        </Form.Group>
      </React.Fragment>,
      buttons: true,
      sucessMode: true,
    })
      .then((willUpdate) => {
        if (willUpdate) {
          confirmPayChange(insurance._id, newStatus);
          swal("Tu poliza ha cambiado!", {
            icon: "success",
          }).then(() => {
            refresh();
          });
        }
      });
  }

  const deleteInsurance = (id, name, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar a ${name}?`,
      text: "Una vez eliminado ya no podras recuperarlo!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          confirmDelete(id);
          swal("Puf! Tu poliza se ha eliminado!", {
            icon: "success",
          });
          refresh();
        }
      });
  }

  const validateField = (field) => {
    if (field) return field;
    return '';
  }

  const confirmDelete = (id) => {
    props.deleteInsurance(id);
  }

  const confirmCancel = (id, note) => {
    props.cancelInsurance(id, note);
  }

  const confirmActivation = (id) => {
    props.activateInsurance(id);
  }

  const confirmPayChange = (id, status) => {
    props.changePayStatus(id, status);
  }


  const columns = [{
    Header: "Datos",
    columns: [
      {
        Header: "Aseguradora",
        id: "insurance_company",
        width: 90,
        accessor: d => validateField(d?.insurance_company?.name)
      },
      {
        Header: "Cliente",
        id: "client",
        accessor: d => {
          if (d.client) {
            return validateField(d?.client?.name)
          } else {
            return '';
          }
        }
      },
      {
        Header: "Poliza No.",
        id: "policy",
        width: 140,
        accessor: d => validateField(d?.policy)
      },
      {
        Header: "Forma de pago",
        id: "payment_type",
        width: 140,
        accessor: d => validateField(d?.payment_type)
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
        Header: "Fecha vto. poliza",
        id: "due_date",
        Cell: c => <span>{c.original.due_date && formatShortDate(c.original.due_date)}</span>,
        accessor: d => moment(d.due_date).unix(),
        width: 300,
        Filter: ({ filter, onChange }) => (
          <DateRangePicker
            startDateId="start3"
            endDateId="end3"
            startDate={dueDateStartDate}
            endDate={dueDateEndDate}
            onDatesChange={({ startDate, endDate }) => {
              setDueDateStartDate(startDate)
              setDueDateEndDate(endDate)
              onChange({ startDate, endDate });
            }}
            focusedInput={focusedInput2}
            onFocusChange={focusedInput => setFocusedInput2(focusedInput)}
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
          const res = row[filter.id] !== undefined ? moment.unix(row[filter.id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'), null, '[]') : true
          return res
        }
      },
      {
        Header: "Vto. pago",
        id: "pay_due_date",
        Cell: c => {
          if (c.original.invoices.length > 0) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0);

            const dates = [];
            const allDates = [];

            c.original.invoices.map((invoice) => {
              let due_date = new Date(invoice.due_date);
              due_date.setDate(due_date.getDate() + 1);
              due_date.setHours(0, 0, 0);

              if (due_date >= currentDate) dates.push(due_date);
              allDates.push(due_date);
            });

            if (dates.length !== 0) {
              const minDate = new Date(Math.min.apply(null, dates));
              return <span>{formatDateObj(minDate)}</span>
            } else {
              const maxDate = new Date(Math.max.apply(null, allDates));
              return <span>{formatDateObj(maxDate)}</span>
            }
          }

        },
        accessor: d => {
          if (d.invoices.length === 1) {
            return moment(d.invoices[0].due_date).unix();
          }
          else if (d.invoices.length > 0) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0);

            const dates = [];
            const allDates = [];

            d.invoices.map((invoice) => {
              let due_date = new Date(invoice.due_date);
              due_date.setDate(due_date.getDate() + 1);
              due_date.setHours(0, 0, 0);

              if (due_date >= currentDate) dates.push(due_date);
              allDates.push(due_date);
            });

            if (dates.length !== 0) {
              const minDate = new Date(Math.min.apply(null, dates));
              return moment(minDate).unix();
            } else {
              const maxDate = new Date(Math.max.apply(null, allDates));
              return moment(maxDate).unix();
            }

          } else {
            return "";
          }

        },
        width: 300,
        Filter: ({ filter, onChange }) => (
          <DateRangePicker
            startDateId="start2"
            endDateId="end2"
            startDate={payDueDateStartDate}
            endDate={payDueDateEndDate}
            onDatesChange={({ startDate, endDate }) => {
              setPayDueDateStartDate(startDate)
              setPayDueDateEndDate(endDate);
              onChange({ startDate, endDate });
            }}
            focusedInput={focusedInput}
            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
            isOutsideRange={() => false}
            withPortal={true}
            showClearDates={true}
          />
        ),
        filterMethod: (filter, row) => {
          if (filter.value.startDate === null || filter.value.endDate === null) {             // Incomplet or cleared date picker
            return true
          }

          if (Number.isInteger(row[filter.id])) {
            row[filter.id] = moment(row[filter.id]);
          }

          const res = row[filter.id] !== undefined ? moment.unix(row[filter.id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'), null, '[]') : true
          return res
        }
      },
      {
        Header: "Status",
        id: "pay_status",
        accessor: d => validateField(d.pay_status)
      },
    ]
  }
  ];

  return (
    <React.Fragment>
      <Container fluid className="mt-4">
        <Row>
          <h2>Pólizas {props.variant}</h2>
        </Row>
        <Row className="mt-4">
          <a onClick={addInsurance.bind(this, props.variant)} className="btn-primary">Registrar nuevo</a>
        </Row>
      </Container>
      <br />
      <div className="full-width">
        <ReactTable
          ref={reactTable}
          data={data}
          filterable
          filtered={filtered}
          onFilteredChange={(filtered, column, value) => {
            onFilteredChangeCustom(value, column.id || column.accessor);
          }}
          defaultFilterMethod={(filter, row, column) => {
            const notFilterable = ['begin_date', 'due_date', 'pay_due_date']

            if (notFilterable.includes(filter.id)) {
              const id = filter.pivotId || filter.id;
              console.log(row[id]);
              const res = row[id] !== undefined ? moment.unix(row[id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'), null, '[]') : true
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
          getTrProps={getTrProps}
        />
        <div className="row">
          <div className="col-md-4 center mt-4">
            {props.variant &&
              <ExportDataToCSV
                csvData={excelData?.length > 0 ? excelData : data}
                fileName={`reporteSeguros_${props.variant}`}
                onComplete={refresh}
                fieldTranslation={generateFieldsTranslation()}
                excludedFields={excludedFields}
                header={generateHeaders()}
                sortableColumn={'Contratante'}></ExportDataToCSV>
            }
          </div>
        </div>

      </div>
    </React.Fragment>
  );
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
  {
    getClients,
    getCompanies,
    createInsurance,
    deleteInsurance,
    updateInsurance,
    getInsurance,
    getInsurances,
    cancelInsurance,
    activateInsurance,
    changePayStatus,
    download,
    removeFile,
    saveFile
  }
)(InsurancePanel);
