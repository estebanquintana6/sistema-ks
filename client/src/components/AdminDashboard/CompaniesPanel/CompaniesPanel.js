import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Container, Button } from 'react-bootstrap'
import swal from '@sweetalert/with-react';
import "react-select/dist/react-select.css";
import "react-table/react-table.css";
import "./CompaniesPanel.css";
import ReactTable from "react-table";
import CompanyModal from '../CompanyModal/CompanyModal'
import CompanyForm from '../CompanyForm/CompanyForm'
import { getCompanies, updateCompany, registerCompany, deleteCompany } from '../../../actions/companyActions'


class CompaniesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      data: []
    };
  }

  async componentDidMount() {
    this.props.getCompanies().then(data => {
      this.setState({ data: data.companies });
    });
  }

  refresh = () => {
    this.props.getCompanies().then(data => {
      this.setState({ data: data.companies });
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

  registerCompany = (companyData) => {
    this.props.registerCompany(
      companyData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Aseguradora guardada</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar al Aseguradora</h2>,
          });
        }
        this.refresh();
      });
  }

  updateCompany = (companyData) => {
    this.props.updateCompany(
      companyData)
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          swal({
            icon: "success",
            content: <h2>Aseguradora actualizada</h2>,
          });
        } else {
          swal({
            icon: "error",
            content: <h2>Error al guardar Aseguradora</h2>,
          });
        }
        this.refresh();
      });
  }

  addCompany = e => {
    swal({
      title: `Registro de Companye`,
      text: "Captura los datos del nuevo Companye",
      content: <CompanyForm save={this.registerCompany}></CompanyForm>,
      buttons: false
    })
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

  openModificationModal(company) {
    swal({
      content: <CompanyModal
        company={company}
        updateCompany={this.updateCompany}
        deleteCompany={this.deleteCompany}>
      </CompanyModal>,
      buttons: false
    });
  }

  deleteCompany = (id, name, e) => {
    swal({
      title: `¿Estas seguro de querer eliminar a ${name}?`,
      text: "Una vez eliminada ya no podras recuperarla!",
      icon: "warning",
      buttons: true,
      sucessMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.confirmDelete(id);
          swal("Tu aseguradora se ha eliminado!", {
            icon: "success",
          });
          this.refresh();
        }
      });
  }

  confirmDelete = (id) => {
    this.props.deleteCompany(id);
  }

  render() {
    const { data } = this.state;
    return (<React.Fragment>
      <Row>
        <h2>Aseguradoras</h2>
      </Row>
      <Container className="mt-4">
        <Row>
          <a onClick={this.addCompany} className="btn-primary">Registrar nueva</a>
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
                Header: "Nombre",
                id: "name",
                accessor: d => d.name
              },
            ]
          }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          getTrProps={this.getTrProps}
        />
        <div className="row">
          <div className="col-md-4 center mt-4">
            {/* <ExportCSV csvData={this.state.data} fileName="reporteAseguradoras" /> */}
          </div>
        </div>

      </div>
    </React.Fragment>)
  }
}

CompaniesPanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCompanies, deleteCompany, updateCompany, registerCompany }
)(CompaniesPanel);