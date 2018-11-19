import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import { Rating } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import accounting from "accounting-js";

import { ShopApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class CartItem extends Component {
  state = {
    SHOPNAME: "",
    shop_menus: [],
    POINT: null,
    reviews: []
  };

  componentDidMount = () => {
    ShopApi.getShopInfo({ id: this.props.shop }).then(shop => this.setState(shop.data.shop));
  };

  showShop = () => Actions.push("shop", { id: this.props.shop });
  showReview = () => Actions.push("review", { id: this.props.shop });
  doOrder = () => Actions.push("cartItem", { id: this.props.shop });

  getMenu = id => {
    for (var i in this.state.shop_menus) {
      const menu = this.state.shop_menus[i];

      if (menu._id === id) return menu;
    }

    return { MENUNAME: "", PRICE: 0, sales: [] };
  };

  getOptionPrice = (id, options) => {
    if (!options || this.state.shop_menus.length === 0) return 0;
    const menus = this.getMenu(id);

    if (menus.shop_menu_options.length === 0) return 0;

    var price = 0;
    for (var i in menus.shop_menu_options) {
      const option = menus.shop_menu_options[i];
      if (options[option.OPTIONID]) price += option.shop_option.PRICE;
    }
    return price;
  };

  getOptionNames = (id, options) => {
    if (!options || this.state.shop_menus.length === 0) return "";
    const menus = this.getMenu(id);

    if (!menus.shop_menu_options || menus.shop_menu_options.length === 0) return "";

    var result = [];
    for (var i in menus.shop_menu_options) {
      const option = menus.shop_menu_options[i];
      if (options[option.OPTIONID]) result.push(option.shop_option.OPTIONNAME);
    }
    return " / " + result.join(", ");
  };

  render() {
    return (
      <View style={{ paddingLeft: 30, paddingRight: 30, marginTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#212529", fontSize: textResizing(23), fontWeight: "bold", marginRight: 5 }}>{this.state.SHOPNAME}</Text>
          {this.state.POINT !== null ? (
            <Rating startingValue={this.state.POINT} readonly={true} style={{ paddingVertical: 10, marginBottom: 2 }} imageSize={18} />
          ) : null}
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", marginTop: 7 }}>
          <TouchableWithoutFeedback onPress={this.showShop}>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text style={{ color: "#212529", fontSize: textResizing(20), paddingTop: 15, paddingBottom: 15 }}>메뉴/정보</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.showReview}>
            <View style={{ width: "50%", alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#dee2e6" }}>
              <Text style={{ color: "#212529", fontSize: textResizing(20), paddingTop: 15, paddingBottom: 15 }}>리뷰 ({this.state.reviews.length}개)</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ backgroundColor: "#FFF", borderColor: "#dee2e6", borderWidth: 1, padding: 20, paddingBottom: 13, marginTop: 20 }}>
          {this.props.cart.map((v, i) => (
            <View key={v.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
              <Text style={{ fontSize: textResizing(18), color: "#212529", marginRight: 5 }}>
                {this.getMenu(v.item).MENUNAME}
                {this.getOptionNames(v.item, v.options)}
              </Text>
              <Text style={{ fontSize: textResizing(18), fontWeight: "bold", color: "#212529", marginRight: 1 }}>
                {accounting.formatMoney(this.getMenu(v.item).PRICE + this.getOptionPrice(v.item, v.options), { symbol: "원", format: "%v%s", precision: 0 })}
              </Text>
              <Text style={{ fontSize: textResizing(10), color: "#212529", marginRight: 1 }}>∙</Text>
              <Text style={{ fontSize: textResizing(18), color: "#212529" }}>{v.count}개</Text>
            </View>
          ))}
        </View>

        <TouchableWithoutFeedback onPress={this.doOrder}>
          <View style={{ alignItems: "center", backgroundColor: "#f8f9fa", borderWidth: 1, borderColor: "#dee2e6", borderTopWidth: 0 }}>
            <Text style={{ color: "#212529", fontSize: textResizing(20), fontWeight: "bold", paddingTop: 15, paddingBottom: 15 }}>
              {this.props.cart.length}개 주문하기
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {this.props.end ? null : <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: "#dee2e6" }} />}
      </View>
    );
  }
}
