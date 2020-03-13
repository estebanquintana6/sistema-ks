import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import {registerSecom, getSecoms} from "../../../actions/registerSecom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";


import { 
    Form, 
    Col,
    Row,
    Button} from 'react-bootstrap';

import "./SecomForm.css"


class SecomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            llamarField: "invisible"
        };
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.registerSecom(this.state);
    }

    handleCampana = e => {
       this.onChange(e);
        let fieldVal = e.target.value;

        if(fieldVal !== "Posible venta"){
            this.setState({llamarField: "invisible"})
        } else {
            this.setState({llamarField: "visible"})
        }
    }

    render() {
        return(
            <>      
            <Col>
                <Form onSubmit={this.onSubmit}>

                    <Row>
                        <Col>
                            <h2>SECOM</h2>
                            <h5>Fecha</h5>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="fecha">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control disabled type="date" value={moment(new Date()).format('YYYY-MM-DD')} placeholder="..." />
                                </Form.Group>
                            </Form.Row>

                            <h5>Cliente</h5>
                            <Form.Row>
                                <Form.Group as={Col} controlId="name">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control required onChange={this.onChange} placeholder="..." />
                                </Form.Group>

                                <Form.Group as={Col} controlId="last_name1">
                                <Form.Label>Apellido Paterno</Form.Label>
                                <Form.Control required onChange={this.onChange} placeholder="..." />
                                </Form.Group>

                                <Form.Group as={Col} controlId="last_name2">
                                <Form.Label>Apellido Materno</Form.Label>
                                <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="campana">
                                    <Form.Label>Campaña</Form.Label>
                                    <Form.Control required as="select" onChange={this.onChange} placeholder="...">
                                        <option></option>
                                        <option value="AUTOTAL">Autotal</option>
                                        <option value="CAPTACION">Captacion</option>
                                        <option value="CREDITO PERSONAL">Credito personal</option>
                                        <option value="CREDITO PYME">Credito Pyme</option>                                        
                                        <option value="DAÑOS">Daños</option>                                        
                                        <option value="GASTOS MEDICOS">Gastos Medicos</option>                                        
                                        <option value="TDC">TDC</option>                                        
                                        <option value="VIDA">Vida</option>                                        
                                        <option value="TPV">TPV</option>                                        
                                        <option value="OTRO">Otro</option>                                        
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="status">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control required as="select" onChange={this.handleCampana.bind(this)}>
                                        <option></option>
                                        <option>Venta</option>
                                        <option>Posible venta</option>
                                        <option>No venta</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="callDate" className={this.state.llamarField}>
                                    <Form.Label>Fecha de llamada</Form.Label>
                                    <Form.Control onChange={this.onChange} type="date" placeholder="..." />
                                </Form.Group>
                            </Form.Row>
                            <h5>Contacto</h5>
                            <Form.Row>
                                <Form.Group as={Col} md="6" controlId="telefono">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control required onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                            </Form.Row>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                </Form>
            </Col>
            </>
        );
    }

}
SecomForm.propTypes = {
    registerSecom: PropTypes.func.isRequired,
    getSecoms: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

  export default connect(
    mapStateToProps,
    { registerSecom, getSecoms }
  )(withRouter(SecomForm));