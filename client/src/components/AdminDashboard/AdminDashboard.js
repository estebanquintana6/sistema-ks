import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Container, Button } from 'react-bootstrap'
import "react-select/dist/react-select.css";
import "react-table/react-table.css";
import "./AdminDashboard.css";
import InsuranceTypesPanel from "./InsuranceTypesPanel/InsuranceTypesPanel";
import CompaniesPanel from "./CompaniesPanel/CompaniesPanel";


class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insuranceTypes: []
    };
  }


  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Container>
          <h2>Panel de Administrador</h2>
          <br></br>
          <Row>
            <Col md="12" className="pull-right profile-right-section">
              <Row className="profile-right-section-row">
                <Col md="12">
                  <Row>
                    <Col md="12">
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                          <a className="nav-link active" href="#i-types" role="tab" data-toggle="tab"><i className="fas fa-building"></i> Ramos</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#companies" role="tab" data-toggle="tab"><i className="fas fa-user-tie"></i> Aseguradoras</a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div role="tabpanel" className="tab-pane fade show active" id="i-types">
                          <InsuranceTypesPanel></InsuranceTypesPanel>
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="companies">
                          <CompaniesPanel></CompaniesPanel>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

AdminDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(AdminDashboard);
