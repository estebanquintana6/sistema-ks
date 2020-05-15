import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import ClientsForm from "../ClientsForm/ClientsForm";

import "./ClientModal.css";

class ClientModal extends Component {

  render() {
    const { client } = this.props;
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
                                      <li class="nav-item">
                                        <a class="nav-link" href="#downloadTab" role="tab" data-toggle="tab"><i class="fas fa-exclamation-triangle"></i>Descargar</a>
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
                                        
                                      </div>
                                      <div role="tabpanel" class="tab-pane fade" id="deleteTab">
                                        <Row className="mt-4">
                                          <Col>
                                            <Button className="panel-btn" variant="danger" onClick={this.props.deleteClient.bind(this, client._id, client.name)}>ELIMINAR</Button>
                                          </Col>
                                        </Row>
                                      </div>
                                      <div role="tabpanel" class="tab-pane fade" id="downloadTab">
                                        {client.files.map(file => {
                                          return (<span onClick={this.props.download.bind(this, file)}>{file}</span>)
                                        })}
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