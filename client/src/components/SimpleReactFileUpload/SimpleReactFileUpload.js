import React from 'react'
import axios, { post } from 'axios';

import XLSX from "xlsx";

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

  fileUpload(file){
    var reader = new FileReader();

    reader.onload = function(){
      const data = reader.result;

      const workbook = XLSX.read(data, {type: 'binary'});

      var sheet_name_list = workbook.SheetNames;

      let excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      
    };

    
    reader.readAsBinaryString(file);
  }

  render() {
    return (
      <>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
      </>
   )
  }
}



export default SimpleReactFileUpload