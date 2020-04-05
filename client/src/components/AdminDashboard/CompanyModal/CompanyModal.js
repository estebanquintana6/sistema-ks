import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import CompanyForm from "../CompanyForm/CompanyForm";

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
                  <Button variant="info" onClick={this.editCompany}>Editar</Button>
                </Col>
                <Col>
                  <Button variant="danger" onClick={this.props.deleteCompany.bind(this, company._id, company.name)}>ELIMINAR</Button>
                </Col>
              </Row>
            </React.Fragment>
        }</Container >
    )
  }
}

export default CompanyModal;