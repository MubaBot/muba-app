import * as Expo from "expo";
import React, { Component } from "react";
import { Scene, Router, Actions } from "react-native-router-flux";

import Main from "@/pages/Main";
import Chat from "@/pages/Chat";

import Order from "@/pages/Order";
import Search from "@/pages/Search";
import Recommend from "@/pages/Recommend";

import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import DaumMap from "@/pages/DaumMap";
import DaumMapSearch from "@/pages/DaumMapSearch";

import { Auth } from "@/apis";

export default class Muba extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  componentWillMount = () => this.loadFonts();

  requireAuth = async (nextState, replace) => {
    if (!(await Auth.isLogged())) {
      Actions.login({ route: nextState.routeName });
    }
  };

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
          <Scene key="main" component={Main} title="Muba" initial={true} onEnter={this.requireAuth} />

          <Scene key="order" component={Order} title="Order" />
          <Scene key="recommend" component={Recommend} title="Recommend" />
          <Scene key="search" component={Search} title="Search" />

          <Scene key="chat" component={Chat} title="Chat" />

          <Scene key="login" component={Login} title="Login" gesturesEnabled={false} />
          <Scene key="register" component={Register} title="Register" />

          {/* popup */}
          <Scene key="settings" component={Settings} title="Settings" gesturesEnabled={false} />

          <Scene key="daumMap" component={DaumMap} title="Daum Map" />
          <Scene key="daumMapSearch" component={DaumMapSearch} title="Daum Map Search" />
        </Scene>
      </Router>
    );
  }
}
