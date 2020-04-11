import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import AdminDashboard from '../AdminDashboard/AdminDashboard';
import InsurancePanel from '../Insurances/InsurancePanel/InsurancePanel';
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
              <InsurancePanel history={this.props.history} variant="AUTOS"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/vida">
              <InsurancePanel history={this.props.history} variant="VIDA"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/gm">
              <InsurancePanel history={this.props.history} variant="GM"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/transporte">
              <InsurancePanel history={this.props.history} variant="TRANSPORTE"></InsurancePanel>
            </Route>
            <Route exact path="/dashboard/danos">
              <InsurancePanel history={this.props.history} variant="DANOS"></InsurancePanel>
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