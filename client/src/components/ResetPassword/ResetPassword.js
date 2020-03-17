import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { validateToken, changePassword } from "../../actions/recoverPassword"
import classnames from "classnames";
import swal from '@sweetalert/with-react';

import { Link } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    let resetToken = this.props.match.params.id;
    let user = this.props.match.params.user;

    this.props.validateToken({
      email: user,
      token: resetToken
    }).then(data => {
      const status = data.data.status;
      if (!status) {
        this.props.history.push("/login");
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    console.log(nextProps.errors);
  }

  toLogin = e => {
    this.props.history.push("/login");
    swal.close();
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    let resetToken = this.props.match.params.id;
    let user = this.props.match.params.user;

    const formData = {
      resetToken,
      user,
      password: this.state.password1,
      confirmPassword: this.state.password2
    };

    this.props.changePassword(formData).then(response => {
      const status = response.status;

      if (status === 200) {
        swal({
          content:
            <div>
              <h2>Contraseña cambiada</h2>
              <p></p>
              <div>
                <Button onClick={this.toLogin} variant="btn btn-primary btn-user btn-block">Inicia sesion</Button>
              </div>
            </div>,
          buttons: false,
          closeOnClickOutside: false
        })
      }
    });

  };

  render() {
    const { errors } = this.state;
    return (
      <>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block">
                    <img src="../../static/img/Imago.png" alt="loginimage" width={"50%"} className="login-image"></img>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Reinicia tu contraseña</h1>
                      </div>
                      <Form className="user" noValidate onSubmit={this.onSubmit}>
                        <div className="form-group">
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.password1}
                            placeholder="Contraseña"
                            id="password1"
                            type="password"
                            className={classnames("form-control form-control-user", {
                              invalid: errors.email || errors.emailnotfound
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.password2}
                            placeholder="Confirma tu contraseña"
                            id="password2"
                            type="password"
                            className={classnames("form-control form-control-user", {
                              invalid: errors.email || errors.emailnotfound
                            })}
                          />
                        </div>
                        <p className="text-danger">{this.state.errors.password}</p>

                        <Button variant="btn btn-primary btn-user btn-block" type="submit">Enviar correo</Button>
                      </Form>
                      <hr />
                      <div className="text-center">
                        <Link to="/login">Inicia sesion</Link>
                        <br></br>
                        <Link to="/register">Crea una cuenta</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

ResetPassword.propTypes = {
  validateToken: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { validateToken, changePassword }
)(ResetPassword);
