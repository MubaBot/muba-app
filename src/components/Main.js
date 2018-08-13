import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { Icon } from "native-base";

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    height: 50,
    padding: 10,
    paddingLeft: 12.5,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "#1e99dc"
  }
});

export default class Main extends Component {
  render() {
    const goToChat = () => Actions.chat({});
    return (
      <View style={{ flex: 1, paddingTop: 128, backgroundColor: "white" }}>
        <View style={styles.chatButton}>
          <Icon
            onPress={goToChat}
            name="chatboxes"
            style={{ color: "white" }}
          />
        </View>
      </View>
    );
  }
}
