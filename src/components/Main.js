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
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "#1e99dc",
    color: "white"
  }
});

export default class Main extends Component {
  render() {
    const goToChat = () => Actions.chat({});
    return (
      <View style={{ flex: 1, paddingTop: 128 }}>
        <Text onPress={goToChat}>This is PageOne!</Text>
        <Icon onPress={goToChat} name="chatboxes" style={styles.chatButton} />
      </View>
    );
  }
}
