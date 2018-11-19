import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image } from "react-native";

import { Actions } from "react-native-router-flux";
import SvgImage from "react-native-remote-svg";
import accounting from "accounting-js";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class MainItem extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Actions.push("shop", { id: this.props.SHOPID })}>
        <View
          style={{ marginTop: 20, width: "49%", marginRight: this.props.position % 2 === 0 ? "1%" : 0, marginLeft: this.props.position % 2 === 0 ? 0 : "1%" }}
        >
          <Image
            style={{ width: "100%", height: 140, borderRadius: 3 }}
            source={{ uri: "https://api.mubabot.com/static/" + (this.props.URL ? "menu/" + this.props.URL : "public/img/noimage.png") }}
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
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: textResizing(14) }}>{this.props.sales[0].COUNT}개 남음</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <SvgImage source={require("assets/icons/icon-dot.svg")} style={{ marginTop: 2, marginRight: 3, width: 8, height: 8 }} />
            <Text style={{ color: "#468ef7", fontSize: textResizing(14) }}>지금 할인중</Text>
          </View>

          <Text style={{ color: "#212529", fontSize: textResizing(16), marginTop: 3 }}>{this.props.SHOPNAME}</Text>
          <Text style={{ color: "#212529", fontSize: textResizing(20), marginTop: 7 }}>{this.props.MENUNAME}</Text>
          <Text style={{ textDecorationLine: "line-through", color: "#868e96", fontSize: textResizing(16), marginTop: 5 }}>
            {accounting.formatMoney(this.props.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
          </Text>
          <Text style={{ fontSize: textResizing(20), color: "#212529", fontWeight: "bold" }}>
            {accounting.formatMoney(this.props.sales[0].PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
