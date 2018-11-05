import React, { Component } from "react";
import { TouchableWithoutFeedback, ScrollView, View, Text, Alert } from "react-native";

import { Actions } from "react-native-router-flux";
import Toast from "react-native-easy-toast";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import Info from "./Info";
import Menus from "./Menus";
import DaumMap from "./DaumMap";

import { ShopApi, CartApi } from "@/apis";

export default class Shop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.navigation.state.params.id || 0,
      loading: true,
      cartLength: 0,

      MENUS: [],
      ADDRESS: "",
      ADDRESSDETAIL: "",
      SHOPNAME: "",
      PHONE: "",
      shop_address: {}
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.navigation.state.params.id === 0) Actions.pop();
    else {
      this.updateShopInfo();
    }
  };

  componentDidMount = () => {
    if (this.state.id === 0) Actions.pop();
    else {
      this.updateShopInfo();
    }
  };

  updateShopInfo = () =>
    ShopApi.getShopInfo({ id: this.state.id }).then(res => {
      this.setState({
        ...res.data.shop,
        ADDRESS: res.data.shop.shop_address.ADDRESS,
        ADDRESSDETAIL: res.data.shop.shop_address.ADDRESSDETAIL,
        MENUS: res.data.shop.shop_menus,
        loading: false
      });

      this.updateCartInfo();
    });

  updateCartInfo = () => CartApi.getShopCart(this.state.id).then(result => this.setState({ cartLength: result.length }));
  addCart = menu =>
    CartApi.addShopCart(this.state.id, menu).then(() => {
      this.updateCartInfo();
      this.refs.toast.show("장바구니에 추가하였습니다.");
    });

  doOrder = () => {
    if (this.state.cartLength === 0) return Alert.alert("메뉴를 추가해주세요.");
    Actions.push("cartItem", { id: this.state.id });
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <ScrollView style={{ marginBottom: 50 }}>
          <View style={{ marginTop: 30, paddingLeft: 20, paddingRight: 20, paddingBottom: 25, borderBottomColor: "#dee2e6", borderBottomWidth: 1 }}>
            <Info {...this.state} />
          </View>

          {this.state.shop_address.ADDRESS ? (
            <TouchableWithoutFeedback
              onPress={() =>
                Actions.push("daumMapShop", {
                  name: this.state.SHOPNAME,
                  address: this.state.shop_address.ADDRESS,
                  lat: this.state.shop_address.ADDRLAT,
                  lng: this.state.shop_address.ADDRLNG
                })
              }
            >
              <View style={{ width: "100%", height: 200, borderBottomColor: "#dee2e6", borderBottomWidth: 1 }}>
                <DaumMap
                  name={this.state.SHOPNAME}
                  address={this.state.shop_address.ADDRESS}
                  lat={this.state.shop_address.ADDRLAT}
                  lng={this.state.shop_address.ADDRLNG}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : null}

          <View style={{ marginTop: 30, paddingLeft: 20, paddingRight: 20 }}>
            {this.state.MENUS.map((v, i) => (
              <Menus key={v._id} endItem={this.state.MENUS.length - 1 === i} {...v} addCart={this.addCart} />
            ))}
          </View>
        </ScrollView>
        <View style={{ position: "absolute", bottom: 0, width: "100%", zIndex: 9999, height: 50 }}>
          <TouchableWithoutFeedback onPress={this.doOrder}>
            <View style={{ backgroundColor: "#468ef7", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>{this.state.cartLength}개 주문하기</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Toast
          ref="toast"
          positionValue={175}
          style={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20 }}
          textStyle={{ fontSize: 20, fontWeight: "bold", color: "#FFF" }}
        />
      </LoadingContainer>
    );
  }
}
