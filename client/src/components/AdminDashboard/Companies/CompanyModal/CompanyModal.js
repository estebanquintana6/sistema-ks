import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';

import CompanyForm from "../CompanyForm/CompanyForm";

import "./CompanyModal.css";

class CompanyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null
    }
  }

  editCompany = () => {
    this.setState({ edit: true })
  }

  render() {
    const { company } = this.props;
    return (
      < Container >
        {
          this.state.edit ? <CompanyForm company={company} edit={this.state.edit} updateCompany={this.props.updateCompany} ></CompanyForm> :
            <React.Fragment>
              <Row className="mt-4">
                <Col>
                  <h5 className="text-center">{company.name}</h5>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col>
                  <Button variant="info" className="option-button" onClick={this.editCompany}>EDITAR</Button>
                </Col>
                <Col>
                  <Button variant="danger" className="option-button" onClick={this.props.deleteCompany.bind(this, company._id, company.name)}>ELIMINAR</Button>
                </Col>
              </Row>
            </React.Fragment>
        }</Container >
    )
  }
}

export default CompanyModal;