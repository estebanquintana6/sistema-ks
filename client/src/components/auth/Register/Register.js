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
      <>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-register100 p-t-50 p-b-90 p-l-15 p-r-15">
              <Form 
                className="login100-form validate-form flex-sb flex-w" 
                onSubmit={this.onSubmit}
                autocomplete="off">
                <span className="login100-form-title p-b-51">
                  Registro
                </span>
                <input id="username" style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                <input id="password" style={{display:"none"}} type="password" name="fakepasswordremembered"></input>

                  <div className="col-md-6">
                    <div className="wrap-input100 validate-input m-b-16" data-validate = "Nombre es requerido">
                      <input 
                        className="input100" 
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        id="name"
                        onChange={this.onChange}
                      />
                      <span className="focus-input100"></span>
                    </div>
                    {errors.name}
                  </div>

                  <div className="col-md-6">
                    <div className="wrap-input100 validate-input m-b-16" data-validate = "Apellido es requerido">
                      <input 
                        className="input100" 
                        type="text" 
                        name="last_name"
                        placeholder="Apellidos"
                        id="last_name"
                        onChange={this.onChange}
                      />
                      <span className="focus-input100"></span>
                    </div>
                    {errors.last_name}
                  </div>
                  
                  <div className="col-md-12">
                    <div className="wrap-input100 validate-input m-b-16" data-validate = "Email es requerido">
                      <input 
                        className="input100" 
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        id="email"
                        autocomplete="nope"
                        onChange={this.onChange}
                      />
                      <span className="focus-input100"></span>
                    </div>
                    {errors.email}
                  </div>

                  <div className="col-md-6">
                    <div className="wrap-input100 validate-input m-b-16" data-validate = "Contraseña requerida">
                      <input 
                        className="input100" 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        id="password"
                        autocomplete="new-password"                        
                        onChange={this.onChange}
                      />
                      <span className="focus-input100"></span>
                      {errors.password}
                    </div>
                  </div>

                  <div className="col-md-6">
                  <div className="wrap-input100 validate-input m-b-16" data-validate = "Contraseña requerida">
                      <input 
                        className="input100" 
                        type="password" 
                        name="password2" 
                        placeholder="Confirmar contraseña"
                        id="password2"
                        onChange={this.onChange}
                      />
                      <span className="focus-input100"></span>
                      {errors.password}
                    </div>
                  </div>

                <div className="container-login100-form-btn m-t-17">
                  <button className="login100-form-btn" type="submit">
                    Registro
                  </button>
                </div>

              </Form>
            </div>
          </div>
        </div>
        </>
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
