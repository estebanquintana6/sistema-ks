import React, { Component } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import { formatShortDate } from '../component-utils';

import swal from '@sweetalert/with-react';

class FileVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingFile: null,
      entity: props.entity,
      search: ""
    }
  }

  componentWillReceiveProps({ entity }) {
    this.setState({ ...this.state, entity })
  }

  onChange = (index, e) => {
    let files = [...this.state.entity.files];
    let f = { ...files[index] };
    let ent = { ...this.state.entity }
    f.description = e.target.value;
    files[index] = f;
    ent.files = files
    this.setState({ entity: ent });
  }

  onSearchChange = e => {
    this.setState({ search: e.target.value });
  }

  editFile = (index) => {
    this.setState({ editingFile: index })
  }

  saveFile = (file, id) => {
    this.setState({ editingFile: null })
    this.props.saveFile(file, id)
  }

  render() {
    return (
      <div>
        <Row>
          <h2 className="swal-title form-title align-left">Archivos</h2>
        </Row>
        <Row>
          <Form.Group as={Col} md="12">
            <Form.Label>Búsqueda</Form.Label>
            <Form.Control required onChange={this.onSearchChange} value={this.state.search} placeholder="Búsqueda por descripción..."/>
          </Form.Group>
        </Row>
        <Row>
          {this.state.entity.files.filter((file) => {
            let { description } = file;
            if(this.state.search === "") return true;
            return description.toLowerCase().includes(this.state.search.toLowerCase());
          }).map((file, index) => {
            const i = this.state.entity.files.map(function (e) { return e.path; }).indexOf(file.path);

            return (<React.Fragment key={i}>
              <Card style={{ width: '18rem' }} className="ml-3 mt-3">
                <Card.Body>
                  <Card.Title>{file.path.replace(/^.*[\\\/]/, '')}</Card.Title>
                  {(this.state.editingFile === i) ? (<div>
                    <Form.Group as={Col} md="12">
                      <Form.Label onClick={() => this.editFile(null)}>Descripcion</Form.Label>
                      <Form.Control required onChange={(e) => { this.onChange(i, e) }} value={this.state.entity.files[i].description} />
                      <Button className="mt-2" variant='success' onClick={() => this.saveFile(file, this.state.entity._id)}>Guardar</Button>
                    </Form.Group>
                  </div>) : <Card.Text onClick={() => this.editFile(i)}>
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