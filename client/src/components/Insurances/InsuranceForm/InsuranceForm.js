import React, { Component } from "react";

import {
    Button,
    Col,
    Container,
    Form,
    Row,
  } from 'react-bootstrap';

class InsuranceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }
    
    render() {
        console.log(this.props.type);
        return (
            <Form>
                <Container>
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
                                    <Form.Label>RFC del contratante (Opcional)</Form.Label>
                                    <Form.Control required onChange={this.onChange} value={this.state.rfc}>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Row>
                                <h5 className="swal-title form-title align-left">PÓLIZA</h5>
                            </Row>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="insurance_company">
                                    <Form.Label>Aseguradora</Form.Label>
                                    <Form.Control required onChange={this.onChange} value={this.state.insurance_company}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="policy">
                                    <Form.Label>No. de póliza</Form.Label>
                                    <Form.Control required onChange={this.onChange} value={this.state.policy}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="due_date">
                                    <Form.Label>F. Vencimiento</Form.Label>
                                    <Form.Control required type="date" onChange={this.onChange} value={this.state.due_date}>
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
                                    <Form.Control required as="select" onChange={this.onChange} value={this.state.payment_type}>
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

                            <Row>
                                <h5 className="swal-title form-title align-left">CONTACTO</h5>
                            </Row>

                            <Form.Row>
                                <Form.Group as={Col} md="6" controlId="telephone">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control required type="number" onChange={this.onChange} value={this.state.telephone}>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control required type="email" onChange={this.onChange} value={this.state.email}>
                                        </Form.Control>
                                </Form.Group>
                            </Form.Row>
                        </Col>
                        <Col>
                        {this.props.type === "Autos" && 
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
                        
                        <Row>
                            <h5 className="swal-title form-title align-left">COMENTARIOS</h5>
                        </Row>

                        <Form.Group as={Col} controlId="comments" className={this.state.comments}>
                            <Form.Label>Comentarios</Form.Label>
                            <Form.Control as="textarea" onChange={this.onChange} value={this.state.comments} />
                        </Form.Group>

                        <Row>
                            <h5 className="swal-title form-title align-left">RECIBOS</h5>
                        </Row>

                        </Col>
                    </Row>
                </Container>
            </Form>
        )
    }
}

export default InsuranceForm;