
import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Jumbotron,
  Row
} from 'react-bootstrap';

import Select from 'react-select';

import moment from 'moment';

import "./SinesterForm.css";

class SinesterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
  }

  formatDate = (date) => {
    if (!date) return;
    const days = date.split('T')[0]
    return moment(days).startOf('day').format('YYYY-MM-DD')
  }

  composeClientOptions = () => {
    return this.props.clients.map(client => {
      return {
        value: client._id,
        label: client.name
      }
    })
  }

  selectedClient = () => {
    const res = this.composeClientOptions().find(e => {
      const a = this.state.client && this.state.client._id
      return e.value === a
    })
    return res
  }

  onChangeClient = e => {
    this.setState({ client: e.value })
  }

  createHistory = e => {
    const history = [...this.state.history];
    history.push({
      date: "",
      status: ""
    })

    this.setState({ history });
  }

  onChangeHistoryDate = (index, e) => {
    let histories = [...this.state.history];
    let history = { ...histories[index] };

    history.date = e.target.value;

    histories[index] = history;

    this.setState({ history: histories });
  }

  onChangeHistoryStatus = (index, e) => {
    let histories = [...this.state.history];
    let history = { ...histories[index] };

    history.status = e.target.value;

    histories[index] = history;

    this.setState({ history: histories });
  }

  onSubmit = e => {
    e.preventDefault();

    this.props.save(this.state);
  }


  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    return (
      <div>
        <Form id="clientForm" onSubmit={this.onSubmit}>
          <React.Fragment>
            <Container>
              <Row>
                <Col md="12" className="pull-right profile-right-section">
                  <Row className="profile-right-section-row">
                    <Col md="12">
                      <Row>
                        <Col md="12">
                          <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                              <a className="nav-link active" href="#generales" role="tab" data-toggle="tab"><i className="fas fa-user-circle"></i>Generales</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#buzz" role="tab" data-toggle="tab"><i className="fas fa-info-circle"></i>Seguimiento</a>
                            </li>
                          </ul>
                          <div className="tab-content">
                            <div role="tabpanel" className="tab-pane fade show active" id="generales">
                              <Row>
                                <h5 className="swal-title form-title align-left">DATOS DE CLIENTE</h5>
                              </Row>
                              <Form.Row>
                                <Form.Group as={Col} md={5} controlId="client">
                                  <Form.Label>Contratante</Form.Label>
                                  <Select
                                    value={this.selectedClient()}
                                    onChange={this.onChangeClient}
                                    options={this.composeClientOptions()}
                                  />
                                </Form.Group>
                                <Form.Group as={Col} md={7} controlId="affected">
                                  <Form.Label>Afectado</Form.Label>
                                  <Form.Control onChange={this.onChange} value={this.state.affeccted}>
                                  </Form.Control>
                                </Form.Group>
                              </Form.Row>

                              <Row>
                                <h5 className="swal-title form-title align-left">GENERALES</h5>
                              </Row>
                              <Form.Row>
                                <Form.Group as={Col} md="5" controlId="begin_date">
                                  <Form.Label>Fecha inicial</Form.Label>
                                  <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.begin_date)}>
                                  </Form.Control>
                                </Form.Group>
                              </Form.Row>
                              <Form.Row>
                                <Form.Group as={Col} md={6} controlId="folio">
                                  <Form.Label>Folio</Form.Label>
                                  <Form.Control onChange={this.onChange} value={this.state.folio}>
                                  </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} md={6} controlId="sinester">
                                  <Form.Label>Siniestro</Form.Label>
                                  <Form.Control onChange={this.onChange} value={this.state.sinester}>
                                  </Form.Control>
                                </Form.Group>
                              </Form.Row>
                              <Form.Row>
                                <Form.Group as={Col} md={12} controlId="description">
                                  <Form.Label>Padecimiento</Form.Label>
                                  <Form.Control as="textarea" onChange={this.onChange} value={this.state.description} />
                                </Form.Group>
                              </Form.Row>
                            </div>
                            <div role="tabpanel" className="tab-pane fade" id="buzz">
                              <Row>
                                <h5 className="swal-title form-title align-left">SEGUIMIENTO</h5>
                              </Row>
                              <Jumbotron>
                                {this.state.history.map((value, index) => {
                                  return (
                                    <Form.Row>
                                      <Form.Group as={Col} md={3}>
                                        <Form.Label>Fecha</Form.Label>
                                        <Form.Control
                                          type="date"
                                          onChange={(e) => { this.onChangeHistoryDate(index, e) }}
                                          value={this.state.history[index].date} />
                                      </Form.Group>
                                      <Form.Group as={Col} md={9}>
                                        <Form.Label>Estatus</Form.Label>
                                        <Form.Control
                                          onChange={(e) => { this.onChangeHistoryStatus(index, e) }}
                                          value={this.state.history[index].status}>
                                        </Form.Control>
                                      </Form.Group>
                                    </Form.Row>
                                  );
                                })}
                                <Row className="pt-1 pb-2">
                                  <Col md="12">
                                    <Button variant="info" onClick={this.createHistory}><i className="fas fa-plus"></i></Button>
                                  </Col>
                                </Row>
                              </Jumbotron>
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
          <Row className="d-flex">
            <div className="ml-auto mr-4">
              <Button variant="primary" type="submit" className="btn-primary"><i className="fas fa-save"></i></Button>
            </div>
          </Row>
        </Form>
      </div>
    );
  }
}

export default SinesterForm;