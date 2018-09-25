import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { Button } from "native-base";

export default class ActionButton extends Component {
  render() {
    const goTo = () => this.props.link ? Actions[this.props.link]({}) : null;
    return (<Button {...this.props} onPress={this.props.onPress ? this.props.onPress : goTo}>{this.props.children}</Button>);
  }
}