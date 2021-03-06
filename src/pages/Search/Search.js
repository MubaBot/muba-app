import React, { Component } from "react";
import { TouchableWithoutFeedback, ScrollView, View, TextInput, Alert, Text, Keyboard, Dimensions } from "react-native";

import Image from "react-native-remote-svg";
import { Actions } from "react-native-router-flux";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import SearchItem from "./SearchItem";

import { UserApi, ShopApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class Search extends Component {
  state = {
    lists: [],
    page: 1,
    loading: false,
    search: false,
    keyword: "",
    searchKeyword: "",

    info: 0,
    lat: 0,
    lng: 0,

    deviceWidth: Dimensions.get("window").width
  };

  componentDidMount = () => this.syncNowAddress();
  componentWillReceiveProps = () => this.syncNowAddress();

  showNextPage = async () => {
    if (this.state.loading === false && this.state.search === true) {
      this.setState({ loading: true });

      this.getKeywordItems({ keyword: this.state.searchKeyword, page: this.state.page });
    }
  };

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

  doSearch = async () => {
    if (this.state.keyword === "") return Alert.alert("", "검색어를 입력해 주세요.");
    this.getKeywordItems({ keyword: this.state.keyword, page: 1 });
    this.setState({ searchKeyword: this.state.keyword, search: true });
  };

  getKeywordItems = async ({ keyword, page }) => {
    const k = keyword || this.state.searchKeyword;
    const p = page || this.state.page || 1;

    Keyboard.dismiss();

    return ShopApi.searchShop({ keyword: k, page: page || this.state.page, lat: this.state.lat, lng: this.state.lng })
      .then(shops =>
        this.setState({
          lists: p === 1 ? shops.data.lists : this.state.lists.concat(shops.data.lists),
          page: p + 1,
          search: shops.data.lists.length === 0 ? false : true,
          loading: false
          // test: alert(JSON.stringify(shops.data.lists))
        })
      )
      .catch(err => []);
  };

  showShopInfo = async id => Actions.push("shop", { id: id });
  showReview = async id => Actions.push("review", { id: id });

  showShopMap = async (name, address, lat, lng) => Actions.push("daumMapShop", { name, address, lat, lng });

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    Keyboard.dismiss();
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y + 1 && this.state.search === true) {
      this.showNextPage();
    }
  };

  onChangeSearchText = text => this.setState({ keyword: text });

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <ScrollView onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)} style={{ marginBottom: 70 }}>
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#212529",
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 30,
              marginLeft: 30,
              marginRight: 30
            }}
          >
            <View style={{ flex: 4 }}>
              <TextInput
                underlineColorAndroid="transparent"
                style={{ fontSize: textResizing(30), padding: 0 }}
                onChangeText={this.onChangeSearchText}
                value={this.state.keyword}
                placeholder="상점 이름을 입력하세요"
                onSubmitEditing={this.doSearch}
              />
            </View>
            <View style={{ flex: 1, marginRight: -45, marginTop: 3 }}>
              <TouchableWithoutFeedback onPress={this.doSearch}>
                <View>
                  <Image source={require("assets/icons/m-address-search.svg")} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          {this.state.lists.map((v, i) => (
            // <Text>{JSON.stringify(v)}</Text>
            <SearchItem
              key={v._id}
              length={this.state.lists.length}
              now={i + 1}
              {...v}
              showShopInfo={this.showShopInfo}
              showReview={this.showReview}
              showShopMap={this.showShopMap}
              deviceWidth={this.state.deviceWidth}
            />
          ))}
        </ScrollView>
      </LoadingContainer>
    );
  }
}
