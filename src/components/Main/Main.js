import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Button, Text } from "native-base";
import ChatButton from "./ChatButton";

export default class Main extends Component {
  async clearChat() {
    await AsyncStorage.removeItem("chatCount");
    await AsyncStorage.removeItem("chat");
    alert("clear");
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 128, backgroundColor: "white" }}>
        <Button transparent danger onPress={this.clearChat}>
          <Text>Clear Chat</Text>
        </Button>
        <ChatButton />
      </View>
    );
  }
}
