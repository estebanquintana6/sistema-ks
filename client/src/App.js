import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import RecoverPassword from './components/RecoverPassword/RecoverPassword';
import ResetPassword from  "./components/ResetPassword/ResetPassword"
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import ClientsReport from './components/Clients/ClientsReport/ClientsReport'
import ClientesForm from './components/Clients/ClientesForm/ClientesForm'
import Layout from "./components/Layout/Layout";
import AdminPanel from "./components/Admin/AdminPanel";

import "./App.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
              <div className="App">
                <Switch>
                  <Route exact path="/" component={Login} />
                  <Route  exact path="/register" component={Register} />
                  <Route  path="/login" component={Login} />
                  <Route  path="/recover" component={RecoverPassword} />
                  <Route  path="/reset/:user/:id" component={ResetPassword}/>

                  <PrivateRoute path="/clientes" component={ClientsReport}/>
                  <PrivateRoute path="/clientes/add" component={ClientesForm}/>
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute path="/admin" component={AdminPanel} />

                </Switch>
              </div>
        </Layout>
      </Provider>
    )
  }
}
export default App;
