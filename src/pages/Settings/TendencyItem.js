import React, { Component } from "react";
import { ListItem, CheckBox, Body, Text, Icon } from "native-base";
import { Bar } from "react-native-progress";

export default class TendencyItem extends Component {
  render() {
    return (
      <ListItem>
        <CheckBox checked={true} />
        <Body>
          <Text>{this.props.name}</Text>
          <Icon name="arrow-back" />
          <Bar progress={0.3} />
          <Icon name="arrow-forward" />
        </Body>
      </ListItem>
    );
  }
}
