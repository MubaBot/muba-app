import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Content } from "native-base";

import Swiper from "@/components/Swiper";

import { Shop, CartApi } from "@/apis";

import ShopInfo from "./ShopInfo";
import Order from "./Order";

export default class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, cart: [], cartLength: 0, MENUS: [], ADDRESS: "", SHOPNAME: "", PHONE: "" };
  }

  scrollToTop = () => this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
  goNext = () => {
    this.updateCartInfo();
    this.swiper.scrollBy(1, true);
    this.scrollToTop();
  };

  goBack = () => {
    this.updateShopInfo();
    this.updateCartInfo();
    this.swiper.scrollBy(-1, true);
    this.scrollToTop();
  };

  updateShopInfo = () =>
    Shop.getShopInfo({ id: this.props.id }).then(res => {
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
      this.props.endLoading();
      this.updateCartInfo();
    });

  updateCartInfo = () => CartApi.getShopCart(this.props.id).then(result => this.setState({ cart: result, cartLength: result.length }));
  // updateCartInfo = () => CartApi.getShopCart(this.props.id).then(result => alert(JSON.stringify(result)));

  render() {
    return (
      <ScrollView ref={r => (this.scrollView = r)} scrollEnabled={false}>
        <Swiper
          ref={r => (this.swiper = r)}
          stlye={{ flex: 1 }}
          scrollEnabled={false}
          showsButtons={false}
          loop={false}
          showsPagination={false}
          autoplay={false}
          index={this.state.index}
        >
          <Content style={{ flex: 1 }}>
            <ShopInfo
              {...this.props}
              SHOPNAME={this.state.SHOPNAME}
              ADDRESS={this.state.ADDRESS}
              MENUS={this.state.MENUS}
              PHONE={this.state.PHONE}
              goNext={this.goNext}
              cart={this.state.cart}
              cartLength={this.state.cartLength}
              updateCartInfo={this.updateCartInfo}
              updateShopInfo={this.updateShopInfo}
            />
          </Content>
          <Content style={{ flex: 1 }}>
            <Order {...this.props} cart={this.state.cart} goBack={this.goBack} updateCartInfo={this.updateCartInfo} />
          </Content>
        </Swiper>
      </ScrollView>
    );
  }
}
