import React, { useState } from "react";
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

const Dashboard = ({ auth, logoutUser, history }) => {

  const [showSidebar, setShowSidebar] = useState(true)

  if (!auth.isAuthenticated) {
    logoutUser(history)
  }

  const user = auth.user;

  return (
    <div className="wrapper">
      <Sidebar
        user={user}
        history={history}
        show={showSidebar} />
      <div id="content">
        <Navbar
          history={history}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar} />
        <Switch>
          <Route exact path="/dashboard/admin">
            <AdminDashboard history={history} />
          </Route>
          <Route exact path="/dashboard/clientes">
            <ClientsPanel history={history} />
          </Route>
          <Route exact path="/dashboard/clientes/upload">
            <UploadPanel
              history={history}
              type="CLIENTES"
              resultKeys={['no', 'person_type', 'name', 'rfc', 'contact1', 'correo1', 'tel1', 'contact2', 'correo2', 'tel2', 'contact3', 'correo3', 'tel3', 'state', 'city']}
              originalKeys={['No', 'Tipo de persona', 'CONTRATANTE', 'RFC', 'Contacto', 'CORREO', 'TEL', 'Contacto2', 'CORREO2', 'TEL2', 'Contacto3', 'CORREO3', 'TEL3', 'ESTADO', 'CIUDAD']}
            ></UploadPanel>
          </Route>
          <Route exact path="/dashboard/pendientes">
            <TaskPanel history={history} />
          </Route>
          <Route exact path="/dashboard/autos">
            <InsurancePanel history={history} variant="AUTOS" />
          </Route>
          <Route exact path="/dashboard/general">
            <GeneralInsurancePanel history={history} variant="GENERAL" />
          </Route>
          <Route exact path="/dashboard/autos/upload">
            <UploadPanel
              history={history}
              type="AUTOS"
              originalKeys={['Contratante', 'Póliza', 'Fecha de vencimiento', 'Fecha vto. pago', 'Aseguradora', 'Producto', 'Tipo de póliza', 'Contratante Tipo de persona', 'Contratante RFC', 'Moneda', 'Prima total']}
              resultKeys={['client', 'policy', 'due_date', 'pay_due_date', 'insurance_company', '', 'colective_insurance', '', '', 'currency', 'bounty']}
            />
          </Route>
          <Route exact path="/dashboard/vida">
            <InsurancePanel history={history} variant="VIDA" />
          </Route>
          <Route exact path="/dashboard/vida/upload">
            <UploadPanel
              history={history}
              type="VIDA"
              resultKeys={['insurance_company', 'client', 'policy', 'car_year', 'car_brand', 'car_description', 'due_date', 'cis', 'payment_type', 'type']}
              originalKeys={['ASEGURADORA', 'CONTRATANTE', 'POLIZA', 'MODELO', 'MARCA', 'CARROCERIA', 'F. VENCIMIENTO', 'CIS', 'FORMA DE PAGO', 'TIPO']}
            />
          </Route>
          <Route exact path="/dashboard/gm">
            <InsurancePanel history={history} variant="GM" />
          </Route>
          <Route exact path="/dashboard/gm/upload">
            <UploadPanel
              history={history}
              type="GM"
              resultKeys={['no', 'person_type', 'name', 'rfc', 'policy', 'product', 'colective_type', 'coin', 'due_date', 'receipt_type', 'payment_type', 'contact', 'email', 'telephone', 'insurance_company']}
              originalKeys={['NO', 'TIPO DE PERSONA', 'CONTRATANTE', 'RFC', 'POLIZA', 'PRODUCTO', 'TIPO DE POLIZA', 'MONEDA', 'FECHA DE VENCIMIENTO', 'TIPO DE RECIBO', 'TIPO DE PAGO', 'CONTACTO', 'MAIL', 'TELEFONO', 'ASEGURADORA']}
            />
          </Route>
          <Route exact path="/dashboard/danos">
            <InsurancePanel history={history} variant="DANOS" />
          </Route>
          <Route exact path="/dashboard/danos/upload">
            <UploadPanel
              history={history}
              type="DANOS"
              resultKeys={['no', 'person_type', 'name', 'rfc', 'policy', 'product', 'coin', 'due_date', 'payment_type', 'prima', 'contact', 'email', 'telephone', 'insurance_company']}
              originalKeys={['NO', 'TIPO DE PERSONA', 'CONTRATANTE', 'RFC', 'POLIZA', 'PRODUCTO', 'MONEDA', 'FECHA DE VENCIMIENTO', 'TIPO DE PAGO', 'PRIMA', 'CONTACTO', 'MAIL', 'TELEFONO', 'ASEGURADORA']}
            />
          </Route>
          <Route exact path="/dashboard/invoices">
            <InvoicesPanel history={history} />
          </Route>
          <Route exact path="/dashboard/siniestros">
            <SinesterPanel history={history} />
          </Route>
          <Route exact path="/dashboard/siniestros">
            <SinesterPanel history={history} />
          </Route>
          <Route exact path="/dashboard/siniestrosautos">
            <SinesterAutosPanel history={history} />
          </Route>
        </Switch>
      </div>
    </div >
  );
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