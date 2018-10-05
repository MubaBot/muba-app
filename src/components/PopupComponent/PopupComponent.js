import React, { Component } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import HideView from "components/HideView";

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 900,
    alignItems: "center",
    justifyContent: "center"
  },

  info: {
    backgroundColor: "white",
    width: "90%",
    height: "70%",
    margin: "auto"
  }
});

export default class PopupComponent extends Component {
  render() {
    return (
      <HideView hide={this.props.hide === true ? true : false} style={styles.background} onPress={this.props.onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.info}>{this.props.children}</View>
        </TouchableWithoutFeedback>
      </HideView>
    );
  }
}
