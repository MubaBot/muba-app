import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import { Rating } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import accounting from "accounting-js";

import { ShopApi } from "@/apis";

export default class CartItem extends Component {
  state = {
    SHOPNAME: "",
    shop_menus: []
  };

  componentDidMount = () => {
    ShopApi.getShopInfo({ id: this.props.shop }).then(shop => this.setState(shop.data.shop));
  };

  showShop = () => Actions.push("shop", { id: this.props.shop });
  doOrder = () => Actions.push("cartItem", { id: this.props.shop });

  getMenu = id => {
    for (var i in this.state.shop_menus) {
      const menu = this.state.shop_menus[i];

      if (menu._id === id) return menu;
    }

    return { MENUNAME: "", PRICE: 0, sales: [] };
  };

  render() {
    return (
      <View style={{ paddingLeft: 30, paddingRight: 30, marginTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#212529", fontSize: 23, fontWeight: "bold", marginRight: 5 }}>{this.state.SHOPNAME}</Text>
          <Rating startingValue={3.0} readonly={true} style={{ paddingVertical: 10, marginBottom: 2 }} imageSize={18} />
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", marginTop: 7 }}>
          <TouchableWithoutFeedback onPress={this.showShop}>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text style={{ color: "#212529", fontSize: 20, paddingTop: 15, paddingBottom: 15 }}>메뉴/정보</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={{ width: "50%", alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#dee2e6" }}>
              <Text style={{ color: "#212529", fontSize: 20, paddingTop: 15, paddingBottom: 15 }}>리뷰</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6", borderWidth: 1, padding: 20, paddingBottom: 13, marginTop: 20 }}>
          {this.props.cart.map((v, i) => (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
              <Text style={{ fontSize: 18, color: "#212529", marginRight: 5 }}>{this.getMenu(v.item).MENUNAME}</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#212529", marginRight: 1 }}>
                {accounting.formatMoney(this.getMenu(v.item).PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
              </Text>
              <Text style={{ fontSize: 10, color: "#212529", marginRight: 1 }}>∙</Text>
              <Text style={{ fontSize: 18, color: "#212529" }}>{v.count}개</Text>
            </View>
          ))}
        </View>

        <TouchableWithoutFeedback onPress={this.doOrder}>
          <View style={{ alignItems: "center", backgroundColor: "#468ef7" }}>
            <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", paddingTop: 15, paddingBottom: 15 }}>{this.props.cart.length}개 주문하기</Text>
          </View>
        </TouchableWithoutFeedback>

        {this.props.end ? null : <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: "#dee2e6" }} />}
      </View>
    );
  }
}