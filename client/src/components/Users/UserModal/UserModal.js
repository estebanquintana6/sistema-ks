import React, { Component } from "react";

import {
  Button,
  Container,
  Row
} from 'react-bootstrap';

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
                    <table className="buttons">
                    <tr>
                        {user.role === "user" &&
                        <td>
                            <Button onClick={this.props.changeRol.bind(this, user._id, "admin", user.name)}>HACER ADMIN</Button>
                        </td>
                        }
                        {user.role === "admin" &&
                        <td>
                            <Button onClick={this.props.changeRol.bind(this, user._id, "user", user.name)}>HACER USUARIO</Button>
                        </td>
                        }
                        <td>
                        <Button variant="danger" onClick={this.props.deleteUser.bind(this, user._id, user.name)}>ELIMINAR</Button>
                        </td>
                        <td>
                            <Button variant="success" onClick={this.props.activateUser.bind(this, user._id, user.name)}>ACTIVAR</Button>
                        </td>
                    </tr>
                    </table>
                </Row>
            </Container>
        )
    }
}

export default UserModal;