import React, { Component } from "react";

import {
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import swal from '@sweetalert/with-react';

import "./TaskModal.css";
import TaskForm from "../TaskForm/TaskForm";

class TaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null
    }
  }

  editTask = (task) => {
    swal({
      title: `Editar pendiente`,
      text: `Modifica los campos del pendiente`,
      content: <TaskForm task={this.props.task} users={this.props.users} edit={true} updateTask={this.props.updateTask} ></TaskForm>,
      buttons: false,
      className: "width-800pt-100h"
    })
  }

  render() {
    const { task } = this.props;
    return (
      < Container >
        <React.Fragment>
          <Row className="mt-4">
            <Col>
              <h5 className="text-center">Pendiente</h5>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <Button variant="info" className="option-button" onClick={this.editTask.bind(this, task)}>EDITAR</Button>
            </Col>
            <Col>
              <Button variant="danger" className="option-button" onClick={this.props.deleteTask.bind(this, task._id)}>ELIMINAR</Button>
            </Col>
          </Row>
        </React.Fragment>
      </Container >
    )
  }
}

export default TaskModal;