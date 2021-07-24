import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { Container, Row } from 'react-bootstrap'

import { connect } from "react-redux";
import { getInvoices, updateInvoice, deleteInvoice } from "../../../actions/invoiceActions";
import { formatShortDate } from '../../component-utils'
import { DateRangePicker } from 'react-dates';

import ReactTable from "react-table";

import "react-table/react-table.css";

import moment from 'moment';

import InvoicesModal from "../InvoicesModal/InvoicesModal";
import swal from '@sweetalert/with-react';

import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";


const InvoicePanel = ({
  getInvoices,
  updateInvoice: updateInvoiceAction,
  deleteInvoice: deleteInvoiceAction }
) => {
  const reactTable = React.createRef();

  const [focusedInput, setFocusedInput] = useState("")
  const [focusedInput2, setFocusedInput2] = useState("")

  const [payDueDateStartDate, setPayDueDateStartDate] = useState("")
  const [payDueDateEndDate, setPayDueDateEndDate] = useState("")
  const [dueDateStartDate, setDueDateStartDate] = useState("")
  const [dueDateEndDate, setDueDateEndDate] = useState("")

  const [data, setData] = useState([])
  const [filtered, setFiltered] = useState([])

  const [excelData, setExcelData] = useState([]);

  const excelRef = useRef(excelData)
  const filterRef = useRef(filtered)

  useEffect(() => {
    getInvoices().then((data) => {
      setData(data.invoices)
      setFiltered(data.invoices)
    })
  }, [])

  const refresh = () => {
    getInvoices().then(data => {
      setData(data.invoices)
    });
  }

  const onFilteredChangeCustom = (value, accessor) => {
    const notFilterable = ['due_date', 'pay_limit']
    // if (Object.keys(value).includes(null)) return;
    let filters = filterRef.current;

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
    console.log('all', allData)
    const excelToExport = allData?.map((data) => data._original)
    console.log(excelToExport)
    setExcelData(excelToExport)
    console.log(excelRef.current)
  }

  const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
      const original = rowInfo.original;
      if (original.payment_status !== "VENCIDO") {
        return {
          style: {
            cursor: "pointer"
          },
          onClick: (e) => {
            openModificationModal(original);
          }
        }
      } else {
        return {
          style: {
            "backgroundColor": "#cc6d7f",
            "cursor": "pointer",
            "color": "#f0f2f9"
          },
          onClick: (e) => {
            openModificationModal(original);
          }
        }
      }
    }
    return {};
  }

  const openModificationModal = (invoice) => {
    swal({
      content: <InvoicesModal
        invoice={invoice}
        updateInvoice={updateInvoice}
        deleteInvoice={deleteInvoice}>
      </InvoicesModal>,
      buttons: false,
      title: `Recibo: ${invoice.invoice}`
    });
  }

  const updateInvoice = (invoiceData) => {
    updateInvoiceAction(
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
        refresh();
      });
  }

  const deleteInvoice = (invoiceId, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar el recibo?`,
      text: "Una vez eliminado ya no podras recuperarlo!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          confirmDelete(invoiceId);
          swal("Recibo eliminado!", {
            icon: "success",
          });
        }
      }).finally(() => {
        refresh();
      });
  }

  const confirmDelete = (invoiceId) => {
    deleteInvoiceAction(invoiceId);
  }

  const validateField = (field) => {
    if (field) return field;
    return '';
  }


  return (
    <React.Fragment>
      <Container fluid className="mt-4 mb-4">
        <Row>
          <h2>Recibos</h2>
        </Row>
      </Container>
      <div className="full-width">
        <ReactTable
          ref={reactTable}
          data={data}
          filterable
          filtered={filterRef.current}
          onFilteredChange={(filtered, column, value) => {
            onFilteredChangeCustom(value, column.id || column.accessor);
          }}
          defaultFilterMethod={(filter, row, column) => {
            const notFilterable = ['due_date', 'pay_limit']

            if (notFilterable.includes(filter.id)) {
              const id = filter.pivotId || filter.id;
              const res = row[id] !== undefined ? moment.unix(row[id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'), null, '[]') : true
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
                Header: "Tipo S.",
                id: "insurance_type",
                width: 90,
                accessor: d => {
                  if (d.insurance) {
                    return validateField(d.insurance?.insurance_type)
                  }
                }
              },
              {
                Header: "Aseguradora",
                id: "insurance_company",
                width: 90,
                accessor: d => validateField(d?.insurance?.insurance_company?.name)
              },
              {
                Header: "Cliente",
                id: "client_name",
                accessor: d => {
                  if (d.client) {
                    return validateField(d.client.name)
                  }
                }
              },
              {
                Header: "Póliza",
                id: "policy",
                accessor: d => {
                  if (d.insurance) {
                    return validateField(d.insurance.policy)
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
                Filter: ({ filter, onChange }) => (
                  <DateRangePicker
                    startDateId="start3"
                    endDateId="end3"
                    startDate={dueDateStartDate}
                    endDate={dueDateEndDate}
                    onDatesChange={({ startDate, endDate }) => {
                      onChange({ startDate, endDate });
                      setDueDateStartDate(startDate);
                      setDueDateEndDate(endDate);
                    }}
                    focusedInput={focusedInput}
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                    isOutsideRange={() => false}
                    withPortal={true}
                    showClearDates={true}
                  />
                ),
                filterMethod: (filter, row) => {
                  if (dueDateStartDate && dueDateEndDate) {
                    const res = row[filter.id] !== undefined ?
                      moment.unix(row[filter.id])
                        .clone()
                        .startOf('day')
                        .isBetween(
                          moment(dueDateStartDate)
                            .clone()
                            .startOf('day'),
                          moment(dueDateEndDate)
                            .clone()
                            .startOf('day'), null, '[]'
                        ) : true
                    return res
                  } else {
                    return true
                  }
                }
              },
              {
                Header: "Prima neta",
                id: "net_bounty",
                accessor: d => d.net_bounty
              },
              {
                Header: "Prima total",
                id: "bounty",
                accessor: d => d.bounty
              },
              {
                Header: "Tipo pago",
                id: "payment_method",
                accessor: d => d.payment_method
              },
              {
                Header: "Moneda",
                id: "payment_currency",
                accessor: d => d.payment_currency
              },
              {
                Header: "Promotora",
                id: "promoter",
                accessor: d =>
                  d.promoter ? d.promoter : d.insurance?.promoter
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
          getTrProps={getTrProps}
        >
          {(state, makeTable, instance) => {
            // take data from state, resolvedData, or sortedData, if order matters (for export and similar)
            // you need to call makeTable to render the table
            const excelToExport = state.sortedData.map((data) => data._original)
            //setExcelData(excelToExport)
            return (
              <>
                {makeTable()}
                <div className="row">
                  <div className="col-md-4 center mt-4">
                    <ExportDataToCSV
                      csvData={excelToExport?.length > 0 ? excelToExport : data}
                      fileName={'reporteRecibos'}
                      type="invoices"
                      onComplete={refresh}
                      fieldTranslation={() => { return [] }}
                      excludedFields={() => { return [] }}
                      header={[
                        'EMPRESA',
                        'RECIBO',
                        'PRODUCTO',
                        'PRIMA NETA',
                        'PRIMA TOTAL',
                        'STATUS',
                        'VENCIMIENTO DE PAGO'
                      ]}>
                    </ExportDataToCSV>
                  </div>
                </div>
              </>)
          }}
        </ReactTable>
      </div>
    </React.Fragment>
  );
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
