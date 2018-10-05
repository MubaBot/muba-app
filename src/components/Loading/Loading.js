import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { CircleSnail } from "react-native-progress";

import HideView from "components/HideView";

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center"
  },

  circle: {
    width: "auto",
    margin: "auto"
  }
});

export default class Loading extends Component {
  render() {
    return (
      <HideView hide={this.props.hide === true ? true : false} style={styles.background}>
        <View style={styles.circle}>
          <CircleSnail color={"rgba(255,255,255,0.8)"} size={100} thickness={7} duration={750} spinDuration={1000} strokeCap={"square"} />
        </View>
      </HideView>
    );
  }
}
