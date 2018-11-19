import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image } from "react-native";

import { Rating } from "react-native-elements";
import moment from "moment";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class ReviewItem extends Component {
  getMenuOptions = menu => {
    let options = [];

    if (menu.order_menu_options.length === 0) return null;

    for (var i in menu.order_menu_options) {
      const option = menu.order_menu_options[i];
      options.push(option.shop_menu_option.shop_option.OPTIONNAME);
    }
    return options.join(", ");
  };

  getAllMenus = () => {
    let menus = [];

    for (var i in this.props.order.order_menus) {
      const menu = this.props.order.order_menus[i];

      const options = this.getMenuOptions(menu);

      const displayItem = menu.shop_menu.MENUNAME + " (" + (options ? [options, `${menu.COUNT}개`].join(", ") : `${menu.COUNT}개`) + ")";
      menus.push(displayItem);
    }

    return menus.join(" / ");
  };

  render() {
    return (
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#dee2e6" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: textResizing(20), fontWeight: "bold", color: "#212529" }}>{this.props.user.USERNAME}</Text>
            <Rating startingValue={this.props.POINT} readonly={true} style={{ marginLeft: 5, marginTop: 2 }} imageSize={12} />
          </View>
          <Text>{moment(this.props.createdAt).fromNow()}</Text>
        </View>

        <Text style={{ marginTop: 5, color: "#666" }}>{this.getAllMenus()}</Text>

        <View style={{ flexDirection: "row" }}>
          {this.props.review_photos.map((v, i) => (
            <TouchableWithoutFeedback key={v._id} onPress={() => this.props.galleryPhoto(this.props.review_photos)}>
              <View style={{ width: 60, height: 60, marginRight: 2, marginTop: 3 }}>
                <Image style={{ width: "100%", height: "100%" }} source={{ uri: ["https://api.mubabot.com", "static", "review", v.URL].join("/") }} />
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: textResizing(16), color: "#212529" }}>{this.props.TEXT}</Text>
        </View>
      </View>
    );
  }
}
