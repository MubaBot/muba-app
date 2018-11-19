import React, { Component } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { Icon, Text } from "native-base";

import CONFIG, { textResizing, marginResizing } from "@/config";

const styles = StyleSheet.create({
  chatContainer: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    height: 50
  },
  chatText: {
    position: "absolute",
    right: 80,
    lineHeight: Platform.OS === "ios" ? 65 : 50,
    fontSize: textResizing(20)
  },
  chatButton: {
    position: "absolute",
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

export default class ChatButton extends Component {
  render() {
    const goToChat = () => Actions.chat({});
    return (
      <View style={styles.chatContainer}>
        <Text style={styles.chatText}>무바랑 대화하기</Text>
        <View style={styles.chatButton}>
          <Icon onPress={goToChat} name="chatboxes" style={{ color: "white" }} />
        </View>
      </View>
    );
  }
}
