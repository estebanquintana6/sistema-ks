import React, { Component } from "react"
import PropTypes from "prop-types";

import { connect } from "react-redux";


class Sidebar extends Component {
    render() {
        const user = this.props.auth.user;

        return (
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>KS Seguros</h3>
                </div>
                <ul className="list-unstyled components">
                    <li>
                        <a href="#clienteSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Clientes</a>
                        <ul className="collapse list-unstyled" id="clienteSubmenu">
                            <li>
                                <a href="#">Registro de clientes</a>
                            </li>
                            <li>
                                <a href="#">Panel de clientes</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#autoSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Auto</a>
                        <ul className="collapse list-unstyled" id="autoSubmenu">
                            <li>
                                <a href="#">Registro de seguro</a>
                            </li>
                            <li>
                                <a href="#">Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#medicoSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Gastos médicos</a>
                        <ul className="collapse list-unstyled" id="medicoSubmenu">
                            <li>
                                <a href="#">Registro de seguro</a>
                            </li>
                            <li>
                                <a href="#">Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>

                <ul className="list-unstyled CTAs">
                    <li>
                        <a href="#" className="download">Perfil</a>
                    </li>
                    { user.role === "admin" &&
                    <li>
                        <a href="/admin" className="article">Panel de administrador</a>
                    </li>
                    }
                </ul>
            </nav>
        );
    }
    }

Sidebar.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
  
export default connect(
    mapStateToProps,
    {}
)(Sidebar);