import React, { Component, createContext } from "react";
import PropTypes from "prop-types";

const Context = createContext({});

export const FormContext = Component => props => (
  <Context.Consumer>
    {/* @var {Object} form */}
    {form => <Component {...props} form={form}/>}
  </Context.Consumer>
);

export default class FormContextProvider extends Component {
  static propTypes = {
    data: PropTypes.object,
    errors: PropTypes.array,
    onChange: PropTypes.func,
    onElementFocus: PropTypes.func,
  };

  static defaultProps = {
    errors: [],
  };

  #handleChange = (name, value) => {
    if (this.props.onChange) {
      const {data} = this.props;
      data[name] = value;
      this.props.onChange(data);
    }
  };

  #onFocus = focusedElement => {
    if (this.props.onElementFocus) {
      this.props.onElementFocus(focusedElement);
    }
  };

  #getContext = () => ({
    data: this.props.data,
    errors: this.props.errors,
    onChange: this.#handleChange,
    onFocus: this.#onFocus,
  });

  render () {
    return (
      <Context.Provider value={this.#getContext()}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
