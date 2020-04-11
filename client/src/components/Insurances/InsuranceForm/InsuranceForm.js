import React, { Component } from "react";

import {
    Col,
    Form,
    Row,
  } from 'react-bootstrap';

import "./InsuranceForm.css";

class InsuranceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [{name: "", telephone: ""}],
            invoices: []
        };    
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onInvoicesChange = e => {
        let num_invoces = 0;
        let invoices = [];

        this.setState({ 
            [e.target.id]: e.target.value ,
            invoices: []
        });

        switch(e.target.value){
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

        for(let i = 0; i<num_invoces; i++){
            invoices.push({
                invoice: "",
                due_date: ""
            });
        }

        this.setState({invoices});
    }

    isCarInsurance = () => {
        return this.props.type === "AUTOS";
    }

    render() {
        return (
            <Form>
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
                                        <Form.Group as={Col} md="6" controlId="client_name">
                                            <Form.Label>Contratante</Form.Label>
                                            <Form.Control required onChange={this.onChange} value={this.state.client_name}>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="rfc">
                                            <Form.Label>RFC del contratante</Form.Label>
                                            <Form.Control required onChange={this.onChange} value={this.state.rfc}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>

                                    <Row>
                                        <h5 className="swal-title form-title align-left">PÓLIZA</h5>
                                    </Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="6" controlId="insurance_company">
                                            <Form.Label>Aseguradora</Form.Label>
                                            <Form.Control required onChange={this.onChange} value={this.state.insurance_company}>
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
                                            <Form.Control required type="date" onChange={this.onChange} value={this.state.begin_date}>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="due_date">
                                            <Form.Label>F. Vencimiento</Form.Label>
                                            <Form.Control required type="date" onChange={this.onChange} value={this.state.due_date}>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="pay_due_date">
                                            <Form.Label>F. Vencimiento Pago</Form.Label>
                                            <Form.Control required type="date" onChange={this.onChange} value={this.state.pay_due_date}>
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
                                    { this.isCarInsurance() && 
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
                                                        <Form.Control required  onChange={this.onChange} value={this.state.car_model}>
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
                                                        <Form.Control required  onChange={this.onChange} value={this.state.car_series_number}>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Form.Row>
                                        </>
                                    }
                                </Col>
                                <Col>
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
                                            <Form.Control required  value={this.state.invoices[index].invoice} />
                                            </Form.Group>
                                            <Form.Group as={Col} md="5">
                                            <Form.Label>Fecha de pago</Form.Label>
                                            <Form.Control required type="date" value={this.state.invoices[index].due_date} />
                                            </Form.Group>
                                        </Form.Row> 
                                        );
                                    })}
                        </div>
                      </div>
                      </Col>
                    </Row>
            </Form>
        )
    }
}

export default InsuranceForm;