import React, { Component } from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";

import { Actions } from "react-native-router-flux";

import Loading from "./Loading";

import { AuthApi } from "apis";

// import KeyboardSpacer from "react-native-keyboard-spacer";
import CONFIG, { textResizing, marginResizing } from "@/config";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  appBar: {
    backgroundColor: "#79B45D",
    height: APPBAR_HEIGHT
  },
  content: {
    flex: 1,
    backgroundColor: "#33373B"
  }
});

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor, zIndex: 99999 }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class LoadingContainer extends Component {
  state = { load: true };

  onLoad = async () => {
    if (this.props.requireAuth) {
      const logged = !!(await AuthApi.getAuthentication()) && (await AuthApi.isLogged());
      this.setState({ load: !logged });

      if (!logged) return Actions.push("Login", { route: Actions.currentScene });
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
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <MyStatusBar backgroundColor="#FFF" color barStyle="dark-content" />
        {this.props.header ? (
          <View
            style={{
              height: 50,
              width: "100%",
              alignItems: "center",
              paddingTop: marginResizing(15),
              paddingBottom: marginResizing(10),
              borderBottomWidth: 1,
              borderBottomColor: "#e9ecef",
              backgroundColor: "#FFF",
              zIndex: 999
            }}
          >
            {this.props.header ? this.props.header : null}
          </View>
        ) : null}

        <View style={[{ flex: 1, backgroundColor: "white" }, this.props.style]} {...this.props}>
          {this.props.children}
        </View>
        <Loading hide={!this.state.load} />
        {/* <KeyboardSpacer /> */}
      </View>
    );
  }
}
