import React from 'react'
import { bulkData } from '../../actions/bulkActions';
import { connect } from "react-redux";

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

  createTranslationTable = () => {
    const translationTable = {}
    const originalKeys = this.props.originalKeys;
    originalKeys.forEach((key, index) => {
      translationTable[key] = this.props.resultKeys[index]
    })
    return translationTable
  }

  fileUpload(file){
    var reader = new FileReader();
    const self = this
    reader.onload = function(){
      const data = reader.result;
      const workbook = XLSX.read(data, {type: 'binary'});

      var sheet_name_list = workbook.SheetNames;

      let excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      self.setState({jsonInfo: excelJson})
      const translation = self.createTranslationTable();
      self.props.bulkData(excelJson, 'clients', translation)
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


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { bulkData }
)(SimpleReactFileUpload);