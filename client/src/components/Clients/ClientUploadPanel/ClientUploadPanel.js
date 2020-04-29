import React, { Component } from "react";

import SimpleReactFileUpload from "../../SimpleReactFileUpload/SimpleReactFileUpload";
import {
    Container,
} from 'react-bootstrap';
  

class ClientModal extends Component {

  render() {
    return (
        <React.Fragment>
            <Container>
                <SimpleReactFileUpload 
                type="CLIENTES"
                resultKeys={['no', 'person_type', 'name', 'rfc', 'contact1', 'correo1', 'tel1', 'contact2', 'correo2', 'tel2', 'contact3', 'correo3', 'tel3', 'state', 'city']}
                originalKeys={['No', 'Tipo de persona',	'CONTRATANTE'	,'RFC'	,'Contacto',	'CORREO'	,'TEL',	'Contacto2',	'CORREO2'	,'TEL2'	,'Contacto3'	,'CORREO3'	,'TEL3'	,'ESTADO'	,'CIUDAD']}
                >
                </SimpleReactFileUpload>
            </Container>
        </React.Fragment>
    )
  }
}

export default ClientModal;