import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import AdminDashboard from '../AdminDashboard/AdminDashboard';
import InsuranceForm from '../Insurances/InsuranceForm/InsuranceForm';
import ClientsPanel from '../Clients/ClientsPanel/ClientsPanel';
//redux
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { logoutUser } from "../../actions/authActions";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

import "./Dashboard.css";

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
        <div id="content" className={'container'}>
          <Navbar history={this.props.history}></Navbar>
          <Switch>
            <Route exact path="/dashboard/admin">
              <AdminDashboard history={this.props.history}></AdminDashboard>
            </Route>
            <Route exact path="/dashboard/clientes">
              <ClientsPanel history={this.props.history}></ClientsPanel>
            </Route>
            <Route exact path="/dashboard/autos">
              <InsuranceForm history={this.props.history} type="AUTOS"></InsuranceForm>
            </Route>
            <Route exact path="/dashboard/danos">
              <InsuranceForm history={this.props.history} type="DANOS"></InsuranceForm>
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