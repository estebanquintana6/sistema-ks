import React, { Component } from "react";
import PropTypes from "prop-types";

//Package imports
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  Row,
} from 'react-bootstrap';
//redux
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { logoutUser } from "../../actions/authActions";

import ClientesForm from "../Clients/ClientesForm/ClientesForm";
import SecomForm from "../SECOM/SecomForm/SecomForm";
import SecomReport from "../SECOM/SecomReport/SecomReport";
import ClientsReport from "../Clients/ClientsReport/ClientsReport";
import ReferidosReport from "../ReferidosReport/ReferidosReport";

import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedForm: null,
      selected: ""
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  chooseForm = (e, key) => {
    this.setState({selectedForm: key})
  }

  adminPage = (e) => {
    this.props.history.push("/admin");
  }

  clientsPage = (e) => {
    this.props.history.push('/clientes');
  }

  render() {
    const user = this.props.auth.user
    return (
      <Col sm={12}>
        <Navbar bg="light">
          <Navbar.Brand href="#home">
            <img
              src="static/img/texto.png"
              height="50"
              alt="logo"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Navbar>
        <Navbar collapseOnSelect expand="lg" className="bg-blue" variant="dark">
          <Navbar.Brand href="#home">{user.name} {user.last_name}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={this.onLogoutClick}>Cerrar sesion</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          { user.role === "admin" &&
          <Form inline>
            <Button onClick={this.adminPage}>Ir a panel de admin</Button>
          </Form>
          }
          <Button onClick={this.clientsPage}>Clientes</Button>
        </Navbar>
      </Col>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
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
  { loginUser, logoutUser }
)(Dashboard);
