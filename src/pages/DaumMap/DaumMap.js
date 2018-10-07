import React, { Component } from "react";
import { WebView, StyleSheet } from "react-native";
import { Container, Header, Body, Left, Right, Title, Icon } from "native-base";

import RouteButton from "@/components/RouteButton";

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default class DaumMap extends Component {
  webview = null;

  constructor(props) {
    super(props);
    // alert(JSON.stringify(props));
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <RouteButton transparent link="settings">
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Set Place</Title>
          </Body>
          <Right />
        </Header>
        <WebView ref={r => (this.webview = r)} style={styles.webView} source={require("assets/html/daum.map.html")} scrollEnabled={false} startInLoadingState={true} />
      </Container>
    );
  }
}
