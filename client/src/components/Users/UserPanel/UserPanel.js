import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { listUsers } from "../../../actions/userActions";
import { changeRol, deleteUser } from "../../../actions/adminActions";

import swal from '@sweetalert/with-react';

import {
  Col,
  Row
} from 'react-bootstrap';


import ReactTable from "react-table";

import UserModal from "../UserModal/UserModal";

import "./UserPanel.css";
import "react-table/react-table.css";


class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filtered: [],
      select2: undefined
    };
  }

  async componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    this.props.listUsers().then(data => {
      this.setState({
        data: data
      })
    });
  }

  changeRol = (id, role, name, e) => {
    let rol;

    if (role === "admin") rol = "administrador";
    else rol = "usuario";

    swal({
      title: `¿Estas seguro de querer volver ${rol} a ${name}?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        this.props.changeRol(id, role);
        swal("Rol cambiado", { icon: "success" })
          .then(() => {
            this.getUsers();
          });
      }
    });
  }

  confirmDelete = (id) => {
    this.props.deleteUser(id);
  }

  deleteUser = (id, name, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar a ${name}?`,
      text: "Una vez eliminado ya no podras recuperarlo!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmDelete(id);
          swal("Puf! Tu usuario se ha eliminado!", {
            icon: "success",
          });
          this.getUsers();
        }
      });
  }

  openModificationModal(user) {
    swal({
      content: <UserModal
        user={user}
        changeRol={this.changeRol}
        deleteUser={this.deleteUser}>
      </UserModal>,
      buttons: false
    });
  }

  getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
      return {
        style: {
          cursor: "pointer"
        },
        onClick: (e) => {
          this.openModificationModal(rowInfo.original);
        }
      }
    }
    return {};
  }

  onFilteredChangeCustom = (value, accessor) => {
    let filtered = this.state.filtered;
    let insertNewFilter = 1;

    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) filtered.splice(i, 1);
          else filter["value"] = value;

          insertNewFilter = 0;
        }
      });
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value });
    }

    this.setState({ filtered: filtered });
  };

  render() {
    const { data } = this.state;
    return (
      <Row className="mt-4 justify-content-md-center">
        <Row>
          <Col md={12}>
            <h2 className="text-center">Panel de usuarios</h2>
          </Col>
          <Col md={12}>
            <p className="text-center">Instrucciones: Haz click para poder eliminar o cambiar el rol de un usuario</p>
          </Col>
        </Row>
        <Col md={12}>
          <ReactTable
            data={data}
            filterable
            filtered={this.state.filtered}
            onFilteredChange={(filtered, column, value) => {
              this.onFilteredChangeCustom(value, column.id || column.accessor);
            }}
            defaultFilterMethod={(filter, row, column) => {
              const id = filter.pivotId || filter.id;
              if (typeof filter.value === "object") {
                return row[id] !== undefined
                  ? filter.value.indexOf(row[id]) > -1
                  : true;
              } else {
                if (row[id] !== undefined) {
                  return row[id] !== undefined
                    ? String(row[id]).indexOf(String(filter.value).toLocaleLowerCase()) > -1
                    : true;
                }
              }
            }}
            columns={[
              {
                Header: "Datos",
                columns: [
                  {
                    Header: "Rol",
                    accessor: "role"
                  },
                  {
                    Header: "Nombre",
                    accessor: "name"
                  },
                  {
                    Header: "Apellidos",
                    accessor: "last_name"
                  },
                  {
                    Header: "Email",
                    accessor: "email"
                  },
                ]
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            getTrProps={this.getTrProps}>
          </ReactTable>
        </Col>
      </Row>
    );
  }
}

UserPanel.propTypes = {
  listUsers: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { listUsers, changeRol, deleteUser }
)(UserPanel);