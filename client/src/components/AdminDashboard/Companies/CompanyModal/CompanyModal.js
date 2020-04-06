import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';

import CompanyForm from "../CompanyForm/CompanyForm";
import swal from '@sweetalert/with-react';

import "./CompanyModal.css";

class CompanyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null
    }
  }

  editCompany = (company) => {
    swal({
      title: `Editar aseguradora`,
      icon: "info",
      content: <CompanyForm company={company} edit={true} updateCompany={this.props.updateCompany} ></CompanyForm>,
      buttons: false
    })
  }

  render() {
    const { company } = this.props;
    return (
      < Container >
            <React.Fragment>
              <Row className="mt-4">
                <Col>
                  <h5 className="text-center">{company.name}</h5>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col>
                  <Button variant="info" className="option-button" onClick={this.editCompany.bind(this, company)}>EDITAR</Button>
                </Col>
                <Col>
                  <Button variant="danger" className="option-button" onClick={this.props.deleteCompany.bind(this, company._id, company.name)}>ELIMINAR</Button>
                </Col>
              </Row>
            </React.Fragment>
        </Container >
    )
  }
}

export default CompanyModal;