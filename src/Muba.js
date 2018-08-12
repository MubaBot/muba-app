import React, { Component } from "react";
import { Scene, Router } from "react-native-router-flux";

import Chat from "./components/Chat";
import Main from "./components/Main";

export default class Muba extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="main" component={Main} title="Muba" initial={true} />
          <Scene key="chat" component={Chat} title="Chat" />
        </Scene>
      </Router>
    );
  }
}
