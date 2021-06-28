import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    Button,
    Card,
    Container,
    Jumbotron,
    Row,
} from 'react-bootstrap'
import swal from '@sweetalert/with-react';

import { getEmails, updateEmail } from '../../../../actions/emailActions'

import EmailForm from '../EmailForm/EmailForm'

import "./EmailPanel.css";

const EmailPanel = ({ getEmails, updateEmail }) => {
    const [emails, setEmails] = useState([])

    const refresh = async () => {
        const data = await getEmails();
        setEmails(data.emails)
    }

    const onUpdate = (data) => {
        updateEmail(data).then(({ status }) => {
            if (status === 200) {
                swal({
                    icon: "success",
                    content: <h2>Email actualizado</h2>,
                })
            } else {
                swal({
                    icon: "error",
                    content: <h2>Error al actualizar</h2>,
                })
            }
        }).catch((err) => {
            swal({
                icon: "error",
                content: <h2>Error al actualizar</h2>,
            })
        }).finally(async () => {
            await refresh()
        })
    }

    const openModificationModal = (email) => {
        swal({
            title: `Edición de mails: ${email.language}`,
            content:
                <EmailForm email={email} onUpdate={onUpdate} />,
            className: "width-800pt-100h",
            buttons: false
        });
    }

    useEffect(() => {
        refresh()
    }, [])

    return (
        <Container className="mt-4">
            <Row>
                <h2>Panel de Emails</h2>
            </Row>
            <br />
            <div className="full-width">
                {emails?.map((email) =>
                    <Card className="m-4">
                        <Card.Header>
                            {email.language}
                        </Card.Header>
                        <Card.Body>
                            <Jumbotron>
                                <h5>
                                    {`Correo de recordatorio`}
                                </h5>
                                <Container className="p-4">
                                    <Row>
                                        <h6>{`Asunto: `}</h6>
                                        <div className="email-div">
                                            <p>{email.reminderEmail.header}</p>
                                        </div>
                                    </Row>
                                    <Row className="mt-3">
                                        <h6>{`Contenido: `}</h6>
                                        <div className="email-div">
                                            <p>
                                                {email.reminderEmail.content}
                                            </p>
                                        </div>
                                    </Row>
                                </Container>
                            </Jumbotron>
                            <Jumbotron>
                                <h5>
                                    {`Correo de vencimiento`}
                                </h5>
                                <Container className="p-4">
                                    <Row>
                                        <h6>{`Asunto: `}</h6>
                                        <div className="email-div">
                                            <p>{email.lapsedEmail.header}</p>
                                        </div>
                                    </Row>
                                    <Row className="mt-3">
                                        <h6>{`Contenido: `}</h6>
                                        <div className="email-div">
                                            <p>
                                                {email.lapsedEmail.content}
                                            </p>
                                        </div>
                                    </Row>
                                </Container>
                            </Jumbotron>
                        </Card.Body>
                        <Card.Footer>
                            <Button
                                variant="info"
                                className="float-right"
                                onClick={(e) => openModificationModal(email, e)}>
                                <i className="fa fa-edit" aria-hidden="true"></i>
                            </Button>
                        </Card.Footer>
                    </Card>
                )}
            </div>
        </Container>
    )
}

EmailPanel.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { getEmails, updateEmail }
)(EmailPanel);