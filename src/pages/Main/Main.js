import React, { Component } from "react";
import { View, ScrollView, Text, TouchableWithoutFeedback } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

import MainItem from "./MainItem";

import { UserApi, ShopApi } from "@/apis";

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
    this.syncNowAddress().then(address => {
      this.updateSaleShopList(address.lat, address.lng, 1, 0).then(() => this.setState({ page: 2 }));
    });

  syncNowAddress = async () =>
    UserApi.getAddressForDevice().then(address => {
      if (!address) return null;

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
      .then(shops => this.setState({ loading: false, lists: p === 1 ? shops.data.lists : this.state.lists.concat(shops.data.lists) }))
      .catch(err => []);
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} loading={this.state.loading}>
        <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", marginTop: 25, marginBottom: 30 }}>
          <Text style={{ color: "#4f596f", fontSize: 22, marginRight: 3, fontWeight: "bold" }}>{this.state.location}</Text>

          <TouchableWithoutFeedback onPress={() => Actions.push("settings")}>
            <View>
              <Image source={require("assets/icons/m-setting.svg")} style={{ width: 20, height: 20 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <ScrollView style={{ paddingLeft: 10 }}>
          {this.state.lists.map((v, i) => (
            <MainItem key={i} {...v} />
          ))}
          {this.state.lists.length === 0 ? <Text>품목이 없습니다.</Text> : null}
        </ScrollView>
      </LoadingContainer>
    );
  }
}
