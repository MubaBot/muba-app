import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image } from "react-native";

import accounting from "accounting-js";

export default class Menus extends Component {
  render() {
    return (
      <View>
        <View
          style={[
            { flexDirection: "row", marginBottom: 20, paddingBottom: 20 },
            !this.props.endItem ? { borderBottomWidth: 1, borderBottomColor: "#dee2e6" } : {}
          ]}
        >
          <Image
            style={{ width: 70, height: 70, borderRadius: 3 }}
            source={{ uri: "https://api.mubabot.com/static/" + (this.props.URL ? "menu/" + this.props.URL : "public/img/noimage.png") }}
          />

          <View style={{ marginLeft: 20 }}>
            <Text style={{ color: "#212529", fontSize: 20, lineHeight: 35 }}>{this.props.MENUNAME}</Text>
            <View style={[{ flexDirection: "row", alignItems: "center" }, this.props.sales[0] ? {} : { marginTop: 10 }]}>
              <Text
                style={[
                  { fontSize: 16 },
                  this.props.sales[0] ? { color: "#868e96", textDecorationLine: "line-through" } : { color: "#212529", fontWeight: "bold" }
                ]}
              >
                {accounting.formatMoney(this.props.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
              </Text>
              {this.props.sales[0] ? (
                <Text style={{ fontSize: 16, color: "#212529", fontWeight: "bold", marginLeft: 5, marginRight: 5 }}>
                  {accounting.formatMoney(this.props.sales[0].PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
                </Text>
              ) : null}
            </View>
            {this.props.sales[0] ? <Text style={{ fontSize: 16, color: "#212529" }}>({this.props.sales[0].COUNT}개 남음)</Text> : null}
          </View>

          <View style={{ position: "absolute", right: 0 }}>
            <TouchableWithoutFeedback onPress={() => (this.props.SOLD ? null : this.props.addCart(this.props._id))}>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 22, textAlign: "center", color: this.props.SOLD ? "#adb5bd" : "#468ef7" }}>
                  {this.props.SOLD ? "품절" : "추가"}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}
