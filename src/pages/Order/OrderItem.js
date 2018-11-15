import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import accounting from "accounting-js";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import SvgImage from "react-native-remote-svg";

import { OrderApi, CartApi } from "@/apis";

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ADMISSION: props.ADMISSION,
      review: !!props.review
    };
  }

  reOrder = async () => {
    await CartApi.clearCart(this.props.SHOPID);

    for (var i in this.props.order_menus) {
      const menu = this.props.order_menus[i];

      const cartItem = await CartApi.addShopCart(this.props.SHOPID, menu.MENUID);
      await CartApi.updateCountByCartInShop(this.props.SHOPID, cartItem.id, menu.COUNT);

      for (var o in menu.order_menu_options) {
        const option = menu.order_menu_options[o];
        await CartApi.updateOptionByCartInShop(this.props.SHOPID, cartItem.id, option.shop_menu_option._id);
      }
    }

    Actions.push("cartItem", { id: this.props.SHOPID });
  };

  displayAdmission = admission => {
    switch (admission) {
      case 0:
        return (
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#e75d5d" }}>
            {this.props.order_refuse_message ? this.props.order_refuse_message.NAME : "거절됨"}
          </Text>
        );
      case 1:
        return <Text style={{ fontSize: 18, fontWeight: "bold", color: "#468ef7" }}>승인됨</Text>;
      case 2:
        return <Text style={{ fontSize: 18, fontWeight: "bold", color: "#e75d5d" }}>취소함</Text>;
      case null:
        return <Text style={{ fontSize: 18, fontWeight: "bold", color: "#77dd77" }}>대기중</Text>;
    }
  };

  cancelMenu = () => {
    OrderApi.cancelMenu({ order: this.props._id })
      .then(() => this.setState({ ADMISSION: 2 }))
      .catch(err => alert(JSON.stringify(err)));
  };

  writeReview = () => {
    if (this.state.ADMISSION === 1 && !this.state.review) {
      Actions.push("review", { id: this.props.SHOPID, order: this.props._id });
    }
  };

  getOptionPrice = menu => {
    if (menu.order_menu_options.length === 0) return 0;

    var price = 0;
    for (var i in menu.order_menu_options) {
      const option = menu.order_menu_options[i];
      price += option.shop_menu_option.shop_option.PRICE;
    }

    return price;
  };

  getOptionNames = menu => {
    if (menu.order_menu_options.length === 0) return "";

    var options = [];
    for (var i in menu.order_menu_options) {
      const option = menu.order_menu_options[i];
      options.push(option.shop_menu_option.shop_option.OPTIONNAME);
    }

    return " / " + options.join(", ");
  };

  getCancelAndWriteReviewButton = () => {
    if (this.state.ADMISSION === null) return <Text style={{ paddingTop: 15, paddingBottom: 15, color: "#212529" }}>주문취소</Text>;
    if (this.state.ADMISSION === 1) {
      if (this.state.review) return <Text style={{ paddingTop: 15, paddingBottom: 15, color: "#adb5bd" }}>리뷰작성</Text>;
      return <Text style={{ paddingTop: 15, paddingBottom: 15, color: "#212529" }}>리뷰작성</Text>;
    }

    return <Text style={{ paddingTop: 15, paddingBottom: 15, color: "#adb5bd" }}>주문취소</Text>;
  };

  render() {
    return (
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#dee2e6" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Text style={{ color: "#212529", fontSize: 14 }}>{moment(this.props.createdAt).fromNow()}</Text>
          {this.displayAdmission(this.state.ADMISSION)}
        </View>
        <Text style={{ color: "#212529", fontWeight: "bold", fontSize: 24, marginTop: 5 }}>{this.props.shop.SHOPNAME}</Text>
        <Text style={{ color: "#868e96", fontSize: 16, marginTop: 5 }}>{this.props.ADDRESS}</Text>

        <View style={{ backgroundColor: "#FFF", borderColor: "#dee2e6", borderWidth: 1, borderBottomWidth: 0, padding: 20, paddingBottom: 13, marginTop: 20 }}>
          {this.props.order_menus.map((v, i) => (
            <View key={v._id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
              <Text style={{ fontSize: 18, color: "#212529", marginRight: 5 }}>
                {v.shop_menu.MENUNAME}
                {this.getOptionNames(v)}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#212529", marginRight: 1 }}>
                {accounting.formatMoney(v.PRICE + this.getOptionPrice(v), { symbol: "원", format: "%v%s", precision: 0 })}
              </Text>
              <Text style={{ fontSize: 10, color: "#212529", marginRight: 1 }}>∙</Text>
              <Text style={{ fontSize: 18, color: "#212529" }}>{v.COUNT}개</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", backgroundColor: "#f8f9fa" }}>
          <TouchableWithoutFeedback onPress={this.reOrder}>
            <View style={{ width: "50%", alignItems: "center", borderRightWidth: 1, borderRightColor: "#dee2e6" }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15, color: "#212529" }}>재주문</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.state.ADMISSION === null ? this.cancelMenu : this.writeReview}>
            <View style={{ width: "50%", alignItems: "center" }}>{this.getCancelAndWriteReviewButton()}</View>
          </TouchableWithoutFeedback>
        </View>

        {this.props.order_refuse_message && this.props.order_refuse_message.MESSAGE ? (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <SvgImage source={require("assets/icons/icon-alert-triangle.svg")} style={{ width: 13, height: 13 }} />
            <Text style={{ color: "#e75d5d", marginTop: 2, marginLeft: 2 }}>{this.props.order_refuse_message.MESSAGE}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}
