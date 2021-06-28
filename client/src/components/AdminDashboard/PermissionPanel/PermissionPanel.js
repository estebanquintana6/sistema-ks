import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
    getInsuranceTypes
} from '../../../actions/insuranceTypesActions'
import { listUsersByPermissions } from '../../../actions/userActions';

import { Row, Col, Container } from 'react-bootstrap'

import PermissionComponent from './PermissionComponent/PermissionComponent'

const PermissionPanel = ({ getInsuranceTypes, listUsersByPermissions }) => {
    const [types, setTypes] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        getInsuranceTypes().then(data => {
            setTypes(data.insuranceTypes)
        });

        listUsersByPermissions().then(({ data }) => {
            setUsers(data)
        })
    }, [])

    const refreshUsersByPermission = () => {
        listUsersByPermissions().then(({ data }) => {
            setUsers(data)
        })
    }


    return (
        <React.Fragment>
            <Row>
                {types.filter(
                    (insuranceType) => insuranceType.name !== 'TRANSPORTE')
                    .map((insuranceType, index) =>
                        <PermissionComponent
                            key={index}
                            usersWithPermission={users[insuranceType.name]}
                            insuranceType={insuranceType}
                            refresh={refreshUsersByPermission} />
                    )
                }
            </Row>
        </React.Fragment>
    )
}

PermissionPanel.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { getInsuranceTypes, listUsersByPermissions }
)(PermissionPanel);