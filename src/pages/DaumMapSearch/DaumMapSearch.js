import React, { Component } from "react";
import { WebView, StyleSheet } from "react-native";
import { Container, Header, Body, Left, Right, Title, Icon } from "native-base";
import { Actions } from "react-native-router-flux";

import RouteButton from "@/components/RouteButton";
import { User } from "@/apis";

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
  };

  window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = "(" + String(patchPostMessageFunction) + ")();";

export default class DaumMapSearch extends Component {
  onSubmit = data => {
    User.setAddressForDevice({ road_address: data.fullAddr, address_name: "", detail_address: "", lat: data.lat, lng: data.lng });
    Actions.settings();
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Set Place Search</Title>
          </Body>
          <Right />
        </Header>
        <WebView
          style={styles.webView}
          injectedJavaScript={patchPostMessageJsCode}
          source={require("assets/html/daum.address.html")}
          scrollEnabled={true}
          startInLoadingState={true}
          onMessage={event => this.onSubmit(JSON.parse(event.nativeEvent.data))}
        />
      </Container>
    );
  }
}
