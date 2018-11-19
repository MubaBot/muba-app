import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";
// import SvgIcon from "react-native-svg-icon";

import CONFIG, { textResizing, marginResizing } from "@/config";

const items = [
  { icon: require("assets/icons/tabs/icon-home.svg"), iconSelect: require("assets/icons/tabs/icon-home-select.svg"), label: "홈", route: "main" },
  { icon: require("assets/icons/tabs/icon-search.svg"), iconSelect: require("assets/icons/tabs/icon-search-select.svg"), label: "상점찾기", route: "search" },
  { icon: require("assets/icons/tabs/icon-message.svg"), iconSelect: require("assets/icons/tabs/icon-message-select.svg"), label: "챗봇", route: "chat" },
  { icon: require("assets/icons/tabs/icon-list.svg"), iconSelect: require("assets/icons/tabs/icon-list-select.svg"), label: "주문목록", route: "order" },
  { icon: require("assets/icons/tabs/icon-cart.svg"), iconSelect: require("assets/icons/tabs/icon-cart-select.svg"), label: "장바구니", route: "cart" }
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
          backgroundColor: "#FFF",
          alignItems: "center",
          borderTopColor: "#e9ecef",
          borderTopWidth: 1
        }}
      >
        <View style={{ flexDirection: "row", width: "100%", marginTop: 13, justifyContent: "space-around", paddingLeft: 7, paddingRight: 7 }}>
          {items.map((v, i) => (
            <TouchableWithoutFeedback key={i} onPress={Actions[v.route]}>
              <View style={{ alignItems: "center" }}>
                <Image source={this.props.navigation.state.key === v.route ? v.iconSelect : v.icon} style={{ width: 25, height: 25 }} />
                {/* <SvgIcon style={{ width: 25, height: 25 }} svgs={v.icon} />; */}
                <Text style={{ color: this.props.navigation.state.key === v.route ? "#468ef7" : "#868e96", marginTop: 5, fontSize: textResizing(12) }}>
                  {v.label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    );
  }
}
