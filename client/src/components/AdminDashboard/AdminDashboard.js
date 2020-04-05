import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "react-select/dist/react-select.css";
import "react-table/react-table.css";
import "./AdminDashboard.css";


class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
  }

  refresh = () => {
    this.props.getClients().then(data => {
      this.setState({ data: data.clients });
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

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <h2>Admin</h2>
      </React.Fragment>
    );
  }
}

AdminDashboard.propTypes = {
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
)(AdminDashboard);
