import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Actions
import { logoutUser } from "../../actions/authActions";

//style
import "./Layout.css"

class Layout extends Component {
  
  constructor(props) {
      super(props);
      this.state = {
      };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        //const user  = this.props.auth
        let content = this.props.children            
        return(
            <>
              <div>
                      {content}
              </div>
            </>
        )
    }
}

Layout.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    auth: state.auth
  });

  export default connect(
    mapStateToProps,
    { logoutUser }
  )(Layout);
