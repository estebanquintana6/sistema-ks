import React, { Component } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import {formatShortDate} from '../component-utils' ;

import swal from '@sweetalert/with-react';

class FileVisualizer extends Component {
  constructor(props){
    super(props);
    this.state ={
      editingFile: null,
      entity: props.entity,
    }
  }

  componentWillReceiveProps({entity}) {
    this.setState({...this.state,entity})
  }

  onChange = (index, e) => {
    let files = [...this.state.entity.files];
    let f = { ...files[index] };
    let ent = {...this.state.entity}
    f.description = e.target.value;
    files[index] = f;
    ent.files = files
    this.setState({ entity: ent });
  }

  editFile = (index) => {
    this.setState({editingFile: index})
  }

  saveFile = (file, id) => {
    this.setState({editingFile: null})
    this.props.saveFile(file, id)
  }

  render(){
    return (
      <div>
        <Row>        
            <h2 className="swal-title form-title align-left">Archivos</h2>
          </Row>
          <Row>
          {this.state.entity.files.map((file, index) => {
            return (<React.Fragment key={index}>
              <Card style={{ width: '18rem' }} className="ml-3">
                <Card.Body>
                  <Card.Title>{file.path.replace(/^.*[\\\/]/, '')}</Card.Title>
                  {(this.state.editingFile === index) ? (<div>
                    <Form.Group as={Col} md="12">
                    <Form.Label onClick={() => this.editFile(null)}>Descripcion</Form.Label>
                    <Form.Control required onChange={(e) => { this.onChange(index, e) }} value={this.state.entity.files[index].description} />
                    <Button className="mt-2" variant='success' onClick={() => this.saveFile(file, this.state.entity._id)}>Guardar</Button>
                    </Form.Group>
                  </div>) : <Card.Text onClick={() => this.editFile(index)}>
                    {`Descripción: ${file.description}`}
                  </Card.Text>}
                  <Card.Text>
                    {`Fecha de subida: ${formatShortDate(file.created_at)}`}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col>
                      <Button variant="info" onClick={this.props.downloadFile.bind(this, file.path)}><i className="fa fa-arrow-down" aria-hidden="true"></i></Button>
                    </Col>
                    <Col>
                      <Button variant="danger" onClick={this.props.removeFile.bind(this, file.path, this.state.entity._id)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </React.Fragment>)
          })}
          </Row>
      </div>
    )
  }
}

export default FileVisualizer;