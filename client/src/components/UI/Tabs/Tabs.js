import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';

export default class Tabs extends Component {

  render() {
    return (
      <Nav fill variant="tabs" defaultActiveKey="link-1">
        <Nav.Item>
          <Nav.Link eventKey="link-1">Visitantes Actuales</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Invitaciones abiertas</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3">Mensajes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4">Notificaciones</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}
