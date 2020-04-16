import React from 'react'
import axios, { post } from 'axios';

class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
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
      var text = reader.result;
      var node = document.getElementById('output');
      node.innerText = text;
      console.log(reader.result.substring(0, 200));
    };
    console.log(reader.readAsText(file));
  }

  render() {
    return (
      <>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        <div id='output'>
        ...
        </div>
      </>
   )
  }
}



export default SimpleReactFileUpload