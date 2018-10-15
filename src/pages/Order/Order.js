import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Header, Body, Left, Right, Title, Icon, Label, List } from "native-base";

import LoadingContainer from "@/components/LoadingContainer";
import RouteButton from "@/components/RouteButton";
import { OrderPopup } from "@/components/PopupComponent";

import OrderItem from "./OrderItem";

import { OrderApi } from "@/apis";

export default class Order extends Component {
  state = {
    lists: [],
    page: 0,
    loading: false,
    showOrder: false
  };

  getOrderLists = async () => {
    this.setState({ page: this.state.page + 1 });
    return this.getOrderList();
  };

  getOrderList = async page => {
    return OrderApi.getOrderList({ page: this.state.page })
      .then(shops => shops.data.lists)
      .catch(err => []);
  };

  appendItem = async items => this.setState({ lists: this.state.lists.concat(items), loading: false });
  showNextPage = async () => {
    if (this.state.loading === false) {
      this.setState({ loading: true });
      setTimeout(async () => this.appendItem(await this.getOrderLists()), 500);
    }
  };

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y) {
      this.setState({ loading: true });
      this.showNextPage();
    }
  };

  showShopOrder = async id => {
    this.setState({ showOrder: true, loading: true });
    this.showNextPage();
  };

  closeEvent = () => {
    this.setState({ showOrder: false });
  };

  componentDidMount = () => this.showNextPage();

  render() {
    return (
      <LoadingContainer requireAuth={true} loading={this.state.loading}>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Order</Title>
          </Body>
          <Right />
        </Header>

        <ScrollView style={{ backgroundColor: "white" }} onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}>
          <Label>주문 목록</Label>
          <List>
            {this.state.lists.map((x, i) => (
              <OrderItem key={i} {...x} showShopOrder={this.showShopOrder} />
            ))}
          </List>
        </ScrollView>

        <OrderPopup hide={!this.state.showOrder} onClose={this.closeEvent} />
      </LoadingContainer>
    );
  }
}
