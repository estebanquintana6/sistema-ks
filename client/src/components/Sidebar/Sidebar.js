/* eslint-disable */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getActiveUser } from '../../actions/userActions'

import "./Sidebar.css";

const Sidebar = ({ history, getActiveUser, show }) => {
    const [user, setUser] = useState({
        role: 'user',
        permissions: []
    })

    const isUserAdmin = () => (user.role === 'admin' || user.role === 'superadmin')

    const goToPage = (route) => {
        history.push(route);
    }

    useEffect(() => {
        getActiveUser().then(({ data }) => {
            setUser(data)
        })
    }, [])

    const { permissions } = user;

    return (
        <nav
            id="sidebar"
            style={{ display: `${show ? 'inline' : 'none'}` }}>
            <div className="sidebar-header">
                <h3>KS Seguros</h3>
            </div>
            <ul className="list-unstyled components">
                <li>
                    <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Clientes</a>
                    <ul className="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a onClick={() => goToPage('/dashboard/clientes')}>Panel de clientes</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#insuranceSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">General Seguros</a>
                    <ul className="collapse list-unstyled" id="insuranceSubmenu">
                        <li>
                            <a onClick={() => goToPage('/dashboard/general')}>Panel general de seguros</a>
                        </li>
                    </ul>
                </li>
                {permissions.includes('AUTO') &&
                    <li>
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Auto</a>
                        <ul className="collapse list-unstyled" id="pageSubmenu">
                            <li>
                                <a onClick={() => goToPage('/dashboard/autos')}>Panel de seguro</a>
                            </li>
                            <li>
                                <a onClick={() => goToPage('/dashboard/autos/upload')}>Subir datos</a>
                            </li>
                        </ul>
                    </li>
                }

                {permissions.includes('GMM') &&
                    <li>
                        <a href="#autoSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Gastos médicos</a>
                        <ul className="collapse list-unstyled" id="autoSubmenu">
                            <li>
                                <a onClick={() => goToPage('/dashboard/gm')}>Panel de seguro</a>
                            </li>
                            <li>
                                <a onClick={() => goToPage('/dashboard/gm/upload')}>Subir datos</a>
                            </li>
                        </ul>
                    </li>
                }
                {permissions.includes('DAÑOS') &&
                    <li>
                        <a href="#danosSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Daños</a>
                        <ul className="collapse list-unstyled" id="danosSubmenu">
                            <li>
                                <a onClick={() => goToPage('/dashboard/danos')}>Panel de seguro</a>
                            </li>
                            <li>
                                <a onClick={() => goToPage('/dashboard/danos/upload')}>Subir datos</a>
                            </li>
                        </ul>
                    </li>
                }
                {permissions.includes('VIDA') &&
                    <li>
                        <a href="#vidaSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Vida</a>
                        <ul className="collapse list-unstyled" id="vidaSubmenu">
                            <li>
                                <a onClick={() => goToPage('/dashboard/vida')}>Panel de seguro</a>
                            </li>
                            <li>
                                <a onClick={() => goToPage('/dashboard/vida/upload')}>Subir datos</a>
                            </li>
                        </ul>
                    </li>
                }
                <li>
                    <a href="#pendientesSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Pendientes</a>
                    <ul className="collapse list-unstyled" id="pendientesSubmenu">
                        <li>
                            <a onClick={() => goToPage('/dashboard/pendientes')}>Panel de pendientes</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#siniestrosSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Siniestros</a>
                    <ul className="collapse list-unstyled" id="siniestrosSubmenu">
                        <li>
                            <a onClick={() => goToPage('/dashboard/siniestrosautos')}>Siniestos AUTOS</a>
                        </li>
                        <li>
                            <a onClick={() => goToPage('/dashboard/siniestros')}>Siniestros GM/VIDA/DANOS</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#invoicesSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Recibos</a>
                    <ul className="collapse list-unstyled" id="invoicesSubmenu">
                        <li>
                            <a onClick={() => goToPage('/dashboard/invoices')}>Panel de recibos</a>
                        </li>
                    </ul>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                {isUserAdmin() &&
                    <li>
                        <a onClick={() => goToPage('/dashboard/admin')} className="article">Panel de administrador</a>
                    </li>
                }
            </ul>
        </nav>
    );
}

Sidebar.propTypes = {
    listUsers: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { getActiveUser }
)(Sidebar);
