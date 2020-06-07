import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  Card,
  Col,
  Button,
  Form,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'

import { connect } from "react-redux";
import swal from '@sweetalert/with-react';

import "react-table/react-table.css";
import "./InsuranceTypeComponent.css";

class InsuranceTypesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailed: false,
      addingCompany: false
    };
  }

  toggleDetail = () => {
    this.setState((prevState) => {
      return { ...prevState, detailed: !prevState.detailed }
    })
    console.log('CHANGE', this.state)
  }

  toggleAddingCompany = insuranceType => {
    swal({
      title: `Ramo de ${insuranceType.name}`,
      icon: "info",
      content:
        <Form.Group controlId="newCompany" onChange={this.addUser}>
          <Form.Label>Encargados</Form.Label>
          <Form.Control as="select">
            <option></option>
            {this.assignableUsers().map((user, index) => <option key={index} value={user.email}>{user.name}</option>)}
          </Form.Control>
        </Form.Group>,
      buttons: false
    })
  }

  addUser = e => {
    if (!e.target.value) return;
    const email = e.target.value;
    const userData = { email: email }
    this.props.addUser(userData, this.props.insuranceType._id)
    this.setState({ [e.target.id]: e.target.value, addingCompany: false });
  }

  deleteUser = email => {
    const userEmail = email;
    this.props.deleteUser(this.props.insuranceType._id, userEmail);

    this.setState({ detailed: false })
  }

  arr_diff = (a1, a2) => {
    let a = [], diff = [];

    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (let k in a) {
        diff.push(k);
    }

    return diff;
}

  assignableUsers = () => {
    const emails = this.props.users.map((user) => user.email);
    const difference = this.arr_diff(emails, this.props.insuranceType.emails);

    const users = this.props.users.filter((user) => {
      return difference.includes(user.email);
    })

    return users;
  }

  render() {
    const { insuranceType } = this.props
    return (
      <Col md="6" className="mt-4">
        <Card>
          <Card.Header>
            {insuranceType.name}
          </Card.Header>
          <Card.Body>
            <ListGroup className="list-group-flush">
              {insuranceType.emails.map((email, index) => {
                return (
                  <ListGroupItem key={index}>
                    {email}
                    <Button variant="danger" className="float-right" onClick={this.deleteUser.bind(this, email)}>
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <Button variant="info" className="float-right" onClick={this.toggleAddingCompany.bind(this, insuranceType)}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    )
  }
}

InsuranceTypesComponent.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(InsuranceTypesComponent);