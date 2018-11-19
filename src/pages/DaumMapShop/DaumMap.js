import React, { Component } from "react";
import { TouchableWithoutFeedback, WebView, View, Text, StyleSheet, Linking } from "react-native";

import { Actions } from "react-native-router-flux";
import Image from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

import CONFIG, { textResizing, marginResizing } from "@/config";

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default class DaumMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      LAT: props.navigation.state.params.lat || 0,
      LNG: props.navigation.state.params.lng || 0,
      NAME: props.navigation.state.params.name || "",
      ADDRESS: props.navigation.state.params.address || ""
    };
  }

  showDaumMap = () => {
    Linking.openURL("http://map.daum.net/link/map/" + [this.state.NAME, this.state.LAT, this.state.LNG].join(","));
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={null}>
        <View
          style={{
            height: 50,
            width: "100%",
            alignItems: "center",
            paddingTop: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#e9ecef",
            backgroundColor: "#FFF",
            zIndex: 999
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingLeft: 30, paddingRight: 30 }}>
            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
              <View>
                <Image source={require("assets/icons/m-prev.svg")} style={{ width: 20, height: 20 }} />
              </View>
            </TouchableWithoutFeedback>

            <Text style={{ fontSize: textResizing(25), fontWeight: "bold", color: "#212529" }}>{this.state.NAME}</Text>

            <TouchableWithoutFeedback onPress={this.showDaumMap}>
              <View style={{ width: 20, height: 20 }}>
                <Image source={require("assets/icons/icon-link.svg")} style={{ width: 20, height: 20 }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={{ height: "100%", marginTop: -10 }}>
          <WebView
            style={styles.webView}
            source={require("assets/html/daum.map.preview.html")}
            injectedJavaScript={require("assets/html/daum.map.full.html.js")(this.state.NAME, this.state.ADDRESS, this.state.LAT, this.state.LNG)}
            scrollEnabled={false}
            startInLoadingState={true}
          />
        </View>
      </LoadingContainer>
    );
  }
}
