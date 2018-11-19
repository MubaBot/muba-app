import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Dimensions, Image } from "react-native";

import { Actions } from "react-native-router-flux";
import { Rating } from "react-native-elements";
import Svg from "react-native-remote-svg";
import Carousel from "react-native-snap-carousel";

import { ShopApi } from "@/apis";

const deviceWidth = Dimensions.get("window").width;
const itemHeight = 115;

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class SearchShopRandom extends Component {
  state = { lists: [] };

  componentDidMount = () => this.getSearchItems();

  getSearchItems = () =>
    ShopApi.searchShopRandom({ page: 1, lat: this.props.lat, lng: this.props.lng })
      .then(lists => this.setState({ lists: lists }))
      .catch(err => []);

  showReview = async id => Actions.push("review", { id: id });

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

  renderMenuItems = ({ item, index }) => {
    return (
      <View style={{ height: itemHeight, backgroundColor: "#FFF", borderRadius: 7, marginVertical: 10, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#212529", fontSize: textResizing(18), fontWeight: "bold" }}>{item.SHOPNAME}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Rating startingValue={item.POINT} readonly={true} style={{ paddingVertical: 10 }} imageSize={14} />
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", marginTop: 4 }}>
          <TouchableWithoutFeedback onPress={() => (this.refs.swiper.currentIndex === index ? this.props.showShopMenus(item._id, item.SHOPNAME) : null)}>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text style={{ color: "#212529", fontSize: textResizing(16), paddingTop: 10, paddingBottom: 10 }}>메뉴</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => (this.refs.swiper.currentIndex === index ? this.showReview(item._id) : null)}>
            <View style={{ width: "50%", alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#dee2e6" }}>
              <Text style={{ color: "#212529", fontSize: textResizing(16), paddingTop: 10, paddingBottom: 10 }}>
                리뷰 ({item.reviews ? item.reviews.length : 0}개)
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  render() {
    return this.state.lists.length === 0 ? (
      <View />
    ) : (
      <View>
        {this.leftArrow()}
        <Carousel ref="swiper" data={this.state.lists} renderItem={this.renderMenuItems} sliderWidth={deviceWidth} itemWidth={180} />
        {this.rightArrow()}
      </View>
    );
  }
}
