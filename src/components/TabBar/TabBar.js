import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";

const items = [
  { icon: require("assets/icons/tabs/m-store.svg"), label: "홈", route: "main" },
  { icon: require("assets/icons/tabs/m-search.svg"), label: "검색", route: "search" },
  { icon: require("assets/icons/tabs/m-logo.svg"), label: "채팅", route: "chat" },
  { icon: require("assets/icons/tabs/m-list.svg"), label: "기록", route: "order" },
  { icon: require("assets/icons/tabs/m-cart.svg"), label: "카트", route: "cart" }
];

export default class TabBar extends Component {
  render() {
    return (
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 99,
          height: 70,
          backgroundColor: "#468ef7",
          alignItems: "center"
        }}
      >
        <View
          style={{
            marginTop: -10,
            width: 60,
            height: 60,
            backgroundColor: "#468ef7",
            borderRadius: 100
          }}
        />
        <View style={{ flexDirection: "row", marginTop: -33, width: "100%", justifyContent: "space-around", paddingLeft: 7, paddingRight: 7 }}>
          {items.map((v, i) => (
            <TouchableWithoutFeedback key={i} onPress={Actions[v.route]}>
              <View style={{ alignItems: "center" }}>
                <Image source={v.icon} style={{ width: 25, height: 25 }} />
                <Text style={{ color: this.props.navigation.state.key === v.route ? "#FFF" : "#468ef7", marginTop: 5, fontSize: 12 }}>{v.label}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    );
  }
}
