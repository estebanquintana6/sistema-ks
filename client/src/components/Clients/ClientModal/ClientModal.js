import 'date-fns';

import React, { Component } from "react";
import moment from "moment";
import cloneDeep from 'lodash/cloneDeep';

import swal from '@sweetalert/with-react';

import {
    Button,
    Col,
    Container, 
    Form, 
    Row
    } from 'react-bootstrap';
    
import "./ClientModal.css"
import "moment/locale/es";


moment.locale("es"); // it is required to select default locale manually


class ClientModal extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    get initialState() {
        const client = cloneDeep(this.props.client);
        var dateString = client.callDate; // Oct 23

        const state = {
            name: client.name,
            razon_social: client.razon_social,
            last_name1: client.last_name1,
            last_name2: client.last_name2,
            calle: client.calle,
            exterior: client.exterior,
            interior: client.interior,
            colonia: client.colonia,
            cp: client.cp,
            estado: client.estado,
            cumpleanos: client.cumpleanos,
            sexo: client.sexo,
            civil: client.civil,
            ocupacion: client.ocupacion,
            gastosmedicos: client.gastosmedicos,
            segurovida: client.segurovida,
            afore: client.afore,
            telefono: client.telefono,
            email: client.email,
            comments: client.comments,
            whatsapp: client.whatsapp,
            directo: client.whatsapp,
            callDate: dateString,
            productos: client.productos,
            porCerrar: client.porCerrar
        }

