import React, { Component } from "react";
import { TouchableWithoutFeedback, View, ScrollView, Text } from "react-native";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import CartItem from "./CartItem";

import { CartApi } from "@/apis";

export default class Cart extends Component {
  state = {
    lists: [],
    loading: true
  };

  componentDidMount = () => this.getCartListItems();
  componentWillReceiveProps = () => this.getCartListItems();

  listCompare = (a, b) => {
    if (a.time < b.time) return 1;
    if (a.time > b.time) return -1;
    return 0;
  };

  getCartListItems = async () => {
    const carts = await CartApi.getAllCart();

    let lists = [];
    for (var i in carts) lists.push({ shop: i, cart: carts[i].cart, time: carts[i].time });

    lists.sort(this.listCompare);

    this.setState({ lists: lists.filter(v => (v.cart ? v.cart.length !== 0 : false)), loading: false });
  };

  onScrollEndDrag = ({ contentOffset }) => {
    if (contentOffset.y < -100) {
      this.setState({
        lists: [],
        page: 0,
        loading: true,
        next: true
      });
      this.getCartListItems();
    }
  };

  removeAllCart = () => {
    CartApi.resetCart().then(() => this.getCartListItems());
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <ScrollView style={{ marginBottom: 70 }} onScrollEndDrag={({ nativeEvent }) => this.onScrollEndDrag(nativeEvent)}>
          {this.state.lists.map((v, i) => (
            <CartItem key={v.shop} end={this.state.lists.length === i + 1} cart={v.cart} {...v} />
          ))}

          {this.state.lists.length === 0 ? (
            <Text style={{ width: "100%", textAlign: "center", marginTop: 50, fontSize: 27, color: "#212529" }}>장바구니가 비었습니다.</Text>
          ) : (
            <TouchableWithoutFeedback onPress={this.removeAllCart}>
              <View>
                <Text style={{ width: "100%", marginBottom: 30, textAlign: "center", marginTop: 50, fontSize: 27, color: "#212529" }}>
                  장바구니 전체 비우기
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
      </LoadingContainer>
    );
  }
}
