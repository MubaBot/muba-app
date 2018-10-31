import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

const style = StyleSheet.create({
  view: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center"
  },
  leftText: {
    width: 50,
    fontSize: 15,
    color: "#212529"
  },
  rightText: {
    fontSize: 15,
    color: "#868e96"
  }
});

export default class Info extends Component {
  render() {
    return (
      <View>
        <Text style={{ color: "#212529", fontWeight: "bold", fontSize: 24 }}>{this.props.SHOPNAME}</Text>

        {this.props.ADDRESS ? (
          <View style={[style.view, { marginTop: 20 }]}>
            <Text style={style.leftText}>주소</Text>
            <Text style={style.rightText}>{this.props.ADDRESS}</Text>
          </View>
        ) : null}

        {this.props.PHONE ? (
          <View style={[style.view]}>
            <Text style={style.leftText}>전화번호</Text>
            <Text style={style.rightText}>{this.props.PHONE}</Text>
          </View>
        ) : null}

        {/* {this.props.HOMEPAGE ? (
          <View style={[style.view]}>
            <Text style={style.leftText}>영업시간</Text>
            <Text style={style.rightText}>{this.props.ADDRESS}</Text>
          </View>
        ) : null} */}

        {/* {this.props.HOMEPAGE ? (
          <View style={[style.view]}>
            <Text style={style.leftText}>홈페이지</Text>
            <Text style={style.rightText}>{this.props.HOMEPAGE}</Text>
          </View>
        ) : null} */}
      </View>
    );
  }
}
