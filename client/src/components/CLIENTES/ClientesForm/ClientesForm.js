import 'date-fns';

import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import {registerClient} from "../../../actions/registerClient";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MomentUtils from "@date-io/moment";
import moment from "moment";

import { 
    Form, 
    Col,
    Row,
    Button} from 'react-bootstrap';
    
import Grid from '@material-ui/core/Grid';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';

import "./ClientesForm.css"
import "moment/locale/es";


moment.locale("es"); // it is required to select default locale manually


class ClientesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: ["producto1"],
            porcerrar: ["porCerrar1"],
            llamarField: "invisible",
            showRazonSocial: "visible",
            nameSize: "4"
        };
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };


    onRazonsocialChange = e => {
        if(e.target.value === "Moral"){
            this.setState({
                nameSize: "6",
                showRazonSocial: "invisible"
            });
            try{
                document.getElementById("last_name1").value = "";
                document.getElementById("last_name2").value = "";
                document.getElementById("civil").value = "";
                document.getElementById("ocupacion").value = "";
                document.getElementById("sexo").value = "";
            } catch (err) {
                console.log(err);
            }

            this.setState({ cumpleanos : "" });
        } else {
            this.setState({
                nameSize: "4",
                showRazonSocial: "visible"
            });
        }
        this.setState({ [e.target.id]: e.target.value });
      };

    

    onBirthdayDate = (date) => {
        this.setState({ cumpleanos : date });
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.registerClient(this.state);
    }

    addProduct = e => {
        const nuevoNumero = this.state.productos.length + 1;
        const id = "producto" + nuevoNumero;

        this.setState({
            productos: this.state.productos.concat(id)
        });
    }

    addPorCerrar = e => {
        const nuevoNumero = this.state.porcerrar.length + 1;
        const id = "porCerrar" + nuevoNumero;

        this.setState({
            porcerrar: this.state.porcerrar.concat(id)
        });
    }

    removePorCerrar = e => {
        const porcerrar = this.state.porcerrar;
        const last = porcerrar.pop();

        this.setState({
            porcerrar: porcerrar
        });

        let newState = this.state;
        
        delete newState[last];

        this.setState(newState);
    }

    removeProduct = e => {
        const productos = this.state.productos;
        const last = productos.pop();

        this.setState({
            productos: productos
        });

        let newState = this.state;
        
        delete newState[last];

        this.setState(newState);
    }


    handleCampana = e => {
        this.onChange(e);

        for(let i in this.state.porcerrar){
            const status = this.state.porcerrar[i];
            let input = document.getElementById("status" + status);
            let fieldVal = input.value;

            if(fieldVal !== "Posible venta"){
                this.setState({llamarField: "invisible"})
            } else {
                this.setState({llamarField: "visible"})
                break;
            }
        }


    }

    render() {
        return(
            <>
                <Row>
                    <h2>Registro de cliente</h2>
                </Row>
                <Row className="mt-4">
                    <Form id="clientForm" onSubmit={this.onSubmit}>
                        <Row>
                        <Col>
                            <h5>Cliente</h5>
                            <Form.Row>
                            <Form.Group as={Col} md="4" controlId="razon_social">
                                <Form.Label>Razon social</Form.Label>
                                <Form.Control required as="select" onChange={this.onRazonsocialChange} placeholder="...">
                                        <option></option>
                                        <option value="Fisica">Persona fisica</option>
                                        <option value="Moral">Persona moral</option>
                                </Form.Control>                            
                            </Form.Group>

                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md={this.state.nameSize} controlId="name">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control required onChange={this.onChange} placeholder="..." />
                                </Form.Group>

                                <Form.Group as={Col} controlId="last_name1" className={this.state.showRazonSocial}>
                                <Form.Label>Apellido Paterno</Form.Label>
                                <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>

                                <Form.Group as={Col} controlId="last_name2" className={this.state.showRazonSocial}>
                                <Form.Label>Apellido Materno</Form.Label>
                                <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                            </Form.Row>

                            <h5>Direccion</h5>
                            
                            <Form.Row>
                                <Form.Group as={Col} md="8" controlId="calle">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                                <Form.Group as={Col} md="2" controlId="exterior">
                                    <Form.Label>Ext</Form.Label>
                                    <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                                <Form.Group as={Col} md="2" controlId="interior">
                                    <Form.Label>Int</Form.Label>
                                    <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="colonia">
                                    <Form.Label>Colonia</Form.Label>
                                    <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="cp">
                                    <Form.Label>Codigo postal</Form.Label>
                                    <Form.Control onChange={this.onChange} type="number" placeholder="..." />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="estado">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                        <option value="Aguascalientes">Aguascalientes</option>
                                        <option value="Baja California">Baja California</option>
                                        <option value="Baja California Sur">Baja California Sur</option>
                                        <option value="Campeche">Campeche</option>
                                        <option value="Chiapas">Chiapas</option>
                                        <option value="Chihuahua">Chihuahua</option>
                                        <option value="Coahuila">Coahuila</option>
                                        <option value="Colima">Colima</option>
                                        <option value="Durango">Durango</option>
                                        <option value="Estado de Mexico">Estado de Mexico</option>
                                        <option value="Guanajuato">Guanajuato</option>
                                        <option value="Guerrero">Guerrero</option>
                                        <option value="Hidalgo">Hidalgo</option>
                                        <option value="Jalisco">Jalisco</option>
                                        <option value="CDMX">CDMX</option>
                                        <option value="Michoacan">Michoacan</option>
                                        <option value="Morelos">Morelos</option>
                                        <option value="Nayarit">Nayarit</option>
                                        <option value="Nuevo Leon">Nuevo Leon</option>
                                        <option value="Oaxaca">Oaxaca</option>
                                        <option value="Puebla">Puebla</option>
                                        <option value="Queretaro">Queretaro</option>
                                        <option value="Quintana Roo">Quintana Roo</option>
                                        <option value="San Luis Potosi">San Luis Potosi</option>
                                        <option value="Sinaloa">Sinaloa</option>
                                        <option value="Sonora">Sonora</option>
                                        <option value="Tabasco">Tabasco</option>
                                        <option value="Tamaulipas">Tamaulipas</option>
                                        <option value="Tlaxcala">Tlaxcala</option>
                                        <option value="Veracruz">Veracruz</option>
                                        <option value="Yucatan">Yucatan</option>
                                        <option value="Zacatecas">Zacatecas</option>
                                    </Form.Control>                                      
                                </Form.Group>
                            </Form.Row>
                            <h5>Personales</h5>
                            {this.state.razon_social === "Fisica" &&
                                <>
                                    <Form.Row>
                                        <Col md="4">
                                        <Form.Label>Fecha de nacimiento</Form.Label>
        
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <Grid container justify="space-around">
                                                <DatePicker
                                                id="cumpleanos"
                                                value={this.state.cumpleanos}
                                                placeholder="DD/MM/YYYY"
                                                format={"DD/MM/YYYY"}
                                                onChange={this.onBirthdayDate}
                                                autoOk={true}
                                                clearable
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                        </Col>
                                        <Form.Group as={Col} md="4" controlId="sexo">
                                            <Form.Label>Sexo</Form.Label>
                                            <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                                <option>Hombre</option>
                                                <option>Mujer</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="civil">
                                            <Form.Label>Estado civil</Form.Label>
                                            <Form.Control as="select" onChange={this.onChange} placeholder="...">
                                                <option></option>
                                                <option>Soltero</option>
                                                <option>Casado</option>
                                                <option>Viudo</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="ocupacion">
                                            <Form.Label>Ocupacion</Form.Label>
                                                <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                                    <option>Empleado</option>
                                                    <option>Independiente</option>
                                                    <option>Desempleado</option>
                                                </Form.Control>                                
                                        </Form.Group>
                                    </Form.Row> 
                                </>
                            }
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="gastosmedicos">
                                    <Form.Label>Gastos Médicos</Form.Label>
                                        <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                            <option>Si</option>
                                            <option>No</option>
                                        </Form.Control>                                
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="segurovida">
                                    <Form.Label>Seguro de Vida</Form.Label>
                                        <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                            <option>Si</option>
                                            <option>No</option>
                                        </Form.Control>                                
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="afore">
                                    <Form.Label>Afore</Form.Label>
                                        <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                            <option>Si</option>
                                            <option>No</option>
                                        </Form.Control>                                
                                </Form.Group>
                            </Form.Row>   
                        </Col>
                        <Col className="ml-4">
                            <h5>Contacto</h5>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="wp">
                                    <Form.Label>Whatsapp</Form.Label>
                                    <Form.Control onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="telefono">
                                    <Form.Label>Directo</Form.Label>
                                    <Form.Control required onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="email">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control onChange={this.onChange} type="email" placeholder="..." />
                                </Form.Group>
                            </Form.Row>
                            <h5>Comercial</h5>
                            <Row className="mt-4">
                                <Col md="4" className="products-buttons-div">
                                    <Row>
                                        <Button type="button" onClick={this.addProduct}>Añadir</Button>
                                    </Row>
                                    <Row className="mt-4">
                                        <Button type="button" variant="danger" onClick={this.removeProduct}>Quitar</Button>
                                    </Row>
                                </Col>
                                <Col md="8">
                                    <Form.Row>
                                    {this.state.productos.map((value, index) => {
                                        return(
                                            <Form.Group as={Col} md="4" controlId={value}>
                                                <Form.Label>Producto {index+1}</Form.Label>
                                                <Form.Control as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                                    <option value="INVERSION">Inversion</option>
                                                    <option value="CREDITO">Credito</option>
                                                    <option value="TDC">TDC</option>
                                                    <option value="VRIM">Vrim</option>
                                                    <option value="DAÑOS">Daños</option>
                                                    <option value="AUTOS">Autos</option>
                                                    <option value="VIDA">Vida</option>
                                                    <option value="GASTOS MEDICOS">Gastos medicos</option>
                                                    <option value="BAJO COSTO">Bajo costo</option>
                                                    <option value="AFORE">Afore</option>
                                                    <option value="OTRO">Otro</option>
                                                </Form.Control>                                                 
                                            </Form.Group>
                                        )
                                    })}
                                    </Form.Row>
                                </Col>
                            </Row>
                            <h5 className="mt-4">Por cerrar</h5>
                            <Row className="mt-4">
                                <Col md="4" className="products-buttons-div">
                                        <Row>
                                            <Button type="button" onClick={this.addPorCerrar}>Añadir</Button>
                                        </Row>
                                        <Row className="mt-4">
                                            <Button type="button" variant="danger" onClick={this.removePorCerrar}>Quitar</Button>
                                        </Row>
                                    </Col>
                                <Col md="8">

                                    {this.state.porcerrar.map((value, index) => {
                                            return(
                                            <Form.Row>
                                                <Form.Group as={Col} md="4" onChange={this.onChange} controlId={value}>
                                                    <Form.Label>Por cerrar</Form.Label>
                                                    <Form.Control required as="select" onChange={this.onChange} placeholder="...">                                            <option></option>
                                                        <option value="INVERSION">Inversion</option>
                                                        <option value="CREDITO">Credito</option>
                                                        <option value="TDC">TDC</option>
                                                        <option value="VRIM">Vrim</option>
                                                        <option value="DAÑOS">Daños</option>
                                                        <option value="AUTOS">Autos</option>
                                                        <option value="VIDA">Vida</option>
                                                        <option value="GASTOS MEDICOS">Gastos medicos</option>
                                                        <option value="BAJO COSTO">Bajo costo</option>
                                                        <option value="AFORE">Afore</option>
                                                        <option value="OTRO">Otro</option>
                                                    </Form.Control>                                                  
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" controlId={"status" + value}>
                                                    <Form.Label>Status</Form.Label>
                                                    <Form.Control required as="select" onChange={this.handleCampana.bind(this)}>
                                                        <option></option>
                                                        <option>Venta</option>
                                                        <option>Posible venta</option>
                                                        <option>No venta</option>
                                                    </Form.Control>                                    
                                                </Form.Group>
                                            </Form.Row>
                                            )
                                        })}
                                    </Col>
                            </Row>
                            <Form.Row className="mt-4">
                                <Form.Group as={Col} md="4" controlId="callDate" className={this.state.llamarField}>
                                    <Form.Label>Fecha de llamada</Form.Label>
                                    <Form.Control type="date" onChange={this.onChange} placeholder="..." />
                                </Form.Group>
                            </Form.Row>
                            <h5>Referidos</h5>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="referido1">
                                    <Form.Label>Nombre de referido</Form.Label>
                                    <Form.Control placeholder="..." onChange={this.onChange}/>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="contactoreferido1">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control type="email" placeholder="..." onChange={this.onChange}/>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="telefonoreferido1">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control placeholder="..." onChange={this.onChange}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="referido2">
                                    <Form.Label>Nombre de referido</Form.Label>
                                    <Form.Control placeholder="..." onChange={this.onChange}/>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="contactoreferido2">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control type="email" placeholder="..." onChange={this.onChange}/>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="telefonoreferido2">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control placeholder="..." onChange={this.onChange}/>
                                </Form.Group>
                                <Col className="invisible" >
                                <Form.Group controlId="referido3">
                                    <Form.Label>Referido 3</Form.Label>
                                    <Form.Control placeholder="..."/>
                                </Form.Group>
                                </Col>
                            </Form.Row>
                        </Col>
                        </Row>
                        <h5>Observaciones</h5>
                        <Form.Row>
                            <Form.Group as={Col} controlId="comments">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control as="textarea" placeholder="Comentarios" rows="3" onChange={this.onChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Form>
                </Row>
            </>
        );
    }

}

ClientesForm.propTypes = {
    registerClient: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

  export default connect(
    mapStateToProps,
    { registerClient }
  )(withRouter(ClientesForm));