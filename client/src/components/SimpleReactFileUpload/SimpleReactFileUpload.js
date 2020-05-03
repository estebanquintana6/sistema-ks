import React from 'react'
import { bulkData } from '../../actions/bulkActions';
import { connect } from "react-redux";

import XLSX from "xlsx";

import swal from '@sweetalert/with-react';


import {
  Button,
  Form,
  Row
} from 'react-bootstrap';

class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      file:null
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file);
  }

  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  createTranslationTable = () => {
    const translationTable = {}
    const originalKeys = this.props.originalKeys;
    originalKeys.forEach((key, index) => {
      translationTable[key] = this.props.resultKeys[index]
    })
    return translationTable
  }

  goToPage = (route) => {
    this.props.history.push(route);
}

  fileUpload(file){
    var reader = new FileReader();
    const self = this
    reader.onload = function(){
      const data = reader.result;
      const workbook = XLSX.read(data, {type: 'binary', raw: false, cellDates: true});

      var sheet_name_list = workbook.SheetNames;

      let excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      self.setState({jsonInfo: excelJson})
      const translation = self.createTranslationTable();
      
      let uploadUrl = "";
      switch(self.props.type){
        case 'CLIENTES' : uploadUrl = 'clients'; break;
        case 'AUTOS' : uploadUrl = 'cars'; break;
        default: uploadUrl = ""
      }

      self.props.bulkData(excelJson, uploadUrl, translation);
      swal({
        icon: "success",
        content: <h2>Carga realizada</h2>
      });
    };
    reader.readAsBinaryString(file);
  }

  render() {
    return (
      <>
      <Row>
        <h2>{`Panel de carga: ${this.props.type}`}</h2>
      </Row>
      <Row className="mt-4">
        <h5>Instrucciones:</h5>
      </Row>
      <Row>
        <p>Haz click en el botón SELECCIONAR ARCHIVO y escoge un archivo tipo .xslx (Excel) para subirlo al sistema.</p>
      </Row>
      <Row className="mt-4">
        <h5>Puntos a considerar:</h5>
      </Row>
      <Row className="ml-4">
        <ul>
          <li>1. El sistema no subirá datos en donde se repita el Nombre y RFC en un mismo cliente con el fin de evitar duplicados.</li>
          <li>2. El sistema sólo garantiza que se lean archivos xlsx.</li>
          <li>3. El sistema sólo leerá la primera hoja de la página de Excel. En caso de que se requiera subir los datos de las demás hojas, éstas deberán ser puestas en hojas de Excel aparte o unificarse en un solo documento de Excel.</li>
          <li>4. El sistema deberá recibir un archivo de Excel con el formato de columnas correcto mencionado a continuación.
          </li>
        </ul>
      </Row>

      <Row className="mt-4">
      <h6>Las columnas que deberá contener para este caso son: </h6>
      </Row>
      <Row className="ml-4">
        <ul>
          {this.props.originalKeys.map((key) => {
            return (<li>{key}</li>)
          })}
        </ul>
      </Row>
      <Row className="mt-4 justify-content-md-center">
        <Form onSubmit={this.onFormSubmit}>
          <Form.Row>
          <input type="file" onChange={this.onChange} />
          </Form.Row>
          <Form.Row className="mt-4 justify-content-md-center">
          <Button type="submit">SUBIR</Button>
          </Form.Row>
        </Form>
      </Row>
      </>
   )
  }
}


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { bulkData }
)(SimpleReactFileUpload);