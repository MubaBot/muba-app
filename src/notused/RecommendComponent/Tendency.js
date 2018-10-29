import React, { Component } from "react";
import { Label, List } from "native-base";

import TendencyItem from "./TendencyItem";

export default class Tendency extends Component {
  render() {
    return (
      <List style={{ flex: 1 }}>
        <Label>성향 설정</Label>
        <TendencyItem name="맵기" />
        <TendencyItem name="가격" />
        <TendencyItem name="간" />
      </List>
    );
  }
}
