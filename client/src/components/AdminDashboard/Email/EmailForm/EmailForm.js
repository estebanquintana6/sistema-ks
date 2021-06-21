import React, { useState } from "react";

import {
    Button,
    Form,
    Col,
    Jumbotron,
    Row
} from 'react-bootstrap';

const EmailForm = ({ email, onUpdate }) => {
    const [formData, setFormData] = useState(email);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData)
    }

    return (
        <Form id="emailForm" onSubmit={handleSubmit}>
            <Jumbotron>
                <h6 className="invoice-title">{`Email de recordatorio`}</h6>
                <Form.Row>
                    <Form.Group as={Col} md={5}>
                        <Form.Label>Encabezado de correo</Form.Label>
                        <Form.Control
                            required
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    reminderEmail: {
                                        ...formData.reminderEmail,
                                        header: e.target.value
                                    }
                                })
                            }}
                            value={formData.reminderEmail?.header} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Contenido de email</Form.Label>
                        <Form.Control
                            as="textarea"
                            required
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    reminderEmail: {
                                        ...formData?.reminderEmail,
                                        content: e.target.value
                                    }
                                })
                            }}
                            value={formData.reminderEmail?.content} />
                    </Form.Group>
                </Form.Row>
            </Jumbotron>

            <Jumbotron>
                <h6 className="invoice-title">{`Email de vencimiento`}</h6>
                <Form.Row>
                    <Form.Group as={Col} md={5}>
                        <Form.Label>Encabezado de correo</Form.Label>
                        <Form.Control
                            required
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    lapsedEmail: {
                                        ...formData?.lapsedEmail,
                                        header: e.target.value
                                    }
                                })
                            }}
                            value={formData.lapsedEmail?.header} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Contenido de email</Form.Label>
                        <Form.Control
                            required
                            as="textarea"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    lapsedEmail: {
                                        ...formData.lapsedEmail,
                                        content: e.target.value
                                    }
                                })
                            }}
                            value={formData.lapsedEmail?.content} />
                    </Form.Group>
                </Form.Row>
            </Jumbotron>
            <Row className="d-flex">
                <div className="ml-auto mr-4">
                    <Button
                        variant="primary"
                        type="submit"
                        className="btn-primary">
                        <i className="fas fa-save"></i>
                    </Button>
                </div>
            </Row>
        </Form>
    );
}

export default EmailForm;