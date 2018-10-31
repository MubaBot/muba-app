import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image } from "react-native";

import { Actions } from "react-native-router-flux";
import SvgImage from "react-native-remote-svg";

export default class MainItem extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Actions.push("shop", { id: this.props.shop._id })}>
        <View
          style={{ marginTop: 20, width: "49%", marginRight: this.props.position % 2 === 0 ? "1%" : 0, marginLeft: this.props.position % 2 === 0 ? 0 : "1%" }}
        >
          <Image
            style={{ width: "100%", height: 140, borderRadius: 3 }}
            source={{ uri: this.props.shop_menu.URL || "https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Image&w=200&h=140" }}
          />
          <View
            style={{
              position: "absolute",
              right: 5,
              backgroundColor: "rgba(33,35,41,0.5)",
              opacity: 0.5,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
              top: 115
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 14 }}>{this.props.COUNT}개 남음</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <SvgImage source={require("assets/icons/icon-dot.svg")} style={{ marginTop: 2, marginRight: 3, width: 8, height: 8 }} />
            <Text style={{ color: "#468ef7", fontSize: 14 }}>지금 할인중</Text>
          </View>

          <Text style={{ color: "#212529", fontSize: 20, marginTop: 7 }}>{this.props.shop_menu.MENUNAME}</Text>
          <Text style={{ textDecorationLine: "line-through", color: "#868e96", fontSize: 16, marginTop: 5 }}>{this.props.shop_menu.PRICE}원</Text>
          <Text style={{ fontSize: 20, color: "#212529", fontWeight: "bold" }}>{this.props.PRICE}원</Text>
          <Text style={{ color: "#212529", fontSize: 16, marginTop: 3 }}>{this.props.shop.SHOPNAME}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
