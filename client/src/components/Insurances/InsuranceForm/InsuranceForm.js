import React, { Component } from "react";

import {
  Button,
  Col,
  Form,
  Row,
  Jumbotron
} from 'react-bootstrap';

import "./InsuranceForm.css";
import moment from 'moment';
import { cloneDeep } from 'lodash';
import Select from 'react-select';



class InsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance_type: this.props.type || this.props.insurance.insurance_type,
      invoices: [],
      endorsements: [],
      begin_date: moment().startOf('day').format('YYYY-MM-DD'),
      due_date: moment().clone().add(1, 'year').startOf('day').format('YYYY-MM-DD'),
      pay_due_date: moment().startOf('day').format('YYYY-MM-DD'),
    };
  }

  componentDidMount() {
    if (this.props.edit) {
      // prepare the insurance data to be rendered in every field
    this.prepareInsuranceForForm()
    }
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
      this.updateInsuranceEndDate()
    }
  }

  updateInsuranceEndDate = () => {
    this.updateEndDate()
  }

  selectCompanyAndUpdateDays = () => {
    const company = this.getFullCompany()
    if (!company) return;
    this.updatePlusCompanyDays(company.tolerance)
  }

  updateEndDate = () => {
    this.setState({ due_date: moment(this.state.begin_date).add(1, 'year').format('YYYY-MM-DD') })
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

  onChangeClient = e => {
    this.setState({client: e.value})
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
    prevDate = prevDate.split('T')[0]
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

  onChangeInvoiceBounty = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.bounty = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onChangeInvoiceStatus = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.payment_status = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onChangeInvoiceComment = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.comments = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onChangeInvoiceEmail = (index, e) => {
    let invoices = [...this.state.invoices];
    let invoice = { ...invoices[index] };

    invoice.email = e.target.value;

    invoices[index] = invoice;
    this.setState({ invoices });
  }

  onSubmit = e => {
    e.preventDefault();
    if (!this.state.edit) {
      this.props.save(this.state);
      return;
    }
    this.props.updateInsurance(this.state)
  }

  formatDate = (date) => {
    if (!date) return;
    const days = date.split('T')[0]
    return moment(days).startOf('day').format('YYYY-MM-DD')
  }

  filterInsuranceCompany = () => {
    if (!this.state.insurance_company || !this.props.companies) return;
    const lookup = this.props.edit ? this.state.insurance_company._id : this.state.insurance_company
    return this.props.companies.find(company => company._id === lookup).name
  }

  composeCarYears = () => {
    const result = [];
    const endYear = moment().add(1, 'year').startOf('year').year()
    for(let i = 1990; i<=endYear; i++){
      result.push(i)
    }
    return result
  }

  createEndorsment = () => {
    const endorsements = [...this.state.endorsements];

    let today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    endorsements.push({
      comment: "",
      date: today
    })

    this.setState({endorsements});
  }

  onChangeEndorsement = (index, e) => {
    let endorsements = [...this.state.endorsements];
    let endorsement = { ...endorsements[index] };

    endorsement.comment = e.target.value;

    endorsements[index] = endorsement;
    this.setState({ endorsements });
  }

  deleteEndorsement = (index) => {
    const endorsements = [...this.state.endorsements];
    endorsements.splice(index, 1);

    this.setState({ endorsements });
  }

  createInvoice = () => {
    const invoices = [...this.state.invoices];
    invoices.push({
      invoice: "",
      due_date: "",
      pay_limit: ""
    })
    this.setState({ invoices });
  }

  deleteInvoice = (index) => {
    const invoices = [...this.state.invoices];
    invoices.splice(index, 1);
    this.setState({ invoices });
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

  render() {
    let generalActive = "show active";
    let invoicesActive = "";

    if(this.props.invoicePanel){
      generalActive = "";
      invoicesActive = "show active";
    } 
    console.log(this.props.invoicePanel);
    console.log(generalActive);
    console.log(invoicesActive);

    return (
      <Form onSubmit={this.onSubmit}>
        <Row>
          <Col md="12" className="pull-right profile-right-section">
            <Row className="justify-content-md-center">
              <Button variant="primary" type="submit">Guardar</Button>
            </Row>
          </Col>
          <Col md="12">
            <ul className="nav nav-tabs" role="tablist">
                {this.props.invoicePanel === false 
                 ? <React.Fragment>
                    <li className="nav-item" onClick={this.update}>
                      <a className="nav-link active" href="#i-types" role="tab" data-toggle="tab"><i className="fas fa-building"></i>Generales</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#invoices" role="tab" data-toggle="tab"><i className="fas fa-receipt"></i> Recibos</a>
                    </li>
                    { this.props.edit && 
                      <li className="nav-item">
                        <a className="nav-link" href="#endor" role="tab" data-toggle="tab"><i className="fas fa-edit"></i>Endosos</a>
                      </li>
                    }
                  </React.Fragment>
                  : <li className="nav-item">
                      <a className="nav-link active" href="#invoices" role="tab" data-toggle="tab"><i className="fas fa-receipt"></i> Recibos</a>
                    </li>
                }
                {this.props.invoice}
                
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className={`tab-pane fade ${generalActive}`} id="i-types">
                <Row>
                  <Col md="6">
                    <Row>
                      <h5 className="swal-title form-title align-left">CONTRATANTE</h5>
                    </Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="client">
                        <Form.Label>Contratante</Form.Label>
                        <Select
                          value={this.selectedClient()}
                          onChange={this.onChangeClient}
                          options={this.composeClientOptions()}
                        />
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
                      <Form.Group as={Col} md="6" controlId="policy">
                        <Form.Label>No. de póliza</Form.Label>
                        <Form.Control onChange={this.onChange} value={this.state.policy}>
                        </Form.Control>
                      </Form.Group>
                      {this.isCarInsurance() &&
                      <>
                        <Form.Group as={Col} md="6" controlId="cis">
                          <Form.Label>CIS</Form.Label>
                          <Form.Control onChange={this.onChange} value={this.state.cis}>
                          </Form.Control>
                        </Form.Group>
                      </>}
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col} md="6" controlId="begin_date">
                        <Form.Label>F. Inicio Poliza</Form.Label>
                        <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.begin_date)}>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="6" controlId="due_date">
                        <Form.Label>F. Vencimiento</Form.Label>
                        <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.due_date)}>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                    <Form.Group as={Col} md="6" controlId="pay_due_date">
                        <Form.Label>F. Vencimiento Pago</Form.Label>
                        <Form.Control required type="date" onChange={this.onChange} value={this.formatDate(this.state.pay_due_date)}>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <hr></hr>
                    <Form.Row>
                      <Form.Group as={Col} md="4" controlId="bounty">
                        <Form.Label>Prima Total</Form.Label>
                        <Form.Control type="number" onChange={this.onChange} value={this.state.bounty}>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="payment_type">
                        <Form.Label>Forma de pago</Form.Label>
                        <Form.Control as="select" onChange={this.onInvoicesChange} value={this.state.payment_type}>
                          <option></option>
                          <option value="ANUAL">Anual</option>
                          <option value="SEMESTRAL">Semestral</option>
                          <option value="TRIMESTRAL">Trimestral</option>
                          <option value="MENSUAL">Mensual</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="currency">
                        <Form.Label>Moneda</Form.Label>
                        <Form.Control as="select" onChange={this.onChange} value={this.state.currency}>
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
                            <Form.Group as={Col}>
                              <Form.Label>Marca</Form.Label>
                              <input type="text" 
                                      id="car_brand" 
                                      list="data" 
                                      onChange={this.onChange} 
                                      className="form-control" 
                                      value={this.state.car_brand}/>
                              <datalist id="data">
                                <option></option>
                                <option value="VOLKSWAGEN">VOLKSWAGEN</option>
                                <option value="MITSUBISHI">MITSUBISHI</option>
                                <option value="FORD">FORD</option>
                                <option value="CHEVROLET">CHEVROLET</option>
                                <option value="NISSAN">NISSAN</option>
                                <option value="MAZDA">MAZDA</option>
                                <option value="TOYOTA">TOYOTA</option>
                                <option value="HONDA">HONDA</option>
                                <option value="HYUNDAI">HYUNDAI</option>
                                <option value="SUZUKI">SUZUKI</option>
                                <option value="BMW">BMW</option>
                                <option value="MERCEDES BENZ">MERCEDES BENZ</option>
                                <option value="LINCOLN">LINCOLN</option>
                                <option value="CADILLAC">CADILLAC</option>
                                <option value="GENERAL MOTORS">GENERAL MOTORS</option>
                                <option value="KIA">KIA</option>
                                <option value="SEAT">SEAT</option>
                                <option value="AUDI">AUDI</option>
                                <option value="JEEP">JEEP</option>
                                <option value="VOLVO">VOLVO</option>
                                <option value="TESLA">TESLA</option>
                                <option value="RAM">RAM</option>
                              </datalist>
                          </Form.Group>

                          <Form.Group as={Col} md="6" controlId="car_year">
                            <Form.Label>Año</Form.Label>
                            <Form.Control as="select" onChange={this.onChange} value={this.state.car_year}>
                              <option></option>
                              {this.composeCarYears().map(year => <option value={year}>{year}</option>)}
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>

                        <Form.Row>
                          <Form.Group as={Col} md="12" controlId="car_description">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control onChange={this.onChange} value={this.state.car_description}>
                            </Form.Control>
                          </Form.Group>

                        </Form.Row>
                        
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="car_series_number">
                            <Form.Label>No. Serie</Form.Label>
                            <Form.Control onChange={this.onChange} value={this.state.car_series_number}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="car_placas">
                            <Form.Label>Placas</Form.Label>
                            <Form.Control onChange={this.onChange} value={this.state.car_placas}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="car_color">
                            <Form.Label>Color</Form.Label>
                            <Form.Control onChange={this.onChange} value={this.state.car_color}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="car_motor">
                            <Form.Label>No. Motor</Form.Label>
                            <Form.Control onChange={this.onChange} value={this.state.car_motor}>
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
                    {this.state.active_status === false && 
                      <>
                        <Row>
                          <h5 className="swal-title form-title align-left">NOTA DE CANCELACIÓN</h5>
                        </Row>
                        <Form.Group as={Col} controlId="cancelation_note" className={this.state.cancelation_note}>
                          <Form.Label>Nota:</Form.Label>
                          <Form.Control as="textarea" onChange={this.onChange} value={this.state.cancelation_note} />
                        </Form.Group>
                      </>
                    }
                    <Row>

                    </Row>
                  </Col>
                </Row>
              </div>

              <div role="tabpanel" className={`tab-pane fade ${invoicesActive}`} id="invoices">
                <Row>
                  <h5 className="swal-title form-title align-left">RECIBOS</h5>
                </Row>
                <Row className="pt-1 pb-2">
                  <Col md="12">
                    <Button variant="info" onClick={this.createInvoice}>AGREGAR</Button>
                  </Col>
                </Row>

                {this.state.invoices.map((value, index) => {
                  return (
                    <Jumbotron className="mt-3">
                    <Form.Row>
                      <Form.Group as={Col} md="4">
                        <Form.Label>Recibo</Form.Label>
                        <Form.Control required onChange={(e) => { this.onChangeInvoice(index, e) }} value={this.state.invoices[index].invoice} />
                      </Form.Group>
                      <Form.Group as={Col} md="3">
                        <Form.Label>Fecha límite de pago</Form.Label>
                        <Form.Control required type="date" onChange={(e) => { this.onChangeInvoiceDate(index, e) }} value={this.formatDate(this.state.invoices[index].due_date)} />
                      </Form.Group>
                      <Form.Group as={Col} md="2">
                        <Form.Label>Prima</Form.Label>
                        <Form.Control type="number" onChange={(e) => { this.onChangeInvoiceBounty(index, e) }} value={this.state.invoices[index].bounty} />
                      </Form.Group>
                      <Form.Group as={Col} md="2">
                        <Form.Label>Estatus</Form.Label>
                        <Form.Control as="select" onChange={(e) => { this.onChangeInvoiceStatus(index, e) }} value={this.state.invoices[index].payment_status}>
                          <option></option>
                          <option selected value="PENDIENTE">Pendiente</option>
                          <option value="PAGADO">Pagado</option>
                          <option value="VENCIDO">Vencido</option>
                          <option value="SALDO A FAVOR">Saldo a Favor</option>
                        </Form.Control>
                      </Form.Group>
                      <Col md="1">
                          <Button variant="danger" className="align-center" onClick={() => { this.deleteInvoice(index) }}><i className="fa fa-trash" /></Button>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="6">
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control onChange={(e) => { this.onChangeInvoiceComment(index, e) }} value={this.state.invoices[index].comments} />
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control onChange={(e) => { this.onChangeInvoiceEmail(index, e) }} value={this.state.invoices[index].email} />
                      </Form.Group>
                    </Form.Row>
                    </Jumbotron>
                  );
                })}
              </div>
              <div role="tabpanel" className="tab-pane fade" id="endor">
                <Row>
                  <h5 className="swal-title form-title align-left">ENDOSOS</h5>
                </Row>
                <Row>
                  <Col md="12">
                    <Button variant="info" onClick={this.createEndorsment}><i className="fa fa-plus" aria-hidden="true"></i></Button>
                  </Col>
                </Row>
                {this.state.endorsements.map((value, index) => {
                    return (
                      <Form.Row>
                        <Form.Group as={Col} md={{span: 8}}>
                          <Form.Label>Comentario</Form.Label>
                          <Form.Control onChange={(e) => {this.onChangeEndorsement(index, e)}} value={this.state.endorsements[index].comment} />
                        </Form.Group>
                        <Form.Group as={Col} md={{span: 3}}>
                          <Form.Label>Fecha</Form.Label>
                          <Form.Control type="date" disabled value={this.state.endorsements[index].date} />
                        </Form.Group>
                        <Col md={1}>
                          <Button 
                            variant="danger" 
                            className="button-margin"
                            onClick={() => { this.deleteEndorsement(index) }}>
                              <i className="fa fa-trash"/>
                          </Button>
                        </Col>
                      </Form.Row>
                    );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Form >
    )
  }
}

export default InsuranceForm;