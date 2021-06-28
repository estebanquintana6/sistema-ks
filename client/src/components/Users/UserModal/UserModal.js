import React, { Component } from "react";

import {
    Button,
    Container,
    Row
} from 'react-bootstrap';

import './UserModal.css';

class UserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const user = this.props.user;
        return (
            <Container>
                <Row className="mt-4">
                    <h5 className="text-center">{user.email}</h5>
                    <div className="user-button-wrapper">
                        {user.role === "user" &&
                            <Button
                                className="action-btn"
                                onClick={this.props.changeRol.bind(this, user._id, "admin", user.name)}>
                                HACER ADMIN
                            </Button>
                        }
                        {user.role === "admin" || user.role === "superadmin" &&
                            <Button
                                className="action-btn"
                                onClick={this.props.changeRol.bind(this, user._id, "user", user.name)}>
                                HACER USUARIO
                            </Button>
                        }
                        <Button
                            variant="danger"
                            className="action-btn"
                            onClick={this.props.deleteUser.bind(this, user._id, user.name)}>
                            ELIMINAR
                        </Button>
                        {!user.active &&

                            <Button
                                variant="success"
                                className="action-btn"
                                onClick={this.props.activateUser.bind(this, user._id, user.name)}>
                                ACTIVAR
                            </Button>
                        }
                    </div>
                </Row>
            </Container>
        )
    }
}

export default UserModal;