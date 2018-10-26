import React, { Component } from "react";
import { View, Text, Image } from "react-native";

export default class MainItem extends Component {
  displayMenu = (menus, id) => {
    if (!menus[id]) return null;

    return (
      <Text style={{ fontSize: 18, color: "#2b303b" }}>
        {menus[id].MENUNAME} : <Text style={{ textDecorationLine: "line-through" }}>{menus[id].PRICE}</Text> {menus[id].sales[0].PRICE}원 (
        {menus[id].sales[0].COUNT})
      </Text>
    );
  };

  getDisplayImage = menus => {
    for (var i in menus) {
      if (menus.URL) return URL;
    }

    return "https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Image&w=318&h=180";
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", marginLeft: 10, marginBottom: 10 }}>
        <Image style={{ width: 82, height: 82, borderRadius: 8, marginRight: 10 }} source={{ uri: this.getDisplayImage(this.props.shop_menus) }} />
        <View>
          <Text style={{ color: "#697998", fontSize: 21, marginTop: 2, fontWeight: "bold", marginBottom: 5 }}>{this.props.SHOPNAME}</Text>
          {this.displayMenu(this.props.shop_menus, 0)}
          {this.displayMenu(this.props.shop_menus, 1)}
          {this.displayMenu(this.props.shop_menus, 2)}
        </View>
      </View>
    );
  }
}
