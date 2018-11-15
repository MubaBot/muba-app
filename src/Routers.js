// import * as Expo from "expo";
import React, { Component } from "react";
import { Scene, Router, Tabs, Actions } from "react-native-router-flux";

import Main from "@/pages/Main";
import Search from "@/pages/Search";
import Order from "@/pages/Order";
import Cart from "@/pages/Cart";
import Review from "@/pages/Review";

import Login from "@/pages/Login";
import Register from "@/pages/Register";

import Settings from "@/pages/Settings";
import DaumMapSetting from "@/pages/DaumMapSetting";
import DaumMapShop from "@/pages/DaumMapShop";
// import DaumMapSearch from "@/pages/DaumMapSearch";

import Shop from "@/pages/Shop";
import CartItem from "@/pages/CartItem";

import Chat from "@/pages/Chat";

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
          <Tabs key="tabs" hideTabBar={true} headerMode="screen" onEnter={this.requireAuth} navBar={TabBar}>
            <Scene key="main" lazy={true} component={Main} title="Muba" onEnter={this.requireAuth} initial={true} />
            <Scene key="search" lazy={true} component={Search} title="Search" onEnter={this.requireAuth} />
            <Scene key="order" lazy={true} component={Order} title="Order" onEnter={this.requireAuth} />
            <Scene key="cart" lazy={true} component={Cart} title="Cart" onEnter={this.requireAuth} />
            <Scene key="chat" lazy={true} component={Chat} title="Chat" onEnter={this.requireAuth} />
          </Tabs>

          <Scene key="login" component={Login} title="Login" gesturesEnabled={false} />
          <Scene key="register" component={Register} title="Register" />

          {/* popup */}
          <Scene key="settings" component={Settings} title="Settings" onEnter={this.requireAuth} />
          <Scene key="daumMapSetting" component={DaumMapSetting} title="Daum Map" />
          <Scene key="daumMapShop" component={DaumMapShop} title="Daum Map" />
          
          <Scene key="review" component={Review} title="Review" />
          <Scene key="shop" component={Shop} title="Shop Information" onEnter={this.requireAuth} />
          <Scene key="cartItem" component={CartItem} title="Shop Cart Information" />

          {/* <Scene key="daumMapSearch" component={DaumMapSearch} title="Daum Map Search" /> */}
        </Scene>
      </Router>
    );
  }
}
