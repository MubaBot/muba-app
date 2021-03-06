import React, { Component } from "react";
import { WebView, StyleSheet } from "react-native";

import { ShopApi } from "@/apis";

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default class DaumMap extends Component {
  setLatLng = ({ lat, lng }) => ShopApi.setLatlng({ id: this.props.id, lat, lng });

  render() {
    return (
      <WebView
        style={styles.webView}
        source={require("assets/html/daum.map.preview.html")}
        injectedJavaScript={require("assets/html/daum.map.preview.html.js")(this.props.name, this.props.address, this.props.lat, this.props.lng)}
        scrollEnabled={false}
        startInLoadingState={true}
        onMessage={event => this.setLatLng(JSON.parse(event.nativeEvent.data))}
      />
    );
  }
}
