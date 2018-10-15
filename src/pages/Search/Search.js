import React, { Component } from "react";
import { View, Keyboard, ScrollView, TextInput, Alert } from "react-native";
import { Header, Body, Left, Right, Title, Icon, Button, Text, List } from "native-base";

import LoadingContainer from "@/components/LoadingContainer";
import RouteButton from "@/components/RouteButton";
import SearchItem from "@/components/SearchItem";

import { InfoPopup, ReviewPopup, OrderPopup, DaumMapPopup } from "@/components/PopupComponent";
import { Shop } from "@/apis";

export default class Search extends Component {
  state = {
    lists: [],
    page: 1,
    loading: false,
    scrollEnabled: true,
    search: false,
    showInfo: false,
    showReview: false,
    showOrder: false,
    showMap: false,
    keyword: "",
    searchKeyword: "",

    info: 0
  };

  getOrderLists = async () => {
    this.setState({ page: this.state.page + 1 });
    return await this.getKeywordItems();
  };

  appendItem = async items => this.setState({ lists: this.state.lists.concat(items), loading: false });
  showNextPage = async () => {
    if (this.state.loading === false && this.state.search === true) {
      this.setState({ loading: true });
      setTimeout(async () => this.appendItem(await this.getOrderLists()), 500);
    }
  };

  doSearch = async () => {
    if (this.state.keyword === "") return Alert.alert("", "검색어를 입력해 주세요.");
    this.setState({ searchKeyword: this.state.keyword, loading: true, search: true, page: 1 });
    Keyboard.dismiss();
    this.setState({ lists: await this.getKeywordItems(1), loading: false });
  };

  getKeywordItems = async page => {
    return Shop.searchShop({ keyword: this.state.keyword, page: page || this.state.page })
      .then(shops => shops.data.lists)
      .catch(err => []);
  };

  endLoading = () => this.setState({ loading: false });

  showShopInfo = async id => this.setState({ info: id, showInfo: true, loading: true });
  showShopReview = async id => this.setState({ showReview: true });
  showShopOrder = async id => this.setState({ showOrder: true });
  showMap = async id => this.setState({ showMap: true });

  closeEvent = () => {
    this.setState({ showInfo: false, showReview: false, showOrder: false, showMap: false });
  };

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    Keyboard.dismiss();
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y + 1 && this.state.search === true) {
      this.setState({ loading: true });
      this.showNextPage();
    }
  };

  onPressMapBegin = () => this.setState({ scrollEnabled: false });
  onPressMapEnd = () => this.setState({ scrollEnabled: true });
  onChangeAddressText = text => this.setState({ keyword: text });

  render() {
    return (
      <LoadingContainer requireAuth loading={this.state.loading}>
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
            <TextInput
              style={{ borderBottomWidth: 1, padding: 15 }}
              placeholder="Search"
              multiline={false}
              onChangeText={text => this.onChangeAddressText(text)}
            />
            <Button onPress={this.doSearch}>
              <Text>Search</Text>
            </Button>
          </View>
          <ScrollView scrollEnabled={this.state.scrollEnabled} style={{ backgroundColor: "white" }} onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}>
            <List style={{ display: "flex" }}>
              {this.state.lists.map((x, i) => (
                <SearchItem
                  key={i}
                  {...x}
                  showShopInfo={this.showShopInfo}
                  showShopReview={this.showShopReview}
                  showShopOrder={this.showShopOrder}
                  onPressMapBegin={this.onPressMapBegin}
                  onPressMap={this.showMap}
                  onPressMapEnd={this.onPressMapEnd}
                />
              ))}
            </List>
          </ScrollView>
        </View>

        <InfoPopup id={this.state.info} hide={!this.state.showInfo} onClose={this.closeEvent} endLoading={this.endLoading} />
        <ReviewPopup hide={!this.state.showReview} onClose={this.closeEvent} />
        <OrderPopup hide={!this.state.showOrder} onClose={this.closeEvent} />
        {/* <DaumMapPopup hide={!this.state.showMap} onClose={this.closeEvent} /> */}
      </LoadingContainer>
    );
  }
}
