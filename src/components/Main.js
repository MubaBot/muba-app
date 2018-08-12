import React, { Component } from "react";
import { View, Text } from "react-native";
import { Actions } from "react-native-router-flux";

export default class Main extends Component {
  render() {
    const goToPageTwo = () => Actions.chat({ text: "Hello World!" });
    return (
      <View style={{ margin: 128 }}>
        <Text onPress={goToPageTwo}>This is PageOne!</Text>
      </View>
    );
  }
}
