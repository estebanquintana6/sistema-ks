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
    this.state = {
      assignee: []
    };
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

  addAsignee = e => {
    let { assignee } = this.state;
    assignee.push(e.target.value);
    this.setState({assignee});
    document.getElementById(e.target.id).value = "";
  }

  getUserName = (id) => {
    let user = this.props.users.filter((user) => {
      return user._id === id
    });
    console.log(user);
    if(user.length > 0) return user[0].name;
  }

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
          <h5 className="swal-title form-title align-left">GENERALES</h5>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Row>
              <Form.Group as={Col} controlId="title">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.title} />
              </Form.Group>
            </Form.Row>
          </Col>
        </Row>
        <Row>
        <Col>
              <Form.Group controlId="status">
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
          <Col>
          <Form.Group controlId="due_date">
            <Form.Label>Fecha de entrega</Form.Label>
            <Form.Control type="date" onChange={this.onChange} value={this.formatDate(this.state.due_date)}>
            </Form.Control>
          </Form.Group>
          </Col>
        </Row>
        <Row>
          <h5 className="swal-title form-title align-left">ASGINADOS</h5>
        </Row>
        <Row>
          <Col>
              <Form.Group controlId="assignee">
                <Form.Label>Asignado a:</Form.Label>
                <Form.Control as="select" onChange={this.addAsignee}>
                  <option></option>
                  {this.props.users.filter((user) => {
                                      return !this.state.assignee.includes(user._id)
                                    })
                                    .map((user, index) => 
                                        <option value={user._id} key={index}>{user.name}</option>
                                    )}
                </Form.Control>
              </Form.Group>
          </Col>
          <Col>
          <ul class="list-group">
            {this.state.assignee.map((user) => {
              return <li class="list-group-item">{this.getUserName(user)}</li>
            })}
          </ul>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default TaskForm;