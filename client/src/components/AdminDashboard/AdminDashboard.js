import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Container } from 'react-bootstrap'
import "react-table/react-table.css";
import "./AdminDashboard.css";
import InsuranceTypesPanel from "./InsuranceType/InsuranceTypesPanel/InsuranceTypesPanel";
import CompaniesPanel from "./Companies/CompaniesPanel/CompaniesPanel";
import UserPanel from "../Users/UserPanel/UserPanel";
import EmailPanel from "./Email/EmailPanel/EmailPanel";
import PermissionPanel from "./PermissionPanel/PermissionPanel";


class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insuranceTypes: [],
      change: 0
    };
  }

  update = () => {
    this.setState({ change: Number(this.state.change) + 1 })
  }

  isSuperAdmin = () => (this.props.auth.user.role === 'superadmin')

  render() {
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
                        <li className="nav-item" onClick={this.update}>
                          <a className="nav-link active" href="#i-types" role="tab" data-toggle="tab"><i className="fas fa-building"></i> Ramos</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#emails" role="tab" data-toggle="tab"><i className="fas fa-envelope"></i> Correos</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#companies" role="tab" data-toggle="tab"><i className="fas fa-user-tie"></i> Aseguradoras</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#users" role="tab" data-toggle="tab"><i className="fas fa-users"></i> Usuarios</a>
                        </li>
                        {this.isSuperAdmin() &&
                          <li className="nav-item">
                            <a className="nav-link" href="#permissions" role="tab" data-toggle="tab"><i className="fas fa-edit"></i> Permisos</a>
                          </li>
                        }
                      </ul>
                      <div className="tab-content">
                        <div role="tabpanel" className="tab-pane fade show active" id="i-types">
                          <InsuranceTypesPanel change={this.state.change} />
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="emails">
                          <EmailPanel />
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="companies">
                          <CompaniesPanel />
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="users">
                          <UserPanel />
                        </div>
                        {this.isSuperAdmin() &&
                          <div role="tabpanel" className="tab-pane fade" id="permissions">
                            <PermissionPanel />
                          </div>
                        }
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
