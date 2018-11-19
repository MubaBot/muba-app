import React, { Component } from "react";
import { View, ScrollView, Text, TouchableWithoutFeedback, Alert } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

import MainItem from "./MainItem";

import { AuthApi, UserApi, ShopApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class Main extends Component {
  state = {
    location: "",
    lat: 0,
    lng: 0,
    loading: true,
    lists: []
  };

  componentDidMount = () => this.reloadSaleShopList();
  componentWillReceiveProps = nextProps => this.reloadSaleShopList();

  reloadSaleShopList = () =>
    AuthApi.isLogged().then(isLogin =>
      isLogin === true ? this.syncNowAddress().then(address => this.updateSaleShopList(address.lat, address.lng, 1, 0)) : null
    );

  syncNowAddress = async () =>
    UserApi.getAddressForDevice().then(address => {
      if (!address) {
        Alert.alert("주소를 선택해주세요.");
        return Actions.push("settings");
      }

      const addr = address.road_address !== "" ? address.road_address : address.address_name;

      const state = {
        location: addr
          .split(" ")
          .filter((v, i) => !(i === 0 || i === 1))
          .join(" "),
        lat: address.lat,
        lng: address.lng
      };

      this.setState(state);
      return state;
    });

  updateSaleShopList = async (lat, lng, page, time) => {
    const p = page || this.state.page || 1;
    return ShopApi.searchSaleShopList({
      lat: lat || this.state.lat,
      lng: lng || this.state.lng,
      page: p,
      time: time || this.state.time || 0
    })
      .then(shops => {
        let lists = [];
        for (var i in shops.data.lists) {
          const items = shops.data.lists[i];
          for (var j in items.shop_menus) {
            lists.push({ ...items.shop_menus[j], SHOPNAME: items.SHOPNAME });
          }
        }

        this.setState({ loading: false, lists: p === 1 ? lists : this.state.lists.concat(lists), page: p + 1 });
      })
      .catch(err => []);
  };

  getNextSaleShopList = async () => this.updateSaleShopList(this.state.lat.lat, this.state.lng, this.state.page, 0);

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y) {
      if (!this.state.next) return null;
      this.setState({ loading: true });
      this.getOrderList();
    }
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={null} loading={this.state.loading}>
        <View
          style={{
            height: 50,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#e9ecef"
          }}
        >
          <Image source={require("assets/logo.svg")} style={{ marginLeft: 10, height: 25 }} />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginRight: 20 }}>
            <Text style={{ color: "#212529", fontSize: textResizing(22), marginRight: 7 }}>{this.state.location || "장소를 선택해 주세요."}</Text>

            <TouchableWithoutFeedback onPress={() => Actions.push("settings")}>
              <View>
                <Image source={require("assets/icons/m-setting.svg")} style={{ width: 20, height: 20 }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <ScrollView
          style={{ paddingLeft: 20, marginRight: 20, paddingBottom: 10, marginBottom: 70 }}
          onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
            <Text style={{ color: "#212529", fontSize: textResizing(25), fontWeight: "bold" }}>땡처리 메뉴 추천</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}>
            {this.state.lists.map((v, i) => (
              <MainItem key={v._id} position={i} {...v} />
            ))}
          </View>

          {this.state.lists.length === 0 ? <Text>품목이 없습니다.</Text> : null}
        </ScrollView>
      </LoadingContainer>
    );
  }
}
