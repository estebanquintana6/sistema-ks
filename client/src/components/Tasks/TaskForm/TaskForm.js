import 'date-fns';
import React, { Component } from "react";
import {
  Button,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import "./TaskForm.css"
import moment from 'moment'
import { cloneDeep } from 'lodash'

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.edit) return;
    // prepare the Task data to be rendered in every field
    this.prepareTaskForForm();
  }

  prepareTaskForForm = () => {
    const auxObj = cloneDeep(this.props.task)
    auxObj['edit'] = this.props['edit']
    this.setState(auxObj)
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if (!this.state.edit) {
      this.props.save(this.state);
      return;
    }
    this.props.updateTask(this.state)
  }

  formatDate = (date) => moment(date).format('YYYY-MM-DD')

  render() {
    return (
      <Form id="taskForm" onSubmit={this.onSubmit}>
        <Row>
          <Col md={6}>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="title">
                <Form.Label>Titulo de pendiente</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.title} />
              </Form.Group>
            </Form.Row>
          </Col>
          <Col md={6}>
              <Form.Group as={Col} md="12" controlId="status">
                <Form.Label>Estatus</Form.Label>
                <Form.Control required as="select" onChange={this.onChange} value={this.state.status}>
                  <option></option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Bloqueado">Bloqueado</option>
                  <option value="Terminado">Terminado</option>
                </Form.Control>
              </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group as={Col} controlId="assignee">
              <Form.Label>Asignado a:</Form.Label>
              <Form.Control required as="select" onChange={this.onChange} value={this.state.assignee && this.state.assignee._id}>
                <option></option>
                {this.props.users.map((user, index) => <option value={user._id} key={index}>{user.name}</option>)}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md="6">
          <Form.Group as={Col} controlId="due_date">
            <Form.Label>Fecha de entrega</Form.Label>
            <Form.Control type="date" onChange={this.onChange} value={this.formatDate(this.state.due_date)}>
            </Form.Control>
          </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default TaskForm;