import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import accounting from "accounting-js";
import moment from "moment";

export default class Order extends Component {
  displayAdmission = admission => {
    switch (admission) {
      case true:
        return <Text style={{ fontSize: 18, fontWeight: "bold", color: "#468ef7" }}>승인됨</Text>;
      case false:
        return <Text style={{ fontSize: 18, fontWeight: "bold", color: "#e75d5d" }}>거절됨</Text>;
      case null:
        return <Text style={{ fontSize: 18, fontWeight: "bold", color: "#77dd77" }}>대기중</Text>;
    }
  };

  render() {
    return (
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#dee2e6" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Text style={{ color: "#212529", fontSize: 14 }}>{moment(this.props.createdAt).fromNow()}</Text>
          {this.displayAdmission(this.props.ADMISSION)}
        </View>
        <Text style={{ color: "#212529", fontWeight: "bold", fontSize: 24, marginTop: 5 }}>{this.props.shop.SHOPNAME}</Text>
        <Text style={{ color: "#868e96", fontSize: 16, marginTop: 5 }}>{this.props.ADDRESS}</Text>

        <View
          style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6", borderWidth: 1, borderBottomWidth: 0, padding: 20, paddingBottom: 13, marginTop: 20 }}
        >
          {this.props.order_menus.map((v, i) => (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
              <Text style={{ fontSize: 18, color: "#212529", marginRight: 5 }}>{v.shop_menu.MENUNAME}</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#212529", marginRight: 1 }}>
                {accounting.formatMoney(v.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
              </Text>
              <Text style={{ fontSize: 10, color: "#212529", marginRight: 1 }}>∙</Text>
              <Text style={{ fontSize: 18, color: "#212529" }}>{v.COUNT}개</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#dee2e6" }}>
          <TouchableWithoutFeedback>
            <View style={{ width: "50%", alignItems: "center", borderRightWidth: 1, borderRightColor: "#dee2e6" }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15, color: "#212529" }}>재주문</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15, color: this.props.ADMISSION === null ? "#212529" : "#adb5bd" }}>주문취소</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {/* <Text>{JSON.stringify(this.props)}</Text> */}
      </View>
    );
  }
}
