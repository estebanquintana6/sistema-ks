import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row } from 'react-bootstrap';
import { connect } from "react-redux";
import { getClients, updateClient, deleteClient, registerClient, download, removeFile } from "../../../actions/registerClient";
import swal from '@sweetalert/with-react';

import ClientsForm from "../ClientsForm/ClientsForm";
import ClientModal from '../ClientModal/ClientModal'
import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";

// Import React Table
import ReactTable from "react-table";



import "react-table/react-table.css";
import "./ClientsPanel.css";

import FileUpload from '../../GenericUploader/FileUpload'


class ClientsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      select2: undefined,
      data: [],
      fieldTranslation: {
        comments: "Comentarios",
        contacts: "Contacto ",
        email: "Correo",
        name: "Nombre",
        telephone: "Teléfono",
        observations: "Observaciones",
        person_type: "Tipo de Persona",
        rfc: "RFC",
        gender: 'Sexo',
        state: "Estado",
        city: "Ciudad",
        postal_code: "Código Postal"
      },
      excludedFields: ['__v', '_id', 'files', 'created_at'],
      excelHeader: ['Tipo de Persona', 'RFC', 'Nombre', 'Sexo','Estado', 'Ciudad', 'Código Postal', 'Comentarios']
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
        const { status } = response;
        if (status === 200) {
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

  updateClient = (clientData) => {
    this.props.updateClient(
      clientData)
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

  addClient = e => {
    swal({
      title: `Registro de cliente`,
      text: "Captura los datos del nuevo cliente",
      className: "width-800pt", 
      content: <ClientsForm save={this.registerClient}></ClientsForm>,
      buttons: false
    })
  }

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

  openModificationModal(client) {
    swal({
      content: <ClientModal
        client={client}
        getClients={this.props.getClients}
        refreshPanel={this.refresh}
        updateClient={this.updateClient}
        deleteClient={this.deleteClient}
        download={this.download}
        removeFile={this.removeFile}>
      </ClientModal>,
      buttons: false,
      title: `${client.name}`,
      className: "width-800pt"
    });
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

  deleteClient = (id, name, e) => {
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
    this.props.deleteClient(id);
  }

  validateField = (field) => {
    if(field) return field;
    return '';
  }

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Container fluid className="mt-4">
            <Row>
              <h2>Clientes</h2>
            </Row>
            <Row className="mt-4">
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
                  accessor: d => this.validateField(d.name)
                },
                {
                  Header: "RFC/Razon social",
                  id: "rfc",
                  accessor: d => this.validateField(d.rfc)
                },
                {
                  Header: "Correo",
                  id: "email",
                  accessor: d => {
                    if(d.contacts[0]){
                      return d.contacts[0].email;
                    }
                    return '';
                  }
                },
                {
                  Header: "Telefono",
                  id: "telephone",
                  accessor: d => {
                    if(d.contacts[0]){
                      return d.contacts[0].telephone;
                    }
                    return '';
                  },
                },
                {
                  Header: "Código postal",
                  id: "postal_code",
                  accessor: d => this.validateField(d.postal_code)
                }
              ]
            }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            getTrProps={this.getTrProps}
          />
          </div>
          <div className="mt-4">
          <ExportDataToCSV csvData={this.state.data} fileName={'clientes'} fieldTranslation={this.state.fieldTranslation} excludedFields={this.state.excludedFields} header={this.state.excelHeader} sortableColumn={'Nombre'}></ExportDataToCSV>
          </div>
        </Container>
        <FileUpload entity={'clients'} client={this.state.data[0]} refresh={this.refresh}></FileUpload>
        <ExportDataToCSV csvData={this.state.data} fileName={'clientes'} fieldTranslation={this.state.fieldTranslation} excludedFields={this.state.excludedFields}></ExportDataToCSV>
      </React.Fragment>
    );
  }
}

ClientsPanel.propTypes = {
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
  { getClients, updateClient, deleteClient, registerClient, download, removeFile }
)(ClientsPanel);
