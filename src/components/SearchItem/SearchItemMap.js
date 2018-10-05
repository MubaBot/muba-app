import React, { Component } from "react";
import { WebView, View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: 100,
    marginTop: 5
  },
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
      <View style={styles.view}>
        <WebView ref={r => (this.webview = r)} style={styles.webView} source={require("assets/html/daum.map.preview.html")} scrollEnabled={false} startInLoadingState={true} />
      </View>
    );
  }
}
