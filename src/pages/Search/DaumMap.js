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
  webView = null;

  constructor(props) {
    super(props);

    if (props.address) {
      const addr = JSON.parse(props.address);

      this.state = {
        address: !!addr.state ? (!!addr.address1 ? [addr.state, addr.city, addr.address1].join(" ") : [addr.state, addr.city, addr.address2].join(" ")) : ""
      };
    } else {
      this.state = {
        address: ""
      };
    }
  }

  setLatLng = ({ lat, lng }) => ShopApi.setLatlng({ id: this.props.id, lat, lng });

  render() {
    return (
      <WebView
        ref={r => (this.webView = r)}
        style={styles.webView}
        source={require("assets/html/daum.map.preview.html")}
        injectedJavaScript={require("assets/html/daum.map.preview.html.js")(this.props.name, this.state.address, this.props.lat, this.props.lng)}
        scrollEnabled={false}
        startInLoadingState={true}
        onMessage={event => this.setLatLng(JSON.parse(event.nativeEvent.data))}
      />
    );
  }
}
