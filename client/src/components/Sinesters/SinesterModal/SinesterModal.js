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
import FileUpload from '../../GenericUploader/FileUpload'
import FileVisualizer from "../../Files/FileVisualizer"

import swal from '@sweetalert/with-react';

import { formatShortDate } from '../../component-utils';

import "./SinesterModal.css";

import SinesterForm from '../SinesterForm/SinesterForm'

class SinesterModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sinester: this.props.sinester
    };
  }

  refresh = () => {
    this.props.getSinester(this.state.sinester._id).then(sinester => {
      this.setState({
        sinester
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

          swal("Eliminado!", "Tu archivo ha sido eliminado!", "success").then(() => {
            this.props.refreshPanel();
          });
        }
      });

  }


  render() {
    const { sinester } = this.state;
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
                            <a class="nav-link active" href="#profile" role="tab" data-toggle="tab"><i class="fas fa-user-circle"></i>Generales</a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" href="#files" role="tab" data-toggle="tab"><i class="fas fa-file"></i>Anexos</a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" href="#deleteTab" role="tab" data-toggle="tab"><i class="fas fa-exclamation-triangle"></i>Eliminar</a>
                          </li>
                        </ul>
                        <div class="tab-content">
                          <div role="tabpanel" class="tab-pane fade show active" id="profile">
                            <SinesterForm
                              save={this.props.save}
                              clients={this.props.clients}
                              sinester={sinester}
                              companies={this.props.companies}
                              edit={true}
                              updateSinester={this.props.updateSinester}>
                            </SinesterForm>
                          </div>
                          <div role="tabpanel" class="tab-pane fade" id="files">
                            <Row>
                              <Col>
                                <FileVisualizer
                                  entity={this.state.sinester}
                                  downloadFile={this.props.download}
                                  refresh={this.refresh}
                                  removeFile={this.confirmRemoveFile}
                                  saveFile={this.props.saveFile}></FileVisualizer>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Row>
                                  <h2 className="swal-title form-title align-left">Subir nuevo archivo</h2>
                                </Row>
                                <FileUpload entity={'sinesters'} target={sinester} refresh={this.refresh} finally={() => console.log("done")}></FileUpload>
                              </Col>
                            </Row>
                          </div>
                          <div role="tabpanel" class="tab-pane fade" id="deleteTab">
                            <Row className="mt-4">
                              <Col>
                                <Button className="panel-btn" variant="danger" onClick={this.props.deleteSinester.bind(this, sinester._id, sinester.description)}>ELIMINAR</Button>
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

export default SinesterModal;