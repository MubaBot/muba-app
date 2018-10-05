import React, { Component } from "react";
import { View, Keyboard, ScrollView, TextInput } from "react-native";
import { Header, Body, Left, Right, Title, Icon, Button, Text, List } from "native-base";

import LoadingContainer from "components/LoadingContainer";
import RouteButton from "components/RouteButton";
import SearchItem from "components/SearchItem";

import { InfoPopup, ReviewPopup, OrderPopup } from "components/PopupComponent";

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
    search: false,
    showInfo: false,
    showReview: false,
    showOrder: false
  };

  getOrderLists = async () => {
    this.setState({ page: this.state.page + 1 });
    return makeMockItems(10);
  };

  appendItem = async items => this.setState({ lists: this.state.lists.concat(items), loading: false });
  showNextPage = async () => {
    if (this.state.loading === false && this.state.search === true) {
      this.setState({ loading: true });
      setTimeout(async () => this.appendItem(await this.getOrderLists()), 500);
    }
  };

  doSearch = async () => {
    this.setState({ lists: makeMockItems(10), search: true });
  };

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    Keyboard.dismiss();
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y && this.state.search === true) {
      this.setState({ loading: true });
      this.showNextPage();
    }
  };

  showShopInfo = async id => {
    this.setState({ showInfo: true, loading: true });
    this.showNextPage();
  };

  showShopReview = async id => {
    this.setState({ showReview: true, loading: true });
    this.showNextPage();
  };

  showShopOrder = async id => {
    this.setState({ showOrder: true, loading: true });
    this.showNextPage();
  };

  closeEvent = () => {
    this.setState({ showInfo: false, showReview: false, showOrder: false });
  };

  render() {
    return (
      <LoadingContainer loading={this.state.loading}>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Search</Title>
          </Body>
          <Right />
        </Header>

        <View style={{ backgroundColor: "white", flex: 1 }}>
          <View>
            <TextInput style={{ borderBottomWidth: 1, padding: 15 }} placeholder="Search" multiline={false} />
            <Button onPress={this.doSearch}>
              <Text>Search</Text>
            </Button>
          </View>
          <ScrollView style={{ backgroundColor: "white" }} onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}>
            <List style={{ display: "flex" }}>
              {this.state.lists.map((x, i) => (
                <SearchItem key={i} {...x} showShopInfo={this.showShopInfo} showShopReview={this.showShopReview} showShopOrder={this.showShopOrder} />
              ))}
            </List>
          </ScrollView>
        </View>

        <InfoPopup hide={!this.state.showInfo} onClose={this.closeEvent} />
        <ReviewPopup hide={!this.state.showReview} onClose={this.closeEvent} />
        <OrderPopup hide={!this.state.showOrder} onClose={this.closeEvent} />
      </LoadingContainer>
    );
  }
}
