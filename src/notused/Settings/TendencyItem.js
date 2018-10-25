import React, { Component } from "react";
import { View } from "react-native";
import { ListItem, CheckBox, Body, Text } from "native-base";
import { Slider } from "react-native-elements";

export default class TendencyItem extends Component {
  state = { value: 0.3 };
  render() {
    return (
      <ListItem>
        <CheckBox checked={true} />
        <Body>
          <Text>{this.props.name}</Text>
          <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" }}>
            <Slider value={this.state.value} onValueChange={value => this.setState({ value })} />
          </View>
        </Body>
      </ListItem>
    );
  }
}
