import React, { Component } from "react";
import { TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Alert } from "react-native";

import { Actions } from "react-native-router-flux";
import accounting from "accounting-js";
import { isEqual } from "lodash";
import SvgImage from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import CartMenu from "./CartMenu";

import { UserApi, ShopApi, CartApi } from "@/apis";

export default class CartItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.state = { cart: [], MENUS: [], price: 0, nowAddress: "", PHONE: "", require: "", visit: false, OPEN: true };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextState.cart.length === 0) {
      Actions.pop({ id: this.props.id });
      return false;
    }

    if (
      isEqual(this.state.cart, nextState.cart) &&
      isEqual(this.state.MENUS, nextState.MENUS) &&
      this.state.price === nextState.price &&
      this.state.PHONE === nextState.PHONE &&
      this.state.detail_address === nextProps.detail_address
    )
      return false;

    return true;
  };

  componentDidMount = () => {
    this.updateShopInfo();
    this.updateCartInfo();
    this.syncNowAddress();
    this.getUserInfo();
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state.OPEN === true && nextState.OPEN === false) {
      Alert.alert("지금 영업중이지 않습니다.");
      Actions.pop({ id: this.props.id });
      return false;
    }

    return true;
  };

  componentDidUpdate = () => {
    if (this.state.MENUS.length === 0) return null;
    if (this.state.cart.length === 0) return null;

    let price = 0;

    for (var i in this.state.cart) {
      const cart = this.state.cart[i];

      price += this.getPrice(cart.item, cart.options, cart.count);
    }

    if (this.state.price !== price) {
      this.setState({ price: price });
    }
  };

  syncNowAddress = () =>
    UserApi.getAddressForDevice().then(address => {
      if (!address) return null;

      const addr = address.road_address !== "" ? address.road_address : address.address_name;

      this.setState({ nowAddress: addr, detail_address: address.detail_address, lat: address.lat, lng: address.lng });
    });

  updateShopInfo = () =>
    ShopApi.getShopInfo({ id: this.props.id }).then(res =>
      this.setState({
        OPEN: res.data.shop.OPEN,
        DELIVERY: res.data.shop.DELIVERY,
        MENUS: res.data.shop.shop_menus,
        visit: res.data.shop.DELIVERY ? false : true,
        loading: false
      })
    );

  updateCartInfo = () =>
    CartApi.getShopCart(this.props.id).then(result => {
      let PRICE = 0;

      this.setState({ cart: result, price: PRICE });
    });

  getUserInfo = () => UserApi.getUserInfoByServer().then(user => this.setState(user));

  clearCart = () => CartApi.clearCart(this.props.id).then(() => Actions.pop());

  onChangeAddress = address => this.setState({ detail_address: address });
  onChangePhone = phone => this.setState({ PHONE: phone });
  onChangeRequire = require => this.setState({ require: require });

  getPrice = (item, options, count) => {
    let price = 0;

    for (var i in this.state.MENUS) {
      if (this.state.MENUS[i]._id === item) {
        const menu = this.state.MENUS[i];

        if (menu.sales[0]) price += menu.sales[0].PRICE;
        else price += menu.PRICE;

        for (var o in options) {
          const option = options[o];
          if (option === true) price += this.getOptionPrice(menu.shop_menu_options, o);
        }
        break;
      }
    }

    return price * count;
  };

  getOptionPrice = (options, option) => {
    for (var i in options) {
      if (options[i]._id === parseInt(option)) return options[i].shop_option.PRICE;
    }

    return 0;
  };

  doOrder = () => {
    ShopApi.orderCart({
      id: this.props.id,
      cart: this.state.cart,
      address: this.state.nowAddress,
      address_detail: this.state.detail_address,
      require: this.state.require,
      phone: this.state.PHONE,
      visit: this.state.visit,
      lat: this.state.lat,
      lng: this.state.lng
    })
      .then(res => {
        if (res.data.price !== this.state.price) Alert.alert("", "가격이 변동되었습니다. 주문목록에서 상세 정보를 확인하세요.");
        else Alert.alert("", "주문되었습니다.");
        this.clearCart();
      })
      .catch(err => alert(JSON.stringify(err)));
  };

  orderVisit = () => this.setState({ visit: this.state.DELIVERY ? !this.state.visit : true });

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <KeyboardAvoidingView behavior="position">
          <ScrollView>
            {this.state.cart.map((v, i) => (
              <CartMenu
                key={v.id}
                {...v}
                shop={this.props.id}
                menu={this.state.MENUS.filter(menu => v.item === menu._id)[0]}
                updateCartInfo={this.updateCartInfo}
              />
            ))}

            <View style={{ paddingTop: 35, paddingLeft: 20, paddingRight: 20, paddingBottom: 18 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  paddingBottom: 20,
                  borderBottomColor: "#dee2e6",
                  borderBottomWidth: 1
                }}
              >
                <Text style={{ color: "#212529", fontSize: 18 }}>총 금액</Text>
                <Text style={{ color: "#468ef7", fontSize: 30, fontWeight: "bold" }}>
                  {accounting.formatMoney(this.state.price, { symbol: "원", format: "%v %s", precision: 0 })}
                </Text>
              </View>
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
                  <Text style={{ color: "#212529", fontSize: 18 }}>방문포장</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "#868e96", marginRight: 5, display: this.state.DELIVERY ? "none" : "flex" }}>배달을 하지 않는 가게입니다.</Text>

                    <TouchableWithoutFeedback onPress={this.orderVisit}>
                      <View
                        style={{
                          display: "flex",
                          borderWidth: 1,
                          width: 18,
                          height: 18,
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: this.state.visit ? "#468ef7" : "#dee2e6"
                        }}
                      >
                        <SvgImage
                          source={require("assets/icons/icon-check-select.svg")}
                          style={{ width: 10, height: 10, display: !this.state.visit ? "none" : "flex" }}
                        />
                        <SvgImage
                          source={require("assets/icons/icon-check.svg")}
                          style={{ width: 10, height: 10, display: this.state.visit ? "none" : "flex" }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
                  <Text
                    style={{ color: this.state.visit ? "#adb5bd" : "#212529", fontSize: 18, textDecorationLine: this.state.visit ? "line-through" : "none" }}
                  >
                    주소
                  </Text>
                  <Text
                    style={{ color: this.state.visit ? "#adb5bd" : "#868e96", fontSize: 18, textDecorationLine: this.state.visit ? "line-through" : "none" }}
                  >
                    {this.state.nowAddress}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
                  <Text
                    style={{ color: this.state.visit ? "#adb5bd" : "#212529", fontSize: 18, textDecorationLine: this.state.visit ? "line-through" : "none" }}
                  >
                    상세주소
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      style={{
                        color: this.state.visit ? "#adb5bd" : "#868e96",
                        fontSize: 18,
                        minWidth: 100,
                        textAlign: "right",
                        textDecorationLine: this.state.visit ? "line-through" : "none"
                      }}
                      editable={!this.state.visit}
                      onChangeText={this.onChangeAddress}
                      placeholder="101호"
                      value={this.state.detail_address}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
                  <Text style={{ color: "#212529", fontSize: 18 }}>전화번호</Text>
                  <TextInput
                    style={{ color: "#868e96", fontSize: 18, minWidth: 100, textAlign: "right" }}
                    onChangeText={this.onChangePhone}
                    placeholder="010-1234-5678"
                    value={this.state.PHONE}
                  />
                </View>

                <View style={{ alignItems: "flex-start", marginTop: 10 }}>
                  <Text style={{ color: "#212529", fontSize: 18 }}>요구사항</Text>
                  <TextInput
                    style={{
                      color: "#212529",
                      fontSize: 18,
                      marginTop: 15,
                      width: "100%",
                      borderBottomColor: "#dee2e6",
                      borderBottomWidth: 1,
                      paddingBottom: 5
                    }}
                    placeholder="요구사항을 입력해주세요."
                    onChangeText={this.onChangeRequire}
                    value={this.state.require}
                  />
                </View>

                <TouchableWithoutFeedback onPress={this.doOrder}>
                  <View style={{ backgroundColor: "#468ef7", alignItems: "center", marginTop: 30 }}>
                    <Text style={{ color: "#FFF", paddingTop: 15, paddingBottom: 15, fontSize: 20 }}>주문하기</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.clearCart}>
                  <View style={{ borderColor: "#dee2e6", borderWidth: 1, alignItems: "center", marginTop: 20 }}>
                    <Text style={{ color: "#212529", paddingTop: 15, paddingBottom: 15, fontSize: 20 }}>장바구니 비우기</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LoadingContainer>
    );
  }
}
