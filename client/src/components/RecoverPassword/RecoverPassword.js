import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { recoverPassword } from "../../actions/recoverPassword"

import { Form } from 'react-bootstrap';

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

  toLogin = () => {
    this.props.history.push("/login");
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
      <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100 p-t-50 p-b-90 p-l-15 p-r-15">
              <Form className="login100-form validate-form flex-sb flex-w" onSubmit={this.onSubmit}>
                <span className="login100-form-title p-b-51">
                  Recuperar contraseña
                </span>

                <div className="wrap-input100 validate-input m-b-16" data-validate = "Username is required">
                  <input 
                    className="input100" 
                    type="text" 
                    name="username" 
                    placeholder="Email"
                    id="email"
                    onChange={this.onChange}
                  />
                  <span className="focus-input100"></span>
                </div>
                <div className="flex-sb-m w-full p-t-3 p-b-24">
                  <div>
                    <p onClick={this.toLogin} className="txt1">
                      Iniciar sesión
                    </p>
                  </div>
                </div>

                <div className="container-login100-form-btn m-t-17">
                  <button className="login100-form-btn" type="submit">
                    Enviar email
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
