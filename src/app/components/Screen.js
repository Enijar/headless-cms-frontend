import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import queryString from "query-string";
import Loading from "./Loading";
import services from "../services";
import { LOCAL_STORAGE_KEY_PREFIX } from "../core/consts";

@withRouter
export default class Screen extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  state = {
    authenticating: true,
  };

  async componentDidMount () {
    const {pathname, search} = this.props.location;
    const jwt = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}.jwt`);
    const authenticated = await services.authenticate(pathname, jwt);

    // Redirect to login
    if (!authenticated && pathname !== '/login') {
      return this.props.history.push(`/login?redirect=${encodeURI(pathname)}`);
    }

    // Redirect to requested route
    const {redirect} = queryString.parse(search);
    if (authenticated && redirect !== undefined && pathname !== redirect) {
      return this.props.history.push(redirect);
    }

    // Redirect to dashboard
    if (authenticated && pathname === '/login') {
      return this.props.history.push('/');
    }

    this.setState({authenticating: false});
  }

  render () {
    if (this.state.authenticating) {
      return <Loading>Authenticating...</Loading>;
    }

    return (
      <div className={`Screen Screen--${this.props.name}`}>
        {this.props.children}
      </div>
    );
  }
}