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
    if(!this.props.edit){
      this.state = {
        assignee: [""]
      };
    }
  }

  componentWillMount() {
    if (!this.props.edit) return;
    // prepare the Task data to be rendered in every field
    this.prepareTaskForForm();
  }

  prepareTaskForForm = () => {
    const auxObj = cloneDeep(this.props.task)
    auxObj['edit'] = this.props['edit'];
    this.setState(auxObj);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  addAsignee = (index, e) => {
    let { assignee } = this.state;
    assignee[index] = e.target.value;
    this.setState({assignee});
  }

  createAssignee = () => {
    const assignee = this.state.assignee;
    assignee.push("");
    this.setState({ assignee });
  }

  getUserName = (id) => {
    let user = this.props.users.filter((user) => {
      return user._id === id
    });
    if(user.length > 0) return user[0].name;
  }

  getActive = (assignee, user) => {
    return assignee === user._id;
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
    console.log(this.state.assignee);
    return (
      <Form id="taskForm" onSubmit={this.onSubmit}>
        <Row>
          <h5 className="swal-title form-title align-left">GENERALES</h5>
        </Row>
        <Row>
          <Col>
            <Form.Row>
              <Form.Group as={Col} controlId="title">
                <Form.Label>Asunto</Form.Label>
                <Form.Control required onChange={this.onChange} value={this.state.title} />
              </Form.Group>
            </Form.Row>
          </Col>
          <Col>
              <Form.Group controlId="status">
                <Form.Label>Estatus</Form.Label>
                <Form.Control required as="select" onChange={this.onChange} value={this.state.status}>
                  <option></option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Terminado">Terminado</option>
                </Form.Control>
              </Form.Group>
          </Col>
        </Row>

        <Row>
          <h5 className="swal-title form-title align-left">ASGINADOS</h5>
        </Row>
          <Row className="pt-1 pb-2">
                    <Col md="12">
                      <Button variant="info" onClick={this.createAssignee}>AGREGAR</Button>
                    </Col>
                  </Row>
          <Row>
          <Col>
              {this.state.assignee.map((assignee, index) => {
              return (
                <Form.Group controlId="assignee">
                  <Form.Label>Asignado a:</Form.Label>
                  <Form.Control as="select" onChange={this.addAsignee.bind(this, index)} value={this.state.assignee[index]}>
                    <option></option>
                    {this.props.users.map((user, index) => 
                                          <option 
                                                  selected={this.getActive.bind(assignee, user)} 
                                                  value={user._id} 
                                                  key={index}>{user.name}
                                          </option>
                                      )
                    }
                  </Form.Control>
                </Form.Group>
              );
              })}
          </Col>
          <Col>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default TaskForm;