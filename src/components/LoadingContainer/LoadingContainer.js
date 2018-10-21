import React, { Component } from "react";
import { Container } from "native-base";

import Loading from "@/components/Loading";
import { Auth } from "apis";
import { Actions } from "react-native-router-flux";

export default class LoadingContainer extends Component {
  state = { load: true };

  onLoad = async () => {
    if (this.props.requireAuth) {
      const logged = await Auth.isLogged();
      this.setState({ load: !logged });

      if (!logged) return Actions.pop();
    }

    if (this.props.loading === true || this.props.loading === false) this.setState({ load: this.props.loading });
    if (this.props.loading === true) return;
  };

  componentWillReceiveProps = async nextProps => {
    if (nextProps.loading === true || nextProps.loading === false) this.setState({ load: nextProps.loading });
  };

  componentDidMount = this.props.onLoad ? this.props.onLoad : this.onLoad;

  render() {
    return (
      <Container {...this.props}>
        {this.props.children}
        <Loading hide={!this.state.load} />
      </Container>
    );
  }
}
