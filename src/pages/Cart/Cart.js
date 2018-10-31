import React, { Component } from "react";
import { ScrollView, Text } from "react-native";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import CartItem from "./CartItem";

import { CartApi } from "@/apis";

export default class Cart extends Component {
  state = {
    lists: [],
    loading: false
  };

  componentDidMount = () => this.getCartListItems();
  componentWillReceiveProps = () => this.getCartListItems();

  getCartListItems = async () => {
    const carts = await CartApi.getAllCart();

    let lists = [];
    for (var i in carts) lists.push({ shop: i, cart: carts[i] });

    this.setState({ lists: lists.filter(v => v.cart.length !== 0) });
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <ScrollView style={{ marginBottom: 70 }}>
          {this.state.lists.map((v, i) => (
            <CartItem key={v._id} end={this.state.lists.length === i + 1} {...v} />
          ))}

          {this.state.lists.length === 0 ? (
            <Text style={{ width: "100%", textAlign: "center", marginTop: 50, fontSize: 27, color: "#212529" }}>장바구니가 비었습니다.</Text>
          ) : null}
        </ScrollView>
      </LoadingContainer>
    );
  }
}
