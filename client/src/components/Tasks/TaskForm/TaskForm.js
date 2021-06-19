import 'date-fns';
import React, { Component } from "react";
import {
  Button,
  Form,
  Col,
  Jumbotron,
  Row,
} from 'react-bootstrap';
import "./TaskForm.css"
import moment from 'moment'
import { cloneDeep } from 'lodash'

class TaskForm extends Component {
  constructor(props) {
    super(props);
    if (!this.props.edit) {
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
    this.setState({ assignee });
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
    if (user.length > 0) return user[0].name;
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
    return (
      <Form id="taskForm" onSubmit={this.onSubmit}>
        <Row>
          <h5 className="swal-title form-title align-left">GENERALES</h5>
        </Row>
        <Jumbotron>
          <Form.Row>
            <Form.Group as={Col} md="3" controlId="status">
              <Form.Label>Estatus</Form.Label>
              <Form.Control required as="select" onChange={this.onChange} value={this.state.status}>
                <option></option>
                <option value="Pendiente">Pendiente</option>
                <option value="Terminado">Terminado</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md={{ span: 3, offset: 6 }} controlId="insurance_type">
              <Form.Label>Tipo de seguro</Form.Label>
              <Form.Control required as="select" onChange={this.onChange} value={this.state.insurance_type}>
                <option></option>
                <option value="GM">GM</option>
                <option value="AUTO">AUTO</option>
                <option value="VIDA">VIDA</option>
                <option value="DANOS">DANOS</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="title">
              <Form.Label>Cliente</Form.Label>
              <Form.Control required onChange={this.onChange} value={this.state.title} />
            </Form.Group>
            <Form.Group as={Col} controlId="insurance_company">
              <Form.Label>Aseguradora</Form.Label>
              <Form.Control as="select" onChange={this.onChange} value={this.state.insurance_company && this.state.insurance_company._id}>
                <option></option>
                {this.props.companies.map((company) => <option value={company._id}>{`${company.name}`}</option>)}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Row>
            <Form.Group controlId="comments" as={Col}>
              <Form.Label>Comentarios</Form.Label>
              <Form.Control required as="textarea" onChange={this.onChange} value={this.state.comments}>
              </Form.Control>
            </Form.Group>
          </Row>
        </Jumbotron>
        <Row>
          <h5 className="swal-title form-title align-left">RESPONSABLES</h5>
        </Row>
        <Jumbotron>
          <Row className="pt-1 pb-2">
            <Col md="12">
              <Button variant="info" onClick={this.createAssignee}>AGREGAR</Button>
            </Col>
          </Row>
          <Row className="mt-3">
            {this.state.assignee.map((assignee, index) => {
              return (
                <Form.Group as={Col} md={{ span: 6, offset: 3 }} controlId={`assignee${index}`}>
                  <Form.Label>Asignado a:</Form.Label>
                  <Form.Control as="select" onChange={this.addAsignee.bind(this, index)} value={assignee._id}>
                    <option></option>
                    {this.props.users.map((user, index) => {
                      console.log(assignee._id, user._id);
                      console.log(assignee._id === user._id);
                      return (<option value={user._id} selected={assignee._id === user._id}>
                        {user.name}
                      </option>);
                    })}
                  </Form.Control>
                </Form.Group>
              );
            })}
          </Row>
        </Jumbotron>
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    );
  }

}

export default TaskForm;