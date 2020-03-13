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

import ClientesForm from "../CLIENTES/ClientesForm/ClientesForm";
import SecomForm from "../SECOM/SecomForm/SecomForm";
import SecomReport from "../SECOM/SecomReport/SecomReport";
import ClientsReport from "../CLIENTES/ClientsReport/ClientsReport";
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

  render() {
    const user = this.props.auth.user;
    let selected;

    switch(this.state.selectedForm){
      case "clientes":
        selected = <ClientesForm></ClientesForm>;
        break;
      case "secom":
        selected = <SecomForm></SecomForm>;
        break;
      case "reportesS":
        selected = <SecomReport></SecomReport>;
        break;
      case "reportesC":
        selected = <ClientsReport></ClientsReport>
        break;
      case "reportesR":
        selected = <ReferidosReport></ReferidosReport>
        break;
      default:
        selected = <></>
    }
    let content = null;

    if(this.state.selectedForm === "reportesC"){
      content = (<Container fluid>
                  <Row className="mt-4">
                      {selected}
                  </Row>
                  </Container>);      
    } else {
      content = (<Container>
        <Row className="mt-4">
            {selected}
        </Row>
        </Container>);      
    }

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
        </Navbar>
        <Row className="mt-4 justify-content-md-center">
            <Col md="5">
              <table className="buttons">
                <tr>
                  <td>
                    <Button type="button" onClick={(e) => this.chooseForm(e, "clientes")}>CLIENTES</Button>
                  </td>
                  <td>
                    <Button type="button" onClick={(e) => this.chooseForm(e, "secom")}>SECOM</Button>
                  </td>
                  <td>
                    <Button type="button" onClick={(e) => this.chooseForm(e, "reportesC")}>Reportes CLIENTES</Button>
                  </td>
                  <td>
                    <Button type="button" onClick={(e) => this.chooseForm(e, "reportesS")}>Reportes SECOM</Button>
                  </td>
                  <td>
                    <Button type="button" onClick={(e) => this.chooseForm(e, "reportesR")}>Referidos</Button>
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
          <div>
            {content}
          </div>
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