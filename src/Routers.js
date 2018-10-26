// import * as Expo from "expo";
import React, { Component } from "react";
import { Scene, Router, Tabs, Actions } from "react-native-router-flux";

import Main from "@/pages/Main";
import Search from "@/pages/Search";
import Chat from "@/pages/Chat";

// import Order from "@/pages/Order";
// import Recommend from "@/pages/Recommend";

import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import DaumMap from "@/pages/DaumMap";
// import DaumMapSearch from "@/pages/DaumMapSearch";

import { AuthApi } from "@/apis";

import TabBar from "@/components/TabBar";

export default class Muba extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  // componentWillMount = () => this.loadFonts();

  requireAuth = async (nextState, replace) => {
    if (!(await AuthApi.isLogged())) {
      Actions.login({ route: nextState.routeName });
    } else Actions.refresh();
  };

  // async loadFonts() {
  //   await Expo.Font.loadAsync({
  //     // Roboto: require("native-base/Fonts/Roboto.ttf"),
  //     // Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  //     // Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
  //   });
  //   this.setState({ isReady: true });
  // }

  render() {
    // if (!this.state.isReady) {
    //   return <Expo.AppLoading />;
    // }

    return (
      <Router hideNavBar>
        <Scene key="root" hideNavBar>
          <Tabs key="main" hideTabBar={true} headerMode="screen" onEnter={this.requireAuth} navBar={TabBar}>
            <Scene key="main" lazy={true} component={Main} title="Muba" initial={true} onEnter={this.requireAuth} />
            <Scene key="search" lazy={true} component={Search} title="Search" />
            {/* <Scene key="order" component={Order} title="Order" /> */}
            {/* <Scene key="recommend" component={Recommend} title="Recommend" /> */}
          </Tabs>

          <Scene key="login" component={Login} title="Login" gesturesEnabled={false} />
          <Scene key="register" component={Register} title="Register" />

          {/* popup */}
          <Scene key="settings" component={Settings} title="Settings" gesturesEnabled={false} onEnter={this.requireAuth} />

          <Scene key="daumMap" component={DaumMap} title="Daum Map" />

          <Scene key="chat" component={Chat} title="Chat" gesturesEnabled={false} />

          {/* <Scene key="daumMapSearch" component={DaumMapSearch} title="Daum Map Search" /> */}
        </Scene>
      </Router>
    );
  }
}
