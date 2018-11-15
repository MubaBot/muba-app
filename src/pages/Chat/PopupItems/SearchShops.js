import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import { Actions } from "react-native-router-flux";
import { Rating } from "react-native-elements";

import Image from "react-native-remote-svg";

// import DaumMap from "./DaumMap";

import Swiper from "@/components/lib/Swiper";
import { ShopApi } from "@/apis";

export default class SearchShops extends Component {
  state = { lists: [] };

  componentDidMount = () => this.getSearchItems();

  getSearchItems = () =>
    ShopApi.searchShop({ keyword: this.props.search, page: 1, lat: this.props.lat, lng: this.props.lng })
      .then(shops => this.setState({ lists: shops.data.lists }))
      .catch(err => []);

  showShopInfo = async id => Actions.push("shop", { id: id });
  showShopMap = async (name, address, lat, lng) => Actions.push("daumMapShop", { name, address, lat, lng });
  showReview = async id => Actions.push("review", { id: id });

  leftArrow = () => (
    <View style={{ width: 25, height: 25, alignItems: "center", justifyContent: "center" }}>
      <Image source={require("assets/icons/icon-arrow-left.svg")} style={{ width: 10, height: 10 }} />
    </View>
  );

  rightArrow = () => (
    <View style={{ width: 25, height: 25, alignItems: "center", justifyContent: "center" }}>
      <Image source={require("assets/icons/icon-arrow-right.svg")} style={{ width: 10, height: 10 }} />
    </View>
  );

  render() {
    return this.state.lists.length === 0 ? (
      <View />
    ) : (
      <Swiper
        height={110}
        showsButtons={true}
        loop={false}
        showsPagination={false}
        autoplay={false}
        scrollEnabled={true}
        loadMinimal={true}
        index={0}
        prevButton={this.leftArrow()}
        nextButton={this.rightArrow()}
      >
        {this.state.lists.map((v, i) => (
          <View key={v._id} style={{ width: "100%", alignItems: "center", justifyContent: "center", paddingTop: 10 }}>
            <View style={{ width: "70%", backgroundColor: "#FFF" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "#212529", fontSize: 18, fontWeight: "bold" }}>{v.SHOPNAME}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Rating startingValue={v.POINT} readonly={true} style={{ paddingVertical: 10 }} imageSize={14} />
              </View>

              <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", marginTop: 4 }}>
                <TouchableWithoutFeedback onPress={() => this.showShopInfo(v._id)}>
                  <View style={{ width: "50%", alignItems: "center" }}>
                    <Text style={{ color: "#212529", fontSize: 16, paddingTop: 10, paddingBottom: 10 }}>메뉴/정보</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.showReview(v._id)}>
                  <View style={{ width: "50%", alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#dee2e6" }}>
                    <Text style={{ color: "#212529", fontSize: 16, paddingTop: 10, paddingBottom: 10 }}>리뷰 ({v.reviews ? v.reviews.length : 0}개)</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {/* <TouchableWithoutFeedback onPress={() => this.showShopMap(v.SHOPNAME, v.ADDRESS, v.ADDRLAT, v.ADDRLNG)}>
                <View style={{ backgroundColor: "#000", width: "100%", height: 0, marginTop: 7, marginBottom: 10 }}>
                  <DaumMap name={v.SHOPNAME} id={v._id} address={v.ADDRESS} lat={v.ADDRLAT} lng={v.ADDRLNG} />
                </View>
              </TouchableWithoutFeedback> */}

              {/* <TouchableWithoutFeedback onPress={() => call({ number: this.props.PHONE, prompt: true })}>
                <View style={{ alignItems: "center", backgroundColor: "#468ef7" }}>
                  <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", paddingTop: 15, paddingBottom: 15 }}>전화 주문하기</Text>
                </View>
              </TouchableWithoutFeedback> */}

              {/* {this.props.length !== this.props.now ? <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: "#dee2e6" }} /> : null} */}
              {/* <Text>{JSON.stringify(v)}</Text> */}
            </View>
          </View>
        ))}
      </Swiper>
    );
  }
}
