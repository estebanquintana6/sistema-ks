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
      begin_date: moment().startOf('day').format('YYYY-MM-DD'),
      due_date: moment().startOf('day').format('YYYY-MM-DD'),
      pay_due_date: moment().startOf('day').format('YYYY-MM-DD'),
      company_abbreviations: {}
    };
  }

  componentDidMount() {
    if (this.props.edit) {
      // prepare the insurance data to be rendered in every field
    this.prepareInsuranceForForm()
    } else{
    this.composeCompanyAbbreviations()}
  }

  composeCompanyAbbreviations = () => {
    if(!this.props.companies) return
    let resObj = {}
    this.props.companies.forEach((company) => {
      resObj[company.name] = company.abbreviations
    })
    this.setState({company_abbreviations: resObj})
  }

  prepareInsuranceForForm = () => {
    const auxObj = cloneDeep(this.props.insurance)
    auxObj['edit'] = this.props['edit']
    this.setState(auxObj)
    this.composeCompanyAbbreviations()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.insurance_company !== this.state.insurance_company) {
      this.selectCompanyAndUpdateDays()
      this.composeCompanyAbbreviations()
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
    let num_invoices = 0;
    let invoices = [];

    this.setState({
      [e.target.id]: e.target.value,
      invoices: []
    });

    switch (e.target.value) {
      case "ANUAL":
        num_invoices = 1;
        break;
      case "SEMESTRAL":
        num_invoices = 2;
        break;
      case "TRIMESTRAL":
        num_invoices = 4;
        break;
      case "MENSUAL":
        num_invoices = 12;
        break;
      default:
        num_invoices = 0;
    }

    const jump = num_invoices === 0 ? 12 / 1 : 12/num_invoices;

    const startGenDate = this.state.due_date;

    let prevDate = startGenDate
    for (let i = 0; i < num_invoices; i++) {
      invoices.push({
        invoice: "",
        due_date: moment(newDate||prevDate).format('YYYY-MM-DD'),
        pay_limit: moment(newDate||prevDate).format('YYYY-MM-DD')
      });

      let newDate = moment(prevDate).clone().startOf('day').add(jump, 'months')
      prevDate = moment(newDate).clone().startOf('day')

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

  onChangeInvoiceLimitDate = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.pay_limit = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onSubmit = e => {
    e.preventDefault();
    const formattedObject = {...this.state, policy: (this.props.edit ? '' :this.state.abbreviation) + this.state.policy}
    // if im not editing the client, create one
    if (!this.state.edit) {
      this.props.save(formattedObject);
      return;
    }
    this.props.updateInsurance(formattedObject)
  }

  formatDate = (date) => moment(date).format('YYYY-MM-DD')

  companyOptions = () => {
    return this.state.company_abbreviations[this.filterInsuranceCompany()] || []
  }

  filterInsuranceCompany = () => {
    if (!this.state.insurance_company || !this.props.companies) return;
    const lookup = this.props.edit ? this.state.insurance_company._id : this.state.insurance_company
    return this.props.companies.find(company => company._id === lookup).name
  }

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
                          {this.props.clients.map((client) => client && <option key={client._id} value={client._id}>{`${client.name} ${client.rfc}`}</option>)}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <Row>
                      <h5 className="swal-title form-title align-left">PÓLIZA</h5>
                    </Row>
                    <Form.Row>
                      <Form.Group as={Col} md="12" controlId="insurance_company">
                        <Form.Label>Aseguradora</Form.Label>
                        <Form.Control required as="select" onChange={this.onChange} value={this.state.insurance_company && this.state.insurance_company._id}>
                          <option></option>
                          {this.props.companies.map((company) => <option value={company._id}>{`${company.name}`}</option>)}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      {! this.props.edit &&<Form.Group as={Col} md="6" controlId="abbreviation">
                        <Form.Label>Clave</Form.Label>
                        <Form.Control required as="select" onChange={this.onChange} value={this.state.abbreviation}>
                          <option></option>
                          {this.companyOptions().map((abbr) => <option value={abbr.name}>{abbr.name}</option>)}
                        </Form.Control>
                      </Form.Group>}
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
                      <Form.Group as={Col} md="4">
                        <Form.Label>Recibo</Form.Label>
                        <Form.Control required onChange={(e) => { this.onChangeInvoice(index, e) }} value={this.state.invoices[index].invoice} />
                      </Form.Group>
                      <Form.Group as={Col} md="4">
                        <Form.Label>Fecha de pago</Form.Label>
                        <Form.Control required type="date" onChange={(e) => { this.onChangeInvoiceDate(index, e) }} value={this.formatDate(this.state.invoices[index].due_date)} />
                      </Form.Group>
                      <Form.Group as={Col} md="4">
                        <Form.Label>Vencimiento de pago</Form.Label>
                        <Form.Control required type="date" onChange={(e) => { this.onChangeInvoiceLimitDate(index, e) }} value={this.formatDate(this.state.invoices[index].pay_limit)} />
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