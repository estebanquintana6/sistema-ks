import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button, Col, Form, Row } from 'react-bootstrap';

import { registerUser } from "../../../actions/authActions";

import classnames from "classnames";
import "./Register.css";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      last_name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block">
                  <img src="static/img/Imago.png" alt="loginimage" width={"50%"} className="login-image"></img>
                </div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Registro de usuario</h1>
                    </div>
                    <Form noValidate onSubmit={this.onSubmit}>
                      <Row>
                        <Col md="6">

                          <Form.Label className="p-secondary-small-text" >Nombre</Form.Label>
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.name}
                            error={errors.name}
                            id="name"
                            type="text"
                            className={classnames("", {
                              invalid: errors.name
                            })}
                          />
                          <span className="red-text">{errors.name}</span>
                        </Col>
                        <Col md="6">

                          <Form.Label className="p-secondary-small-text">Apellidos</Form.Label>
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.last_name}
                            error={errors.last_name}
                            id="last_name"
                            type="text"
                            className={classnames("", {
                              invalid: errors.last_name
                            })}
                          />
                        </Col>
                      </Row>
                      <span className="red-text">{errors.last_name}</span>
                      <Form.Label className="p-secondary-small-text">Email</Form.Label>
                      <Form.Control
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                        id="email"
                        type="email"
                        className={classnames("", {
                          invalid: errors.email
                        })}
                      />
                      <span className="red-text">{errors.email}</span>
                      <Row>
                        <Col md="6">
                          <Form.Label className="p-secondary-small-text">Contraseña</Form.Label>
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.password}
                            error={errors.password}
                            id="password"
                            type="password"
                            className={classnames("", {
                              invalid: errors.password
                            })}
                          />
                          <span className="red-text">{errors.password}</span>
                        </Col>
                        <Col md="6">
                          <Form.Label className="p-secondary-small-text">Confirma tu contraseña</Form.Label>
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.password2}
                            error={errors.password2}
                            id="password2"
                            type="password"
                            className={classnames("", {
                              invalid: errors.password2
                            })}
                          />
                          <span className="red-text">{errors.password2}</span>
                        </Col>
                      </Row>
                      <Col>
                        <Button className="portero-primary-btn btn-block mt-3" type="submit">Registrar</Button>
                      </Col>
                    </Form>

                    <hr />
                    <div className="text-center">
                      <Link to="/login">Iniciar sesion</Link>
                      <br></br>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
