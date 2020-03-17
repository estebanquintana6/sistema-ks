import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import RecoverPassword from './components/RecoverPassword/RecoverPassword';
import ResetPassword from "./components/ResetPassword/ResetPassword"
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Layout/Layout";

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
const isUserAuthenticated = () => store.getState().isAuthenticated

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <div className="App">
            <Switch>
              <PrivateRoute exact path="/" component={isUserAuthenticated() ? Login : Dashboard} />
              <Route exact path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/recover" component={RecoverPassword} />
              <Route path="/reset/:user/:id" component={ResetPassword} />

              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Layout>
      </Provider>
    )
  }
}
export default App;
