import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Container } from 'react-bootstrap';
import ReactTable from "react-table";

import moment from 'moment';
import swal from '@sweetalert/with-react';

import { Row } from 'react-bootstrap'

import TaskModal from "../TaskModal/TaskModal";
import TaskForm from "../TaskForm/TaskForm";
import { ExportDataToCSV } from "../../ExportCSV/ExportCSV";

import { getTasks, registerTask, deleteTask, updateTask } from '../../../actions/taskAction'
import { getCompanies } from "../../../actions/companyActions"
import { listUsers } from '../../../actions/userActions'


import { formatShortDate } from '../../component-utils'

import "react-table/react-table.css";
import "./TaskPanel.css";

class TaskPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      select2: undefined,
      data: [],
      users: [],
      companies: [],
    };
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.change !== prevProps.change) {
  //     this.refresh();
  //   }
  // }

  async componentDidMount() {
    this.prepareUsersForForm();
    this.prepareCompaniesForForm();
    this.refresh();
    this.interval = setInterval(() => this.refresh(), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  refresh = () => {
    this.props.getTasks().then(data => {
      this.setState({ data: data.tasks });
    });
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

  prepareUsersForForm = () => {
    this.props.listUsers().then(data => {
      this.setState({ users: data });
    });
  }

  prepareCompaniesForForm = () => {
    this.props.getCompanies().then(data => {
      this.setState({ companies: data.companies })
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

  addTask = e => {
    swal({
      title: `Registro de pendiente`,
      text: "Captura los datos del pendiente",
      content:
        <TaskForm
          users={this.state.users}
          companies={this.state.companies}
          save={this.registerTask}
          updateTask={this.updateTask}
          deleteTask={this.deleteTask}
        >
        </TaskForm>,
      className: "width-800pt-100h",
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

  openModificationModal(task) {
    swal({
      content: <TaskModal
        task={task}
        users={this.state.users}
        companies={this.state.companies}
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

  validateField = (field) => {
    if (field) return field;
    return '';
  }


  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Container fluid className="mt-4">
            <Row>
              <h2>Pendientes</h2>
            </Row>
            <Row className="mt-4">
              <a onClick={this.addTask} className="btn-primary">Registrar nuevo</a>
            </Row>
          </Container>
          <br />
          <div className="full-width">
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
                      ? String(row[id]).indexOf(filter.value) > -1
                      : true;
                  }
                }
              }}
              columns={[{
                Header: "Datos",
                columns: [
                  {
                    Header: "Tipo S.",
                    id: "insurance_type",
                    accessor: d => d.insurance_type
                  },
                  {
                    Header: "Cliente",
                    id: "title",
                    accessor: d => d.title
                  },
                  {
                    Header: "Estatus",
                    id: "status",
                    accessor: d => d.status
                  },
                  {
                    Header: "Responsables",
                    id: "assignee",
                    accessor: d => {
                      if (d.assignee) {
                        let list = d.assignee.map((assignee) => {
                          return assignee.name;
                        })
                        return list.toString()
                      }
                      return '';
                    }
                  },
                  {
                    Header: "Creador",
                    id: "initiator",
                    accessor: d => {
                      if (d.initiator) {
                        return this.validateField(d.initiator.name);
                      }
                      return '';
                    }
                  },
                  {
                    Header: "Fecha de creación",
                    id: "created_date",
                    Cell: c => <span>{c.original.created_date && formatShortDate(c.original.created_date)}</span>,
                    accessor: d => moment(d.created_date).unix()
                  },
                  {
                    Header: "Comentarios",
                    id: "comments",
                    accessor: d => d.comments
                  }
                ]
              }
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
              getTrProps={this.getTrProps}
            />
            <div className="row">
              <div className="col-md-4 center mt-4">
                {/* <ExportClientCSV csvData={this.state.data} fileName="reporteClientes" /> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 center mt-4">
              <ExportDataToCSV
                csvData={this.state.data}
                fileName={`pendientes`}
                type="tasks"
                onComplete={this.refresh}
              />
            </div>
          </div>
        </Container>
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
  {
    getCompanies,
    getTasks,
    registerTask,
    deleteTask,
    updateTask,
    listUsers
  }
)(TaskPanel);