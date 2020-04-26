/* eslint-disable */
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
                                <a onClick={() => this.goToPage('/dashboard/clientes')}>Panel de clientes</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Auto</a>
                        <ul className="collapse list-unstyled" id="pageSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/autos')}>Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#autoSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Gastos médicos</a>
                        <ul className="collapse list-unstyled" id="autoSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/gm')}>Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#danosSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Daños</a>
                        <ul className="collapse list-unstyled" id="danosSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/danos')}>Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#vidaSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Vida</a>
                        <ul className="collapse list-unstyled" id="vidaSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/vida')}>Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#transportesSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Transporte</a>
                        <ul className="collapse list-unstyled" id="transportesSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/transporte')}>Panel de seguro</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#pendientesSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Pendientes</a>
                        <ul className="collapse list-unstyled" id="pendientesSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/pendientes')}>Panel de pendientes</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#invoicesSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Recibos</a>
                        <ul className="collapse list-unstyled" id="invoicesSubmenu">
                            <li>
                                <a onClick={() => this.goToPage('/dashboard/invoices')}>Panel de recibos</a>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul className="list-unstyled CTAs">
                    <li>
                        <a href="#" className="download">Perfil</a>
                    </li>
                    {this.isUserAdmin() &&
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