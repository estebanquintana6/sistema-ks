import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../../actions/authActions";

import { Form } from 'react-bootstrap';
import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
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

  toRecoverPassword = () => {
    this.props.history.push("/recover");
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;
    return (
      <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-50 p-b-90 p-l-15 p-r-15">
            <Form className="login100-form validate-form flex-sb flex-w" onSubmit={this.onSubmit}>
              <span className="login100-form-title p-b-51">
                KS Seguros
              </span>

              <div className="wrap-input100 validate-input m-b-16" data-validate = "Username is required">
                <input 
                  className="input100" 
                  type="text" 
                  name="username" 
                  placeholder="Username"
                  id="email"
                  onChange={this.onChange}
                />
                <span className="focus-input100"></span>
              </div>
              {errors.email}
              {errors.emailnotfound}

              <div className="wrap-input100 validate-input m-b-16" data-validate = "Password is required">
                <input 
                  className="input100" 
                  type="password" 
                  name="pass" 
                  placeholder="Password"
                  id="password"
                  onChange={this.onChange}
                />
                <span className="focus-input100"></span>
              </div>
              {errors.passwordincorrect}
              <div className="flex-sb-m w-full p-t-3 p-b-24">
                <div className="contact100-form-checkbox">
                  <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"/>
                  <label className="label-checkbox100" htmlFor="ckb1">
                    Recuérdame
                  </label>
                </div>

                <div>
                  <p onClick={this.toRecoverPassword} className="txt1">
                    Recuperar contraseña
                  </p>
                </div>
              </div>

              <div className="container-login100-form-btn m-t-17">
                <button className="login100-form-btn" type="submit">
                  Iniciar sesión
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
