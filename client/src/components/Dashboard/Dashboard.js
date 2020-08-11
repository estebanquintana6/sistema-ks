import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import AdminDashboard from '../AdminDashboard/AdminDashboard';
import InsurancePanel from '../Insurances/InsurancePanel/InsurancePanel';
import GeneralInsurancePanel from '../Insurances/GeneralInsurancePanel/GeneralInsurancePanel';
import ClientsPanel from '../Clients/ClientsPanel/ClientsPanel';
import InvoicesPanel from '../Invoices/InvoicesPanel/InvoicesPanel';
import SinesterPanel from '../Sinesters/SinesterPanel/SinesterPanel';
import SinesterAutosPanel from '../Sinesters/SinesterAutosPanel/SinesterAutosPanel';

import UploadPanel from '../UploadPanel/UploadPanel';
//redux
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { logoutUser } from "../../actions/authActions";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

import "./Dashboard.css";
import TaskPanel from "../Tasks/TaskPanel/TaskPanel";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedForm: null,
      selected: ""
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.logoutUser(this.props.history)
      return
    }
  }

  chooseForm = (e, key) => {
    this.setState({ selectedForm: key })
  }

  render() {
    const user = this.props.auth.user;
    return (
      <div className="wrapper">
        <Sidebar user={user} history={this.props.history}></Sidebar>
        <div id="content">
          <Navbar history={this.props.history}></Navbar>
          <Switch>
            <Route exact path="/dashboard/admin">
              <AdminDashboard history={this.props.history}></AdminDashboard>
            </Route>
            <Route exact path="/dashboard/clientes">
              <ClientsPanel history={this.props.history}></ClientsPanel>
            </Route>
            <Route exact path="/dashboard/clientes/upload">
              <UploadPanel
                history={this.props.history}
                type="CLIENTES"
                resultKeys={['no', 'person_type', 'name', 'rfc', 'contact1', 'correo1', 'tel1', 'contact2', 'correo2', 'tel2', 'contact3', 'correo3', 'tel3', 'state', 'city']}
                originalKeys={['No', 'Tipo de persona', 'CONTRATANTE', 'RFC', 'Contacto', 'CORREO', 'TEL', 'Contacto2', 'CORREO2', 'TEL2', 'Contacto3', 'CORREO3', 'TEL3', 'ESTADO', 'CIUDAD']}
              ></UploadPanel>
            </Route>
            <Route exact path="/dashboard/pendientes">
              <TaskPanel history={this.props.history}></TaskPanel>
            </Route>
            <Route exact path="/dashboard/autos">
              <InsurancePanel history={this.props.history} variant="AUTOS"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/general">
              <GeneralInsurancePanel history={this.props.history} variant="GENERAL"></GeneralInsurancePanel>
            </Route>
            <Route exact path="/dashboard/autos/upload">
              <UploadPanel
                history={this.props.history}
                type="AUTOS"
                resultKeys={['insurance_company', 'client', 'policy', 'car_year', 'car_brand', 'car_description', 'due_date', 'cis', 'payment_type', 'type']}
                originalKeys={['ASEGURADORA', 'CONTRATANTE', 'POLIZA', 'MODELO', 'MARCA', 'CARROCERIA', 'F. VENCIMIENTO', 'CIS', 'FORMA DE PAGO', 'TIPO']}
              ></UploadPanel>
            </Route>
            <Route exact path="/dashboard/vida">
              <InsurancePanel history={this.props.history} variant="VIDA"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/gm">
              <InsurancePanel history={this.props.history} variant="GM"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/gm/upload">
              <UploadPanel
                history={this.props.history}
                type="GMM"
                resultKeys={['no', 'person_type', 'name', 'rfc', 'policy', 'product', 'colective_type', 'coin', 'due_date', 'receipt_type', 'payment_type', 'contact', 'email', 'telephone', 'insurance_company']}
                originalKeys={['NO', 'TIPO DE PERSONA', 'CONTRATANTE', 'RFC', 'POLIZA', 'PRODUCTO', 'TIPO DE POLIZA', 'MONEDA', 'FECHA DE VENCIMIENTO', 'TIPO DE RECIBO', 'TIPO DE PAGO', 'CONTACTO', 'MAIL', 'TELEFONO', 'ASEGURADORA']}
              ></UploadPanel>
            </Route>
            <Route exact path="/dashboard/danos">
              <InsurancePanel history={this.props.history} variant="DANOS"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/danos/upload">
              <UploadPanel
                history={this.props.history}
                type="DANOS"
                resultKeys={['no', 'person_type', 'name', 'rfc', 'policy', 'product', 'coin', 'due_date', 'payment_type', 'prima', 'contact', 'email', 'telephone', 'insurance_company']}
                originalKeys={['NO', 'TIPO DE PERSONA', 'CONTRATANTE', 'RFC', 'POLIZA', 'PRODUCTO', 'MONEDA', 'FECHA DE VENCIMIENTO', 'TIPO DE PAGO', 'PRIMA', 'CONTACTO', 'MAIL', 'TELEFONO', 'ASEGURADORA']}
              >
              </UploadPanel>
            </Route>
            <Route exact path="/dashboard/invoices">
              <InvoicesPanel history={this.props.history}></InvoicesPanel>
            </Route>
            <Route exact path="/dashboard/siniestros">
              <SinesterPanel history={this.props.history}></SinesterPanel>
            </Route>
            <Route exact path="/dashboard/siniestros">
              <SinesterPanel history={this.props.history}></SinesterPanel>
            </Route>
            <Route exact path="/dashboard/siniestrosautos">
              <SinesterAutosPanel history={this.props.history}></SinesterAutosPanel>
            </Route>
          </Switch>
        </div>
      </div>
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