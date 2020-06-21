/* eslint-disable */
import React, { Component } from "react";

import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Row
} from 'react-bootstrap';
import ClientsForm from "../ClientsForm/ClientsForm";
import FileUpload from '../../GenericUploader/FileUpload'

import swal from '@sweetalert/with-react';

import {formatShortDate} from '../../component-utils';

import "./ClientModal.css";

class ClientModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      client: this.props.client
    };
  }

  refresh = () => {
    this.props.getClients().then(data => {
      const client = data.clients.find((client) => 
        client._id === this.state.client._id
      );
      this.setState({
        client: client
      });
    }).finally(() => {
      this.props.refreshPanel();
    });
  }

  confirmRemoveFile = (file, id) => {
    swal({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar el archivo ${file.replace(/^.*[\\\/]/, '')}`,
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.props.removeFile(file, id);

        swal("Eliminado!", "Tu archivo ha sido eliminado!", "success").then(() =>{
          this.props.refreshPanel();
        });
      }
    });

  }
  

  render() {
    const { client } = this.state;
    return (
      < Container >
            <React.Fragment>
              <Container>
                <Row>
                  <Col md="12" className="pull-right profile-right-section">
                      <Row className="profile-right-section-row">
                          <Col md="12">
                              <Row>
                                  <Col md="12">
                                    <ul class="nav nav-tabs" role="tablist">
                                      <li class="nav-item">
                                        <a class="nav-link active" href="#profile" role="tab" data-toggle="tab"><i class="fas fa-user-circle"></i>Personales</a>
                                      </li>
                                      <li class="nav-item">
                                        <a class="nav-link" href="#buzz" role="tab" data-toggle="tab"><i class="fas fa-info-circle"></i>Anexos</a>
                                      </li>
                                      <li class="nav-item">
                                        <a class="nav-link" href="#deleteTab" role="tab" data-toggle="tab"><i class="fas fa-exclamation-triangle"></i>Eliminar</a>
                                      </li>
                                    </ul>
                                    <div class="tab-content">
                                      <div role="tabpanel" class="tab-pane fade show active" id="profile">
                                        <ClientsForm
                                          client={client}
                                          edit={true}
                                          updateClient={this.props.updateClient}>
                                        </ClientsForm>
                                      </div>
                                      <div role="tabpanel" class="tab-pane fade" id="buzz">
                                      <Row>
                                        <Col>
                                            <Row>                
                                                <h2 className="swal-title form-title align-left">Archivos</h2>
                                            </Row>
                                            <Row>
                                              {client.files.map(file => {
                                                return (<React.Fragment>
                                                      <Card style={{ width: '18rem' }} className="ml-3">
                                                        <Card.Body>
                                                          <Card.Title>{file.path.replace(/^.*[\\\/]/, '')}</Card.Title>
                                                          <Card.Text>
                                                            {`Descripción: ${file.description}`}
                                                          </Card.Text>
                                                          <Card.Text>
                                                            {`Fecha de subida: ${formatShortDate(file.created_at)}`}
                                                          </Card.Text>
                                                        </Card.Body>
                                                        <Card.Footer>
                                                          <Row>
                                                            <Col>
                                                              <Button variant="info" onClick={this.props.download.bind(this, file.path)}><i class="fa fa-arrow-down" aria-hidden="true"></i></Button>
                                                            </Col>
                                                            <Col>
                                                              <Button variant="danger" onClick={this.confirmRemoveFile.bind(this, file.path, client._id)}><i class="fa fa-trash" aria-hidden="true"></i></Button>
                                                            </Col>
                                                          </Row>
                                                        </Card.Footer>
                                                      </Card>
                                                </React.Fragment>)
                                              })}
                                            </Row>
                                        </Col>
                                        </Row>
                                        <Row>
                                          <Col>
                                              <Row>                
                                                  <h2 className="swal-title form-title align-left">Subir nuevo archivo</h2>
                                              </Row>
                                              <FileUpload entity={'clients'} target={client} refresh={this.refresh}></FileUpload>
                                          </Col>
                                        </Row>

                                      </div>
                                      <div role="tabpanel" class="tab-pane fade" id="deleteTab">
                                        <Row className="mt-4">
                                          <Col>
                                            <Button className="panel-btn" variant="danger" onClick={this.props.deleteClient.bind(this, client._id, client.name)}>ELIMINAR</Button>
                                          </Col>
                                        </Row>
                                      </div>
                                    </div>
                                  </Col>
                              </Row>
                          </Col>
                      </Row>
                  </Col>
                </Row>
              </Container>
            </React.Fragment>
        </Container >
    )
  }
}

export default ClientModal;