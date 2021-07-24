import React from "react";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import './Navbar.css'

const Navbar = ({
    history,
    logoutUser,
    showSidebar,
    setShowSidebar
}) => {

    const onLogoutClick = e => {
        e.preventDefault();
        logoutUser(history);
    }

    const changeShowSidebarState = () => {
        setShowSidebar(!showSidebar)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">

                <button className="btn btn-dark d-inline-block d-lg-none" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fas fa-align-justify"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="nav navbar-nav nav-width">
                        <li className="nav-item sidebar_li" onClick={changeShowSidebarState}>
                            <i className="fa fa-bars" aria-hidden="true"/>
                        </li>
                        <li className="nav-item logout_li">
                            <a className="nav-link" onClick={onLogoutClick}>Cerrar sesión</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Navbar);