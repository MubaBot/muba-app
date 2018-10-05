import React, { Component } from "react";
import { View } from "react-native";
import { Label } from "native-base";

import TendencyItem from "./TendencyItem";

export default class Tendency extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Label>내성향</Label>
        <TendencyItem name="맵기" />
        <TendencyItem name="가격" />
        <TendencyItem name="간" />
        <TendencyItem name="분위기" />
        <TendencyItem name="거리" />
      </View>
    );
  }
}
