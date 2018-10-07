import React, { Component } from "react";
import { Keyboard, View, ScrollView, Dimensions } from "react-native";
import { Content, List, Button, Text } from "native-base";

import Swiper from "@/components/Swiper";

import SearchItem from "@/components/SearchItem";
import Info from "@/components/Info";
import Review from "@/components/Review";
import Order from "@/components/Order";
import DaumMap from "@/components/DaumMap";

function makeMockItems(num) {
  var items = [];
  for (var i = 0; i < num; i++) {
    items = items.concat({ id: i });
  }

  return items;
}
export default class Search extends Component {
  state = {
    lists: [],
    page: 1,
    loading: false,
    scrollEnabled: true
  };

  getOrderLists = async () => {
    this.setState({ page: this.state.page + 1 });
    return makeMockItems(10);
  };

  appendItem = async items => this.setState({ lists: this.state.lists.concat(items), loading: false });
  showNextPage = async () => {
    if (this.state.loading === false) {
      this.setState({ loading: true });
      setTimeout(async () => this.appendItem(await this.getOrderLists()), 500);
    }
  };

  componentDidMount = () => this.setState({ lists: makeMockItems(10) });

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    Keyboard.dismiss();
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y) {
      this.setState({ loading: true });
      // this.showNextPage();
    }
  };

  showShopInfo = async id => {
    this.setState({ page: 1 });
    this.swiper.scrollBy(1, true);
    // this.scrollToTop();
  };

  showShopReview = async id => {
    this.setState({ page: 2 });
    this.swiper.scrollBy(1, true);
    // this.scrollToTop();
  };

  showShopOrder = async id => {
    this.setState({ page: 3 });
    this.swiper.scrollBy(1, true);
    // this.scrollToTop();
  };

  showMap = async id => {
    this.setState({ page: 4 });
    this.swiper.scrollBy(1, true);
    // this.scrollToTop();
  };

  goBack = async id => {
    this.swiper.scrollBy(-1, true);
    // this.scrollToTop();
  };

  setComponent = page => {
    switch (page) {
      case 1:
        return <Info />;
      case 2:
        return <Review />;
      case 3:
        return <Order />;
      case 4:
        return (
          <View style={{ height: Dimensions.get("window").height * 0.7 - 50 }}>
            <DaumMap />
          </View>
        );
    }
  };

  onPressMapBegin = () => this.setState({ scrollEnabled: false });
  onPressMapEnd = () => this.setState({ scrollEnabled: true });

  renderGoBack = () => {
    if (this.props.skip === true) return null;
    return (
      <Button onPress={this.props.goBack}>
        <Text>뒤로가기</Text>
      </Button>
    );
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: "white" }} scrollEnabled={this.state.scrollEnabled} onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}>
        <Swiper ref={r => (this.swiper = r)} scrollEnabled={false} showsButtons={false} scrollsToTop={true} loop={false} showsPagination={false} autoplay={false} index={this.state.index}>
          <Content>
            {this.renderGoBack()}
            <List>
              {this.state.lists.map((x, i) => (
                <SearchItem key={i} {...x} showShopInfo={this.showShopInfo} showShopReview={this.showShopReview} showShopOrder={this.showShopOrder} onPressMap={this.showMap} />
              ))}
            </List>
          </Content>
          <Content>
            <Button onPress={this.goBack}>
              <Text>뒤로가기</Text>
            </Button>
            {this.setComponent(this.state.page)}
          </Content>
        </Swiper>
      </ScrollView>
    );
  }
}
