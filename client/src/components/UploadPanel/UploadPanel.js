import React, { Component } from "react";

import SimpleReactFileUpload from "../SimpleReactFileUpload/SimpleReactFileUpload";
import {
    Container,
} from 'react-bootstrap';
  

class ClientModal extends Component {

  render() {
    return (
        <React.Fragment>
            <Container>
                <SimpleReactFileUpload 
                type={this.props.type}
                resultKeys={this.props.resultKeys}
                originalKeys={this.props.originalKeys}
                >
                </SimpleReactFileUpload>
            </Container>
        </React.Fragment>
    )
  }
}

export default ClientModal;