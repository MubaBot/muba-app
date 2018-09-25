import * as Expo from "expo";
import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Scene, Router, Actions } from "react-native-router-flux";

import Main from "./pages/Main";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default class Muba extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  componentWillMount = () => this.loadFonts();
  loggedIn = async () => AsyncStorage.getItem("user").then(user => user ? true : false);


  requireAuth = async (nextState, replace) => {
    if (!await this.loggedIn()) {
      Actions.login({});
    }
  }

  async loadFonts() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    return (
      <Router hideNavBar>
        <Scene key="root" hideNavBar>
          <Scene key="main" component={Main} title="Muba" initial={true} />
          <Scene key="login" component={Login} title="Login" />
          <Scene key="register" component={Register} title="Register" />

          <Scene key="chat" component={Chat} title="Chat" onEnter={this.requireAuth} />
          {/* <Scene key="settings" component={Settings} title="Settings" onEnter={this.requireAuth} /> */}
          <Scene key="settings" component={Settings} title="Settings" />
        </Scene>
      </Router>
    );
  }
}
