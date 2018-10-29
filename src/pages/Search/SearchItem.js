import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import { Rating } from "react-native-elements";
import call from "react-native-phone-call";

import DaumMap from "./DaumMap";

export default class SearchItem extends Component {
  // componentWillReceiveProps = nextProps => {
  //   if (nextProps._id !== this.props._id) this.forceUpdate();
  // };

  render() {
    return (
      <View style={{ paddingLeft: 30, paddingRight: 30, marginTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#212529", fontSize: 23, fontWeight: "bold", marginRight: 5 }}>{this.props.SHOPNAME}</Text>
          <Rating startingValue={3.0} readonly={true} style={{ paddingVertical: 10, marginBottom: 2 }} imageSize={18} />
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6", marginTop: 7 }}>
          <TouchableWithoutFeedback onPress={() => this.props.showShopInfo(this.props._id)}>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text style={{ color: "#212529", fontSize: 20, paddingTop: 15, paddingBottom: 15 }}>메뉴/정보</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={{ width: "50%", alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#dee2e6" }}>
              <Text style={{ color: "#212529", fontSize: 20, paddingTop: 15, paddingBottom: 15 }}>리뷰</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ backgroundColor: "#000", width: "100%", height: 250, marginTop: 10, marginBottom: 10 }}>
          <DaumMap
            name={this.props.SHOPNAME}
            id={this.props._id}
            address={this.props.shop_address.ADDRESS}
            lat={this.props.shop_address.ADDRLAT}
            lng={this.props.shop_address.ADDRLNG}
          />
        </View>

        <TouchableWithoutFeedback onPress={() => call({ number: this.props.PHONE, prompt: true })}>
          <View style={{ alignItems: "center", backgroundColor: "#468ef7" }}>
            <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", paddingTop: 15, paddingBottom: 15 }}>전화 주문하기</Text>
          </View>
        </TouchableWithoutFeedback>

        {this.props.length !== this.props.now ? <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: "#dee2e6" }} /> : null}
      </View>
    );
  }
}
