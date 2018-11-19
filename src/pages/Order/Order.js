import React, { Component } from "react";
import { ScrollView, Text } from "react-native";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import OrderItem from "./OrderItem";

import { OrderApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class Order extends Component {
  state = {
    lists: [],
    page: 0,
    loading: true,
    next: true
  };

  componentDidMount = () => this.getOrderList(1);
  componentWillReceiveProps = () => {
    this.setState({ lists: [], page: 0, loading: true, next: true });
    this.getOrderList(1);
  };

  getOrderList = async page => {
    const p = page || this.state.page || 1;
    return OrderApi.getOrderList({ page: p })
      .then(shops =>
        this.setState({
          lists: p === 1 ? shops.data.lists : this.state.lists.concat(shops.data.lists),
          page: p + 1,
          loading: false,
          next: shops.data.lists.length !== 0
        })
      )
      .catch(err => []);
  };

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y) {
      if (!this.state.next) return null;
      this.setState({ loading: true });
      this.getOrderList();
    }
  };

  onScrollEndDrag = ({ contentOffset }) => {
    if (contentOffset.y < -100) {
      this.setState({
        lists: [],
        page: 0,
        loading: true,
        next: true
      });
      this.getOrderList(1);
    }
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <ScrollView
          style={{ marginBottom: 70 }}
          onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}
          onScrollEndDrag={({ nativeEvent }) => this.onScrollEndDrag(nativeEvent)}
        >
          {this.state.lists.map((x, i) => (
            <OrderItem key={x._id} {...x} />
          ))}

          {this.state.lists.length === 0 ? (
            <Text style={{ width: "100%", textAlign: "center", marginTop: 50, fontSize: textResizing(27), color: "#212529" }}>주문 기록이 없습니다.</Text>
          ) : null}
        </ScrollView>
      </LoadingContainer>
    );
  }
}
