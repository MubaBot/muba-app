import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Dimensions, Image } from "react-native";

import Svg from "react-native-remote-svg";
import Carousel from "react-native-snap-carousel";
import accounting from "accounting-js";

import { ShopApi, CartApi } from "@/apis";

const deviceWidth = Dimensions.get("window").width;
const itemHeight = 250;

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class ShowShopMenu extends Component {
  state = { lists: [] };

  componentDidMount = () => this.getShopMenus();

  addCart = menu =>
    CartApi.addShopCart(this.props.data.ID, menu).then(() => {
      this.props.toast.show("장바구니에 추가하였습니다.");
    });

  getShopMenus = () =>
    ShopApi.searchFoodRandom({ page: 1, lat: this.props.lat, lng: this.props.lng })
      .then(res => this.setState({ lists: res.data.shop.shop_menus }))
      .catch(err => []);

  leftArrow = () => (
    <View style={{ position: "absolute", zIndex: 999, left: 10, height: itemHeight, alignItems: "center", justifyContent: "center" }}>
      <TouchableWithoutFeedback onPress={() => this.refs.swiper.snapToPrev()}>
        <View style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center" }}>
          <Svg source={require("assets/icons/icon-arrow-left.svg")} style={{ width: 10, height: 10 }} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  rightArrow = () => (
    <View style={{ position: "absolute", zIndex: 999, right: 10, height: itemHeight, alignItems: "center", justifyContent: "center" }}>
      <TouchableWithoutFeedback onPress={() => this.refs.swiper.snapToNext()}>
        <View style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center" }}>
          <Svg source={require("assets/icons/icon-arrow-right.svg")} style={{ width: 10, height: 10 }} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  getMenuPrice = menu => {
    const existSale = menu.sales.length !== 0;
    return (
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
        <Text
          style={
            existSale
              ? { fontSize: textResizing(14), color: "#868e96", textDecorationLine: "line-through", marginRight: 7, marginTop: 1 }
              : { fontSize: textResizing(20), color: "#212529", fontWeight: "bold" }
          }
        >
          {accounting.formatMoney(menu.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
        </Text>
        {existSale ? (
          <Text style={{ fontSize: textResizing(20), color: "#212529", fontWeight: "bold" }}>
            {accounting.formatMoney(menu.sales[0].PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
          </Text>
        ) : null}
      </View>
    );
  };

  renderMenuItems = ({ item, index }) => {
    return (
      <View style={{ height: itemHeight, backgroundColor: "#FFF", borderRadius: 7, marginVertical: 10, padding: 10 }}>
        {item.sales.length !== 0 ? (
          <View
            style={{
              position: "absolute",
              right: 15,
              backgroundColor: "rgba(33,35,41,0.5)",
              opacity: 0.5,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
              top: 150,
              zIndex: 888
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: textResizing(14) }}>{item.sales[0].COUNT}개 남음</Text>
          </View>
        ) : null}
        <Image
          style={{ width: "100%", height: 165, borderRadius: 3 }}
          source={{ uri: "https://api.mubabot.com/static/" + (item.URL ? "menu/" + item.URL : "public/img/noimage.png") }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, height: 20 }}>
          <Text style={{ fontSize: textResizing(20), color: "#212529" }}>{item.MENUNAME}</Text>
          {this.getMenuPrice(item)}
        </View>

        <TouchableWithoutFeedback onPress={() => (this.refs.swiper.currentIndex === index ? this.props.showShopInfo(item.SHOPID) : null)}>
          <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 5, height: 30 }}>
            <Text style={{ fontSize: textResizing(20), fontWeight: "bold", color: "#468ef7" }}>가게보기</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    return this.state.lists.length === 0 ? (
      <View />
    ) : (
      <View>
        {this.leftArrow()}
        <Carousel ref="swiper" data={this.state.lists} renderItem={this.renderMenuItems} sliderWidth={deviceWidth} itemWidth={240} />
        {this.rightArrow()}
      </View>
    );
  }
}
