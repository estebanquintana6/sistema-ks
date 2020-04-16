import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button, Col, Container, Card, Row } from 'react-bootstrap'

import swal from '@sweetalert/with-react';

import { getTasks, registerTask, deleteTask, updateTask } from '../../../actions/taskAction'
import { listUsers } from '../../../actions/userActions'

import TaskModal from "../TaskModal/TaskModal";
import TaskForm from "../TaskForm/TaskForm";


import "react-select/dist/react-select.css";
import "react-table/react-table.css";
import "./TaskPanel.css";


class TaskPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "me",
      data: [],
      users: [],
    };
  }

  async componentDidMount() {
    this.prepareUsersForForm();
    this.refresh();
  }

  getAssignedTo = (task, who) => {
    if(who === "me") {
      return task.assignee.email === this.props.auth.user.email;
    } else {
      return task.assignee.email !== this.props.auth.user.email;
    }
}

  refresh = () => {
    this.props.getTasks().then(data => {
      this.setState({ data: data.tasks });
    });
  }

  prepareUsersForForm = () => {
    this.props.listUsers().then(data => {
      this.setState({ users: data });
    });
  }

  registerTask = (taskData) => {
    this.props.registerTask(taskData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Pendiente añadido</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al añadir pendiente</h2>,
          });
        }
        this.refresh();
      });
  }

  updateTask = (taskData) => {
    this.props.updateTask(
      taskData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Pendiente Actualizado</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar el pendiente</h2>,
          });
        }
        this.refresh();
      });
  }

  addTask = e  => {
    swal({
      title: `Registro de pendiente`,
      text: "Captura los datos del pendiente",
      content:
        <TaskForm
          users={this.state.users}
          save={this.registerTask}
          updateTask={this.updateTask}
          deleteTask={this.deleteTask}
        >
        </TaskForm>,
      className: "width-800pt-100h",
      buttons: false
    });
  }

  openModificationModal(task) {
    swal({
      content: <TaskModal
        task={task}
        users={this.state.users}
        updateTask={this.updateTask}
        deleteTask={this.deleteTask}>
      </TaskModal>,
      buttons: false,
      title: `${task.title}`,
    });
  }

  deleteTask = (taskId, e) => {
    swal({
      title: `¿Estas seguro de querer el pendiente?`,
      text: "Una vez eliminado ya no podras recuperarlo!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmDelete(taskId);
          swal("Pendiente eliminado!", {
            icon: "success",
          });
        }
        this.refresh();
      });
  }

  confirmDelete = (taskId) => {
    this.props.deleteTask(taskId);
  }

  changeFilter = (who) => {
    this.setState({filter: who})
  }


  render() {
    const { data } = this.state;
    let { filter } = this.state;

    return (
      <React.Fragment>
        <Row>
          <h2>Pendientes</h2>
        </Row>
        <Container className="mt-4">
          <Row>
            <a onClick={this.addTask} className="btn-primary">Registrar nuevo</a>
          </Row>

          <Row className="justify-content-md-center">
            <Button variant="primary" className="mr-3" onClick={this.changeFilter.bind(this, "me")}>ASIGNADOS</Button>{' '}
            <Button variant="secondary" onClick={this.changeFilter.bind(this, "other")}>ENVIADOS</Button>{' '}
          </Row>
        </Container>
        <br />
        <div className="full-width">
          <Row>
        { data.filter((task) => {
          return this.getAssignedTo(task, filter)
        }).map((task, index) => {
          return (<Col md="4"><Card>
            <Card.Header><h5>{`${task.status}`}</h5></Card.Header>
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>
                  {' '}{`${task.title}`}{' '}
                </p>
                <footer className="blockquote-footer">
                {`${task.initiator.name}  ${task.initiator.last_name}`}
                </footer>
              </blockquote>
            </Card.Body>
            <Card.Footer>
              <Button onClick={this.openModificationModal.bind(this, task)}>Modificar</Button>
            </Card.Footer>
          </Card></Col>);
        })}
        </Row>
        </div>
      </React.Fragment>
    );
  }
}

TaskPanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTasks, registerTask, deleteTask, updateTask, listUsers }
)(TaskPanel);