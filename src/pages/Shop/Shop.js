import React, { Component } from "react";
import { TouchableWithoutFeedback, ScrollView, View, Text } from "react-native";

import { Actions } from "react-native-router-flux";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";

import { ShopApi, CartApi } from "@/apis";

export default class Shop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.navigation.state.params.id || 0,
      loading: false,
      cartLength: 0,

      MENUS: [],
      ADDRESS: "",
      SHOPNAME: "",
      PHONE: ""
    };
  }

  componentDidMount = () => {
    if (this.state.id === 0) Actions.pop();
    else {
      this.updateShopInfo();
    }
  };

  updateShopInfo = () =>
    ShopApi.getShopInfo({ id: this.state.id }).then(res => {
      const addr = JSON.parse(res.data.shop.shop_address.ADDRESS);

      this.setState({
        ...res.data.shop,
        ADDRESS: !!addr.state
          ? !!addr.address1
            ? [addr.state, addr.city, addr.address1, addr.options].join(" ")
            : [addr.state, addr.city, addr.address2, addr.options].join(" ")
          : "",
        MENUS: res.data.shop.shop_menus
      });

      this.updateCartInfo();
    });

  updateCartInfo = () => CartApi.getShopCart(this.props.id).then(result => this.setState({ cartLength: result.length }));

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <ScrollView style={{ marginBottom: 50 }}>
          <Text>{JSON.stringify(this.state)}</Text>
        </ScrollView>
        <View style={{ position: "absolute", bottom: 0, width: "100%", zIndex: 9999, height: 50 }}>
          <TouchableWithoutFeedback>
            <View style={{ backgroundColor: "#468ef7", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>{this.state.cartLength}개 주문하기</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </LoadingContainer>
    );
  }
}
