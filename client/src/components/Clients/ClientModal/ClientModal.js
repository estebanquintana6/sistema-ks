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
                                        <FileVisualizer entity={this.state.client} downloadFile={this.props.download} refresh={this.refresh} removeFile={this.props.removeFile} saveFile={this.props.saveFile}></FileVisualizer>
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