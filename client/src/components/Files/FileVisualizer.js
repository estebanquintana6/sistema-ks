import React, { Component } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  Table,
  Row,
} from 'react-bootstrap';
import { formatShortDate } from '../component-utils';

import './FileVisualizer.css';

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
    const distinct = (value, index, self) => self.indexOf(value) === index;

    const years = this.state.entity.files.map((file) =>
      new Date(file.created_at).getFullYear()
    ).filter(distinct);


    const { entity: { files } } = this.state;

    const yearAccordions = years.map((year, index) => {
      const filteredFiles = files.filter((file) => {
        const fileYear = new Date(file.created_at).getFullYear();
        return fileYear === year;
      })
      return (
        <Accordion style={{ width: "100%" }}>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
              {year}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${index}`}>
              <Table
                striped
                bordered
                hover
                style={{ marginTop: '16px' }}>
                <thead>
                  <tr>
                    <th>Archivo</th>
                    <th>Descripción</th>
                    <th>Creador</th>
                    <th>Fecha de subida</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.filter((file) => {
                    let { description } = file;
                    if (this.state.search === "") return true;
                    return description.toLowerCase().includes(this.state.search.toLowerCase());
                  }).map((file, index) => {
                    const i = this.state.entity.files.map(function (e) { return e.path; }).indexOf(file.path);
                    return (
                      <tr>
                        <td style={{ maxWidth: '200px' }}>{file.path.replace(/^.*[\\\/]/, '')}</td>
                        {(this.state.editingFile === i) ? (
                          <td style={{ maxWidth: '15rem' }}>
                            <Form.Group as={Col} md="12">
                              <Form.Control required onChange={(e) => { this.onChange(i, e) }} value={this.state.entity.files[i].description} />
                              <Button className="mt-2" variant='success' onClick={() => this.saveFile(file, this.state.entity._id)}>Guardar</Button>
                            </Form.Group>
                          </td>) :
                          <td
                            style={{ maxWidth: '15rem' }}
                            onClick={() => this.editFile(i)}>
                            {` ${file.description} `}
                          </td>
                        }
                        <td>{file.uploader}</td>
                        <td>{formatShortDate(file.created_at)}</td>
                        <td>
                          <Button
                            variant="info"
                            onClick={this.props.downloadFile.bind(this, file.path)}>
                            <i className="fa fa-arrow-down" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={this.props.removeFile.bind(this, file.path, this.state.entity._id)}>
                            <i className="fa fa-trash" aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )
    })

    console.log(yearAccordions)

    return (
      <div>
        <Row>
          <h2 className="swal-title form-title align-left">Archivos</h2>
        </Row>
        <Row>
          <Form.Group as={Col} md="12">
            <Form.Label>Búsqueda</Form.Label>
            <Form.Control required onChange={this.onSearchChange} value={this.state.search} placeholder="Búsqueda por descripción..." />
          </Form.Group>
        </Row>
        <Row>
          <h4 className="swal-title form-title align-left">Archivos por año: </h4>
        </Row>
        <Row>
          {yearAccordions}
        </Row>
      </div>
    )
  }
}

export default FileVisualizer;