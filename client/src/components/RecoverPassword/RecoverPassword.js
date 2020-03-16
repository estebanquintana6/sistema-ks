import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { recoverPassword } from "../../actions/recoverPassword"
import classnames from "classnames";

import { Link } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';

class RecoverPassword extends Component {
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

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

    const userData = {
      email: this.state.email
    };

    this.props.recoverPassword(userData);
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
                    <img src="static/img/Imago.png" alt="loginimage" width={"50%"} className="login-image"></img>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Recupera tu contraseña</h1>
                      </div>
                      <Form className="user" noValidate onSubmit={this.onSubmit}>
                        <div className="form-group">
                          <Form.Control
                            onChange={this.onChange}
                            value={this.state.email}
                            error={errors.email}
                            placeholder="Email"
                            id="email"
                            type="email"
                            className={classnames("form-control form-control-user", {
                              invalid: errors.email || errors.emailnotfound
                            })}
                          />
                        </div>
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

RecoverPassword.propTypes = {
  recoverPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { recoverPassword }
)(RecoverPassword);
