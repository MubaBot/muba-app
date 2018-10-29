import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { Button } from "native-base";

export default class ActionButton extends Component {
  render() {
    const goTo = () => {
      if (this.props.link) return Actions[this.props.link]({ ...this.props.linkOptions });
      if (this.props.goHome) return Actions.popTo("main");
      if (this.props.goBack) {
        return Actions.pop();
      }
    };

    return (
      <Button {...this.props} onPress={this.props.onPress ? this.props.onPress : goTo}>
        {this.props.children}
      </Button>
    );
  }
}
