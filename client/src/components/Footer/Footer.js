import React, { Component } from 'react';
import "./Footer.css"

export default class Footer extends Component {
    render() {
        return (
        <div class="footer navbar-fixed-bottom">
            <div className="footer text-center">
                <div className="container">
                <div className="row">
                    <div className="col-lg-2 mb-5 mb-lg-0"></div>
                    <div className="col-lg-4 mb-5 mb-lg-0">
                    <h4 className="text-uppercase mb-4">Dirección</h4>
                    <p className="lead mb-0">2215 John Daniel Drive
                        <br/>Clark, MO 65243</p>
                    </div>

                    <div className="col-lg-4 mb-5 mb-lg-0">
                    <h4 className="text-uppercase mb-4">Redes sociales</h4>
                    <a className="btn btn-outline-light btn-social mx-1" >
                        <i className="fab fa-fw fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-outline-light btn-social mx-1" >
                        <i className="fab fa-fw fa-twitter"></i>
                    </a>
                    <a className="btn btn-outline-light btn-social mx-1" >
                        <i className="fab fa-fw fa-linkedin-in"></i>
                    </a>
                    <a className="btn btn-outline-light btn-social mx-1" >
                        <i className="fab fa-fw fa-dribbble"></i>
                    </a>
                    </div>

                </div>
                </div>
            </div>

            <section className="copyright py-4 text-center text-white">
                <div className="container">
                <small>Copyright &copy; Rancho Taxanghu 2019</small>
                </div>
            </section>
        </div>
        );
    }
}