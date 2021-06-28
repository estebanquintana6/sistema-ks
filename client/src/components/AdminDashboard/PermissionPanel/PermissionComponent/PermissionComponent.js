import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Card,
    Col,
    Button,
    Form,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap'

import { connect } from "react-redux";
import swal from '@sweetalert/with-react';


import {
    listUsers,
    setPermission,
    removePermission
} from '../../../../actions/userActions';

const PermissionComponent = ({
    insuranceType,
    usersWithPermission,
    listUsers,
    setPermission,
    refresh,
    removePermission }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers().then((users) => {
            setUsers(users)
        })
    }, [])

    const addUser = e => {
        if (!e.target.value) return;
        const user = e.target.value;
        setPermission(user, insuranceType.name).then(({ status }) => {
            if (status === 200) {
                refresh()
                swal({
                    icon: "success",
                    content: <h2>Permisos actualizados</h2>,
                })
            }
        })
    }

    const deleteUser = (user) => {
        console.log(user)
        removePermission(user, insuranceType.name).then(({ status }) => {
            if (status === 200) {
                refresh()
                swal({
                    icon: "success",
                    content: <h2>Permisos actualizados</h2>,
                })
            }
        })
    }

    const arr_diff = (a1, a2) => {
        let a = [], diff = [];

        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (let k in a) {
            diff.push(k);
        }

        return diff;
    }

    const assignableUsers = () => {
        const emailsWithPermission = usersWithPermission.map((user) => user.email);
        const allEmails = users.map((user) => user.email)
        const difference = arr_diff(allEmails, emailsWithPermission);

        return users.filter((user) => {
            return difference.includes(user.email);
        })
    }

    const toggleAddUserModal = (insuranceType) => {
        console.log(insuranceType)
        swal({
            title: `Ramo de ${insuranceType.name}`,
            icon: "info",
            content:
                <Form.Group controlId="newCompany" onChange={addUser}>
                    <Form.Label>Encargados</Form.Label>
                    <Form.Control as="select">
                        <option></option>
                        {assignableUsers().map((user, index) =>
                            <option key={index} value={user._id}>
                                {`${user.name} ${user.last_name}`}
                            </option>)
                        }
                    </Form.Control>
                </Form.Group>,
            buttons: false
        })
    }

    console.log(insuranceType.name, users)

    return (
        <Col md="6" className="mt-4">
            <Card>
                <Card.Header>
                    {insuranceType.name}
                </Card.Header>
                <Card.Body>
                    <ListGroup className="list-group-flush">
                        {usersWithPermission?.map((user, index) => {
                            return (
                                <ListGroupItem key={index}>
                                    {`${user?.name} ${user?.last_name}`}
                                    <Button
                                        onClick={deleteUser.bind(this, user._id)}
                                        variant="danger"
                                        className="float-right">
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true" />
                                    </Button>
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    <Button
                        variant="info"
                        className="float-right"
                        onClick={toggleAddUserModal.bind(this, insuranceType)}>
                        <i className="fa fa-plus" aria-hidden="true" />
                    </Button>
                </Card.Footer>
            </Card>
        </Col>
    )
}

PermissionComponent.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { listUsers, setPermission, removePermission }
)(PermissionComponent);