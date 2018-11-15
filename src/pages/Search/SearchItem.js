import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image } from "react-native";

import { Rating } from "react-native-elements";
import call from "react-native-phone-call";
import accounting from "accounting-js";

// import DaumMap from "./DaumMap";
// import Swiper from "@/components/lib/Swiper";
import Carousel from "react-native-snap-carousel";

import { ShopApi } from "@/apis";

export default class SearchItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rep_menus: []
    };
  }

  componentWillReceiveProps = nextProps => this.updateShopInfo(this.props._id);
  componentDidMount = () => this.updateShopInfo(this.props._id);
  updateShopInfo = id => ShopApi.getShopMenus({ id: id }).then(res => this.setState({ rep_menus: res.data.shop.shop_menus.filter((v, i) => !!v.REP) || [] }));

  getMenuPrice = menu => {
    const existSale = menu.sales.length !== 0;
    return (
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
        <Text
          style={
            existSale
              ? { fontSize: 14, color: "#868e96", textDecorationLine: "line-through", marginRight: 7, marginTop: 1 }
              : { fontSize: 20, color: "#212529", fontWeight: "bold" }
          }
        >
          {accounting.formatMoney(menu.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
        </Text>
        {existSale ? (
          <Text style={{ fontSize: 20, color: "#212529", fontWeight: "bold" }}>
            {accounting.formatMoney(menu.sales[0].PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
          </Text>
        ) : null}
      </View>
    );
  };

  renderMenuItems = ({ item, index }) => {
    return (
      <View>
        <Image
          style={{ width: "100%", height: 170, borderRadius: 3 }}
          source={{ uri: "https://api.mubabot.com/static/" + (item.URL ? "menu/" + item.URL : "public/img/noimage.png") }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
          <Text style={{ fontSize: 20, color: "#212529" }}>{item.MENUNAME}</Text>
          {this.getMenuPrice(item)}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        <View style={{ paddingLeft: 30, paddingRight: 30, marginTop: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#212529", fontSize: 23, fontWeight: "bold", marginRight: 5 }}>{this.props.SHOPNAME}</Text>
            <Rating startingValue={this.props.POINT} readonly={true} style={{ paddingVertical: 10, marginBottom: 2 }} imageSize={18} />
          </View>

          <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", marginTop: 7 }}>
            <TouchableWithoutFeedback onPress={() => this.props.showShopInfo(this.props._id)}>
              <View style={{ width: "50%", alignItems: "center" }}>
                <Text style={{ color: "#212529", fontSize: 20, paddingTop: 15, paddingBottom: 15 }}>메뉴/정보</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.props.showReview(this.props._id)}>
              <View style={{ width: "50%", alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#dee2e6" }}>
                <Text style={{ color: "#212529", fontSize: 20, paddingTop: 15, paddingBottom: 15 }}>
                  리뷰 ({this.props.reviews ? this.props.reviews.length : 0}개)
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {this.state.rep_menus.length !== 0 ? (
          <View style={{ width: "100%", height: 200, marginTop: 10, marginBottom: 5 }}>
            <Carousel
              data={this.state.rep_menus}
              renderItem={this.renderMenuItems}
              sliderWidth={this.props.deviceWidth}
              itemWidth={this.props.deviceWidth - 60}
            />
          </View>
        ) : null}

        {/* <TouchableWithoutFeedback onPress={() => this.props.showShopMap(this.props.SHOPNAME, this.props.ADDRESS, this.props.ADDRLAT, this.props.ADDRLNG)}>
          <View style={{ backgroundColor: "#000", width: "100%", height: 250, marginTop: 10, marginBottom: 10 }}>
            <DaumMap name={this.props.SHOPNAME} id={this.props._id} address={this.props.ADDRESS} lat={this.props.ADDRLAT} lng={this.props.ADDRLNG} />
          </View>
        </TouchableWithoutFeedback> */}

        <View style={{ paddingLeft: 30, paddingRight: 30 }}>
          <TouchableWithoutFeedback onPress={() => call({ number: this.props.PHONE, prompt: true })}>
            <View style={{ alignItems: "center", backgroundColor: "#468ef7" }}>
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", paddingTop: 15, paddingBottom: 15 }}>전화 주문하기</Text>
            </View>
          </TouchableWithoutFeedback>

          {this.props.length !== this.props.now ? <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: "#dee2e6" }} /> : null}
        </View>
      </View>
    );
  }
}
