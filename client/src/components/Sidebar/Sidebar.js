import React, { Component } from "react"

class Sidebar extends Component {
  render() {
    return (
        <nav id="sidebar">
            <div className="sidebar-header">
                <h3>KS Seguros</h3>
            </div>
            <ul className="list-unstyled components">
                <li className="active">
                    <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Clientes</a>
                    <ul className="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a href="#">Registro de clientes</a>
                        </li>
                        <li>
                            <a href="#">Panel de clientes</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">About</a>
                    <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Pages</a>
                    <ul className="collapse list-unstyled" id="pageSubmenu">
                        <li>
                            <a href="#">Page 1</a>
                        </li>
                        <li>
                            <a href="#">Page 2</a>
                        </li>
                        <li>
                            <a href="#">Page 3</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">Portfolio</a>
                </li>
                <li>
                    <a href="#">Contact</a>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                <li>
                    <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" className="download">Perfil</a>
                </li>
                <li>
                    <a href="https://bootstrapious.com/p/bootstrap-sidebar" className="article">Panel de administrador</a>
                </li>
            </ul>
        </nav>
    );
  }
}

export default Sidebar;