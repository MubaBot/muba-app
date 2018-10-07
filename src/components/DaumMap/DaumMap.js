import React, { Component } from "react";
import { WebView, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default class DaumMap extends Component {
  webView = null;

  constructor(props) {
    super(props);
    // alert(JSON.stringify(props));
  }

  componentDidMount = () => {
    this.webView.postMessage("test");
  };

  render() {
    return <WebView ref={r => (this.webView = r)} style={styles.webView} source={require("assets/html/daum.map.preview.html")} scrollEnabled={true} startInLoadingState={true} onMessage={event => alert(event.nativeEvent.data)} />;
  }
}