        return state;
    }


    resetBuilder = () => {
        this.setState(this.initialState);
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };    

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

    quitarProducto = (i, e) => {
        let newProductArray = this.state.productos;
        newProductArray.splice(i, 1);

        this.setState({
            productos: newProductArray
        });
    }

    venderProducto = (i) => {

        const productoVendido = this.state.porCerrar[i];

        let newPorCerrar = this.state.porCerrar;
        newPorCerrar.splice(i, 1);

        let newProductos = this.state.productos;
        newProductos.push(productoVendido.producto);

        this.setState({
            productos: newProductos,
            porCerrar: newPorCerrar
        });
    }

    guardarCambios = () => {
        this.props.update(this.props.client._id, this.state).then(response => {
            if(response.status === 201){
                swal({
                    icon: "success",
                    content: <h3>Cliente actualizado</h3>
                });
                this.props.refresh();
            }
        })
    }

    eliminarCliente = () => {
        swal({
            title: `¿Estas seguro de querer este registro?`,
            text: "Una vez eliminado ya no podras recuperarlo!",
            icon: "warning",
            buttons: true,
            sucessMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                this.props.delete(this.props.client._id).then(response => {
                    if(response.status === 201){
                        swal({                    
                            icon: "success",
                            content:<h3>Cliente eliminado</h3>
                        });
                        this.props.refresh();
                    }
                });
            }
        })

        

    }

    reRender = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    addProduct = (e) => {
        let field = document.getElementById("addProduct");
        let option = field.options[field.selectedIndex].value;

        let newProducts = this.state.productos;
        newProducts.push(option);

        this.setState({productos: newProducts});
    }

    render() {
        let showLastNames = "visible";
        let rowSize = "4";
        let lastNameSize = "4";
        if(this.state.razon_social === "MORAL"){
            showLastNames = "invisible";
            rowSize = "8";
            lastNameSize = "1";
        }

        return(
            <>
            <Container>
                <Row className="mt-4">
                    <Form id="clientForm" onSubmit={this.onSubmit}>
                        <Row>
                        <Col>
                            <h5>Cliente</h5>
                            <Form.Row>
                            <Form.Group as={Col} md="4" controlId="razon_social">
                                <Form.Label >Razon social</Form.Label>
                                <Form.Control as="select" onChange={this.reRender}>
                                        <option></option>
                                        <option value="FISICA" selected={this.state.razon_social === "FISICA"}>Fisica</option>
                                        <option value="MORAL" selected={this.state.razon_social === "MORAL"}>Moral</option>
                                </Form.Control>                            
                            </Form.Group>

                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md={rowSize} controlId="name">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control onChange={this.onChange} value={this.state.name}/>
                                </Form.Group>

                                <Form.Group as={Col} md={lastNameSize} controlId="last_name1" className={showLastNames}>
                                <Form.Label>Apellido P.</Form.Label>
                                <Form.Control onChange={this.onChange} value={this.state.last_name1} />
                                </Form.Group>

                                <Form.Group as={Col} md={lastNameSize} controlId="last_name2" className={showLastNames}>
                                <Form.Label>Apellido M.</Form.Label>
                                <Form.Control onChange={this.onChange} value={this.state.last_name2} />
                                </Form.Group>
                            </Form.Row>

                            <h5>Direccion</h5>
                            
                            <Form.Row>
                                <Form.Group as={Col} md="8" controlId="calle">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control required onChange={this.onChange} value={this.state.calle} />
                                </Form.Group>
                                <Form.Group as={Col} md="2" controlId="exterior">
                                    <Form.Label>Ext</Form.Label>
                                    <Form.Control onChange={this.onChange} value={this.state.exterior} />
                                </Form.Group>
                                <Form.Group as={Col} md="2" controlId="interior">
                                    <Form.Label>Int</Form.Label>
                                    <Form.Control onChange={this.onChange} value={this.state.interior} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="colonia">
                                    <Form.Label>Colonia</Form.Label>
                                    <Form.Control required onChange={this.onChange} value={this.state.colonia} />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="cp">
                                    <Form.Label>C.P.</Form.Label>
                                    <Form.Control required onChange={this.onChange} type="number" value={this.state.cp} />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="estado">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control as="select" onChange={this.onChange}>
                                        <option></option>
                                        <option value="AGUASCALIENTES" selected={this.state.estado === "AGUASCALIENTES"}>Aguascalientes</option>
                                        <option value="BAJA CALIFORNIA" selected={this.state.estado === "BAJA CALIFORNIA"}>Baja California</option>
                                        <option value="BAJA CALIFORNIA SUR" selected={this.state.estado === "BAJA CALIFORNIA SUR"}>Baja California Sur</option>
                                        <option value="CAMPECHE" selected={this.state.estado === "CAMPECHE"}>Campeche</option>
                                        <option value="CHIAPAS" selected={this.state.estado === "CHIAPAS"}>Chiapas</option>
                                        <option value="CHIHUAHUA" selected={this.state.estado === "CHIHUAHUA"}>Chihuahua</option>
                                        <option value="COAHUILA" selected={this.state.estado === "COAHUILA"}>Coahuila</option>
                                        <option value="COLIMA" selected={this.state.estado === "COLIMA"}>Colima</option>
                                        <option value="DURANGO" selected={this.state.estado === "DURANGO"}>Durango</option>
                                        <option value="ESTADO DE MEXICO" selected={this.state.estado === "ESTADO DE MEXICO"}>Estado de Mexico</option>
                                        <option value="GUANAJUATO" selected={this.state.estado === "GUANAJUATO"}>Guanajuato</option>
                                        <option value="GUERRERO" selected={this.state.estado === "GUERRERO"}>Guerrero</option>
                                        <option value="HIDALGO" selected={this.state.estado === "HIDALGO"}>Hidalgo</option>
                                        <option value="JALISCO" selected={this.state.estado === "JALISCO"}>Jalisco</option>
                                        <option value="CDMX" selected={this.state.estado === "CDMX"}>CDMX</option>
                                        <option value="MICHOACAN" selected={this.state.estado === "MICHOACAN"}>Michoacan</option>
                                        <option value="MORELOS" selected={this.state.estado === "MORELOS"}>Morelos</option>
                                        <option value="NAYARIT" selected={this.state.estado === "NAYARIT"}>Nayarit</option>
                                        <option value="NUEVO LEON" selected={this.state.estado === "NUEVO LEON"}>Nuevo Leon</option>
                                        <option value="OAXACA" selected={this.state.estado === "OAXACA"}>Oaxaca</option>
                                        <option value="PUEBLA" selected={this.state.estado === "PUEBLA"}>Puebla</option>
                                        <option value="QUERETARO" selected={this.state.estado === "QUERETARO"}>Queretaro</option>
                                        <option value="QUINTANA ROO" selected={this.state.estado === "QUINTANA ROO"}>Quintana Roo</option>
                                        <option value="SAN LUIS POTOSI" selected={this.state.estado === "SAN LUIS POTOSI"}>San Luis Potosi</option>
                                        <option value="SINALOA" selected={this.state.estado === "SINALOA"}>Sinaloa</option>
                                        <option value="SONORA" selected={this.state.estado === "SONORA"}>Sonora</option>
                                        <option value="TABASCO" selected={this.state.estado === "TABASCO"}>Tabasco</option>
                                        <option value="TAMAULIPAS" selected={this.state.estado === "TAMAULIPAS"}>Tamaulipas</option>
                                        <option value="TLAXCALA" selected={this.state.estado === "TLAXCALA"}>Tlaxcala</option>
                                        <option value="VERACRUZ" selected={this.state.estado === "VERACRUZ"}>Veracruz</option>
                                        <option value="YUCATAN" selected={this.state.estado === "YUCATAN"}>Yucatan</option>
                                        <option value="ZACATECAS" selected={this.state.estado === "ZACATECAS"}>Zacatecas</option>
                                    </Form.Control>                                      
                                </Form.Group>
                            </Form.Row>
                            <h5>Personales</h5>
                            {this.state.razon_social === "FISICA" &&
                            <>
                                <Form.Row>
                                    <Form.Group as={Col} md="4" controlId="sexo">
                                        <Form.Label>Sexo</Form.Label>
                                        <Form.Control required as="select" onChange={this.onChange} value={this.state.sexo}>                                            <option></option>
                                            <option value="HOMBRE" selected={this.state.sexo === "HOMBRE"}>Hombre</option>
                                            <option value="MUJER" selected={this.state.sexo === "MUJER"}>Mujer</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="civil">
                                        <Form.Label>Edo. civil</Form.Label>
                                        <Form.Control required as="select" onChange={this.onChange} value={this.state.civil}>
                                            <option></option>
                                            <option value="SOLTERO" selected={this.state.civil === "SOLTERO"}>Soltero</option>
                                            <option value="CASADO" selected={this.state.civil === "CASADO"}>Casado</option>
                                            <option value="VIUDO" selected={this.state.civil === "VIUDO"}>Viudo</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="ocupacion">
                                        <Form.Label>Ocupacion</Form.Label>
                                            <Form.Control required as="select" onChange={this.onChange} value={this.state.ocupacion}>                                            <option></option>
                                                <option value="EMPLEADO" selected={this.state.ocupacion === "EMPLEADO"}>Empleado</option>
                                                <option value="INDEPENDIENTE" selected={this.state.ocupacion === "INDEPENDIENTE"}>Independiente</option>
                                                <option value="DESEMPLEADO" selected={this.state.ocupacion === "DESEMPLEADO"}>Desempleado</option>
                                            </Form.Control>                                
                                    </Form.Group>
                                </Form.Row>
                            </>
                            }
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="gastosmedicos">
                                    <Form.Label>G. med.</Form.Label>
                                        <Form.Control required as="select" onChange={this.onChange} value={this.state.gastosmedicos}>                                            <option></option>
                                            <option value="SI" selected={this.state.gastosmedicos === "SI"}>Si</option>
                                            <option value="NO" selected={this.state.gastosmedicos === "NO"}>No</option>
                                        </Form.Control>                                
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="segurovida">
                                    <Form.Label>S. vida</Form.Label>
                                        <Form.Control required as="select" onChange={this.onChange} value={this.state.segurovida}>                                            <option></option>
                                            <option value="SI" selected={this.state.segurovida === "SI"}>Si</option>
                                            <option value="NO" selected={this.state.segurovida === "NO"}>No</option>
                                        </Form.Control>                                
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="afore">
                                    <Form.Label>Afore</Form.Label>
                                        <Form.Control required as="select" onChange={this.onChange} value={this.state.afore}>                                            <option></option>
                                            <option value="SI" selected={this.state.afore === "SI"}>Si</option>
                                            <option value="NO" selected={this.state.afore === "NO"}>No</option>
                                        </Form.Control>                                
                                </Form.Group>
                            </Form.Row>
                        </Col>
                        <Col className="ml-4">
                            <h5>Contacto</h5>
                            <Form.Row>
                                <Form.Group as={Col} md="6" controlId="wp">
                                    <Form.Label>Whatsapp</Form.Label>
                                    <Form.Control onChange={this.onChange} value={this.state.whatsapp} />
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="telefono">
                                    <Form.Label>Directo</Form.Label>
                                    <Form.Control required onChange={this.onChange} value={this.state.telefono} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="12" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control onChange={this.onChange} type="email" value={this.state.email} />
                                </Form.Group>
                            </Form.Row>
                            <h5>Productos</h5>
                            <Form.Row>
                                {
                                    this.state.productos.map((product, index) => {
                                    return (
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" controlId={"producto" + index}>
                                                <Form.Control disabled value={this.state.productos[index]} />
                                            </Form.Group>
                                            <Col md="4">
                                            <Button variant="danger" onClick={this.quitarProducto.bind(this, index)} >Quitar</Button>
                                            </Col>
                                        </Form.Row>
                                    );    
                                    })
                                }
                            </Form.Row>
                            <h5>Posibles ventas</h5>
                            <hr></hr>
                            <Form.Row>
                                {
                                    this.state.porCerrar.map((product, index) => {     
                                    return (
                                        <Form.Row>
                                            <Form.Group as={Col} md="4" controlId={"porCerrar" + index}>
                                                <Form.Control disabled value={this.state.porCerrar[index].producto} />
                                            </Form.Group>
                                            <Col md="3">
                                                <Button variant="success" onClick={() => {this.venderProducto(index)}}>Vender</Button>
                                            </Col>
                                            <Col md="3">
                                                <Button variant="danger">Quitar</Button>
                                            </Col>
                                        </Form.Row>
                                    );    
                                    })
                                }
                            </Form.Row>
                            <hr></hr>

                            <h5>Añadir producto</h5>
                            <Form.Row>
                                <Form.Group as={Col} md="5" controlId="addProduct">
                                    <Form.Label>Producto</Form.Label>
                                    <Form.Control as="select" placeholder="...">                                            
                                        <option></option>
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
                                <Col md="4" className="products-buttons-div">
                                    <Row>
                                        <Button type="button" onClick={this.addProduct}>Añadir</Button>
                                    </Row>
                                </Col>
                            </Form.Row>

                            <h5>Fecha de llamada</h5>
                            <Form.Row className="mt-4">
                                <Form.Group as={Col} md="6" controlId="callDate" className={this.state.llamarField}>
                                    <Form.Label>Fecha de llamada</Form.Label>
                                    <Form.Control onChange={this.onChange} value={this.state.callDate} />
                                </Form.Group>
                            </Form.Row>
                        </Col>
                        </Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="comments">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control as="textarea" placeholder="Comentarios" rows="3" value={this.state.comments} onChange={this.onChange}/>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    
                </Row>
                <Row>
                    <Button className="mr-4" variant="danger" onClick={this.eliminarCliente}>Borrar</Button>
                    <Button className="mr-4" onClick={this.resetBuilder}>Reiniciar</Button>
                    <Button variant="success" onClick={this.guardarCambios}>Guardar</Button>

                </Row>
            </Container>
            </>
        );
    }

}

export default ClientModal;