import React, { Component } from "react";

import "./Sidebar.css";

class Sidebar extends Component {
    isUserAdmin = () => {
        return this.props.user.role === 'admin'
    }

    goToPage = (route) => {
        this.props.history.push(route);
    }

    render() {
        return (
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>KS Seguros</h3>
                </div>
                <ul className="list-unstyled components">
                    <li>
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Clientes</a>
                        <ul className="collapse list-unstyled" id="homeSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/clientes')}>Registro de clientes</a>
                            </li>
                            <li>
                                <a href="#">Panel de clientes</a>
                            </li>
                        </ul>
                    </li>
                    {this.isUserAdmin() && <li>
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Usuarios</a>
                        <ul className="collapse list-unstyled" id="pageSubmenu">
                            <li>
                                <a href="#">Panel de usuarios</a>
                            </li>
                        </ul>
                    </li>}
                    <li>
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Auto</a>
                        <ul className="collapse list-unstyled" id="pageSubmenu">
                            <li>
                                <a href="#">Registro de seguro</a>
                            </li>
                            <li>
                                <a href="#">Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#autoSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Gastos médicos</a>
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
                        <a href="#">Contact</a>
                    </li>
                </ul>

                <ul className="list-unstyled CTAs">
                    <li>
                        <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" className="download">Perfil</a>
                    </li>
                    { this.isUserAdmin() &&
                        <li>
                            <a onClick={() => this.goToPage('/dashboard/admin')} className="article">Panel de administrador</a>
                        </li>
                    }
                </ul>
            </nav>
        );
    }
}

export default Sidebar;