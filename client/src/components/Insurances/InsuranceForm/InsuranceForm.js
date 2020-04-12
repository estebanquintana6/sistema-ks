import React, { Component } from "react";

import {
  Button,
  Col,
  Form,
  Row,
} from 'react-bootstrap';

import "./InsuranceForm.css";
import moment from 'moment'
import { cloneDeep } from 'lodash'

class InsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance_type: this.props.type,
      invoices: [],
      begin_date: moment().format('YYYY-MM-DD'),
      due_date: moment().format('YYYY-MM-DD'),
      pay_due_date: moment().format('YYYY-MM-DD')
    };
  }

  componentDidMount() {
    if (!this.props.edit) return;
    // prepare the insurance data to be rendered in every field
    this.prepareInsuranceForForm()
  }

  prepareInsuranceForForm = () => {
    const auxObj = cloneDeep(this.props.insurance)
    auxObj['edit'] = this.props['edit']
    this.setState(auxObj)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.insurance_company !== this.state.insurance_company) {
      this.selectCompanyAndUpdateDays()
    }

    if (prevState.begin_date !== this.state.begin_date) {
      this.selectCompanyAndUpdateDays()
    }
  }

  selectCompanyAndUpdateDays = () => {
    const company = this.getFullCompany()
    if (!company) return;
    this.updatePlusCompanyDays(company.tolerance)
  }

  updatePlusCompanyDays = (daysToAdd) => {
    this.setState({ pay_due_date: moment(this.state.begin_date).add(daysToAdd, 'days').format('YYYY-MM-DD') })
  }

  shouldModifyDate = (param) => {
    return param === 'begin_date' || param === 'insurance_company'
  }

  getFullCompany = () => {
    return this.props.companies.find(company => company._id === this.state.insurance_company) || null
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  }

  onInvoicesChange = e => {
    let num_invoces = 0;
    let invoices = [];

    this.setState({
      [e.target.id]: e.target.value,
      invoices: []
    });

    switch (e.target.value) {
      case "ANUAL":
        num_invoces = 1;
        break;
      case "SEMESTRAL":
        num_invoces = 2;
        break;
      case "TRIMESTRAL":
        num_invoces = 4;
        break;
      case "MENSUAL":
        num_invoces = 12;
        break;
      default:
        num_invoces = 0;
    }

    for (let i = 0; i < num_invoces; i++) {
      invoices.push({
        invoice: "",
        due_date: ""
      });
    }

    this.setState({ invoices });
  }

  isCarInsurance = () => {
    return this.props.type === "AUTOS";
  }

  onChangeInvoice = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.invoice = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onChangeInvoiceDate = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.due_date = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onSubmit = e => {
    e.preventDefault();
    // if im not editing the client, create one
    if (!this.state.edit) {
      this.props.save(this.state);
      return;
    }
    // const newClientData = this.prepareClientDataForSave(this.state)
    this.props.updateInsurance(this.state)
  }

  formatDate = (date) => moment(date).format('YYYY-MM-DD')

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Row>
          <Col md="12" className="pull-right profile-right-section">
            <Row className="profile-right-section-row">
            </Row>
          </Col>
          <Col md="12">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" onClick={this.update}>
                <a className="nav-link active" href="#i-types" role="tab" data-toggle="tab"><i className="fas fa-building"></i>Generales</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#invoices" role="tab" data-toggle="tab"><i className="fas fa-receipt"></i> Recibos</a>
              </li>
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane fade show active" id="i-types">
                <Row>
                  <Col md="6">
                    <Row>
                      <h5 className="swal-title form-title align-left">CONTRATANTE</h5>
                    </Row>
                    <Form.Row>
                      <Form.Group as={Col} md="6" controlId="client">
                        <Form.Label>Contratante</Form.Label>
                        <Form.Control required as="select" onChange={this.onChange} value={this.state.client && this.state.client._id}>
                          <option></option>
                          {this.props.clients.map((client) => client && <option value={client._id}>{`${client.name} ${client.rfc}`}</option>)}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <Row>
                      <h5 className="swal-title form-title align-left">PÓLIZA</h5>
                    </Row>
                    <Form.Row>
                      <Form.Group as={Col} md="6" controlId="insurance_company">
                        <Form.Label>Aseguradora</Form.Label>
                        <Form.Control required as="select" onChange={this.onChange} value={this.state.insurance_company && this.state.insurance_company._id}>
                          <option></option>
                          {this.props.companies.map((company) => <option value={company._id}>{`${company.name}`}</option>)}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="6" controlId="policy">
                        <Form.Label>No. de póliza</Form.Label>
                        <Form.Control required onChange={this.onChange} value={this.state.policy}>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col} md="4" controlId="begin_date">
                        <Form.Label>F. Inicio Poliza</Form.Label>
                        <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.begin_date)}>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="due_date">
                        <Form.Label>F. Vencimiento</Form.Label>
                        <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.due_date)}>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="pay_due_date">
                        <Form.Label>F. Vencimiento Pago</Form.Label>
                        <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.pay_due_date)}>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <hr></hr>
                    <Form.Row>
                      <Form.Group as={Col} md="4" controlId="bounty">
                        <Form.Label>Prima Total</Form.Label>
                        <Form.Control required type="number" onChange={this.onChange} value={this.state.bounty}>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="payment_type">
                        <Form.Label>Forma de pago</Form.Label>
                        <Form.Control required as="select" onChange={this.onInvoicesChange} value={this.state.payment_type}>
                          <option></option>
                          <option value="ANUAL">Anual</option>
                          <option value="SEMESTRAL">Semestral</option>
                          <option value="TRIMESTRAL">Trimestral</option>
                          <option value="MENSUAL">Mensual</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="currency">
                        <Form.Label>Moneda</Form.Label>
                        <Form.Control required as="select" onChange={this.onChange} value={this.state.currency}>
                          <option></option>
                          <option value="PESO">Peso</option>
                          <option value="DOLAR">Dólar</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  </Col>
                  <Col>
                    {this.isCarInsurance() &&
                      <>
                        <Row>
                          <h5 className="swal-title form-title align-left">DATOS AUTO</h5>
                        </Row>
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="cis">
                            <Form.Label>CIS</Form.Label>
                            <Form.Control required onChange={this.onChange} value={this.state.cis}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="car_model">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control required onChange={this.onChange} value={this.state.car_model}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>

                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="car_description">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control required onChange={this.onChange} value={this.state.car_description}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="car_series_number">
                            <Form.Label>No. Serie</Form.Label>
                            <Form.Control required onChange={this.onChange} value={this.state.car_series_number}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                      </>
                    }
                    <Row>
                      <h5 className="swal-title form-title align-left">COMENTARIOS</h5>
                    </Row>

                    <Form.Group as={Col} controlId="comments" className={this.state.comments}>
                      <Form.Label>Comentarios</Form.Label>
                      <Form.Control as="textarea" onChange={this.onChange} value={this.state.comments} />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div role="tabpanel" className="tab-pane fade" id="invoices">
                <Row>
                  <h5 className="swal-title form-title align-left">RECIBOS</h5>
                </Row>

                {this.state.invoices.map((value, index) => {
                  return (
                    <Form.Row>
                      <Form.Group as={Col} md="6">
                        <Form.Label>Recibo</Form.Label>
                        <Form.Control required onChange={(e) => { this.onChangeInvoice(index, e) }} value={this.state.invoices[index].invoice} />
                      </Form.Group>
                      <Form.Group as={Col} md="5">
                        <Form.Label>Fecha de pago</Form.Label>
                        <Form.Control required type="date" onChange={(e) => { this.onChangeInvoiceDate(index, e) }} value={this.state.invoices[index].due_date} />
                      </Form.Group>
                    </Form.Row>
                  );
                })}

                <Button variant="primary" type="submit">Guardar</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form >
    )
  }
}

export default InsuranceForm;