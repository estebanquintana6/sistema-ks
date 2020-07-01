import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap';
import { connect } from "react-redux";
import { getClients } from '../../../actions/registerClient'
import { getSinisters, registerSinester, updateSinester, deleteSinester, download, removeFile, saveFile } from "../../../actions/sinesterActions";

import swal from '@sweetalert/with-react';

import ReactTable from "react-table";

import SinesterForm from "../SinesterForm/SinesterForm"
import SinesterModal from "../SinesterModal/SinesterModal"


import "react-table/react-table.css";
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import {formatShortDate, formatDateObj} from '../../component-utils';


class SinesterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      data: []
    };
  }

  async componentDidMount() {
    this.prepareClientsForForm();
    this.refresh();
  }

  prepareClientsForForm = () => {
    this.props.getClients().then(data => {
      this.setState({ clients: data.clients });
    });
  }

  refresh = () => {
    this.props.getSinisters().then(data => {
      this.setState({ data: data.sinesters });
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

  validateField = (field) => {
    if(field) return field;
    return '';
  }

  createSinester = () => {
    swal({
      title: `Registro de siniestro`,
      text: "Captura los datos del siniestro",
      className: "width-800pt", 
      content: 
      <SinesterForm 
      clients={this.state.clients}
      save={this.props.registerSinester}
      refreshPanel={this.refresh}
      >
      </SinesterForm>,
      buttons: false
    })
  }


  saveFile = (file, id) => {
    this.props.saveFile(file, id)
    this.refresh();
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
    let type = "";
    let fileExtension = extension.toLowerCase();
    
    switch(fileExtension) {
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

  updateSinester = (sinesterData) => {
    this.props.updateSinester(
      sinesterData)
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

  deleteSinester = (id, name, e) => {
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
    this.props.deleteSinester(id);
  }

  openModificationModal(sinester) {
    swal({
      content: <SinesterModal
        save={this.updateSinester}
        sinester={sinester}
        clients={this.state.clients}
        refreshPanel={this.refresh}
        updateSinester={this.updateSinester}
        deleteSinester={this.deleteSinester}
        download={this.download}
        removeFile={this.removeFile}
        saveFile={this.saveFile}
        reopenModal={this.openModificationModal}>
      </SinesterModal>,
      buttons: false,
      title: `${sinester.description}`,
      className: "width-800pt"
    });
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Container fluid className="mt-4">
            <Row>
              <h2>Siniestros</h2>
            </Row>
            <Row className="mt-4">
              <a onClick={this.createSinester} className="btn-primary">Registrar nuevo</a>
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
                const notFilterable = ['begin_date']

                if(notFilterable.includes(filter.id)) {
                  const id = filter.pivotId || filter.id;
                  const res = row[id] !== undefined ? moment.unix(row[id]).clone().startOf('day').isBetween(moment(filter.value.startDate).clone().startOf('day'), moment(filter.value.endDate).clone().startOf('day'),null, '[]') : true 
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
                  id: "client",
                  accessor: d => this.validateField(d.client.name)
                },
                {
                  Header: "Siniestro",
                  id: "sinester",
                  accessor: d => this.validateField(d.sinester)
                },
                {
                  Header: "Descripcion",
                  id: "description",
                  accessor: d => this.validateField(d.description)
                },
                {
                  Header: "Status",
                  id: "status",
                  accessor: d => this.validateField(d.status)
                },
                {
                  Header: "Fecha de inicio",
                  id: "begin_date",
                  Cell: c => <span>{c.original.begin_date && formatShortDate(c.original.begin_date)}</span>,
                  accessor: d => moment(d.begin_date).unix(),
                  width: 300,
                  Filter: ({filter, onChange}) => (
                    <DateRangePicker
                      startDateId="start3"
                      endDateId="end3"
                      startDate={this.state.searchStartDate}
                      endDate={this.state.searchEndDate}
                      onDatesChange={({ startDate, endDate }) => {
                        this.setState({ searchStartDate: startDate, searchEndDate: endDate }); 
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
              ]
            }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            getTrProps={this.getTrProps}
          />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

SinesterPanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getSinisters, registerSinester, updateSinester, deleteSinester, getClients, download, removeFile, saveFile }
)(SinesterPanel);
