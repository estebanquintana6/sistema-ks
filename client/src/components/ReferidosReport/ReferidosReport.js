import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import {getReferals} from "../../actions/fetchReferals";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {Col} from "react-bootstrap";
import moment from "moment";
import DataTable from 'react-data-table-component';


class ReferidosReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secoms: [],
            displayData: [],
            upperLimit: "",
            lowerLimit: "",
        };

    }



    async componentDidMount(){
        moment.locale('es');
        this.props.getReferals().then(data => {
            this.setState({
                displayData: data.referals
            })
        });
    }

    render() {

        const fields = [
            { selector: 'referido', name: "Nombre", sortable: true },
            { selector: 'contactoreferido', name: "Contacto", sortable: true },
            { selector: 'telefono', name: "telefono", sortable: true }
        ];
        return(
            <>      
                <Col md="12">
                    <h2>Referidos</h2>
                </Col>
                <Col className="mt-4">
                    <DataTable
                        columns={fields}
                        data={this.state.displayData}
                        pagination={true}
                    />
                </Col>
            </>
        );
    }
}
ReferidosReport.propTypes = {
    getReferals: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

  export default connect(
    mapStateToProps,
    { getReferals }
  )(withRouter(ReferidosReport));