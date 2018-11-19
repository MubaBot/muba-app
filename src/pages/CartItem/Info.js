import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, StyleSheet, Linking } from "react-native";

import call from "react-native-phone-call";

import CONFIG, { textResizing, marginResizing } from "@/config";

const style = StyleSheet.create({
  view: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center"
  },
  leftText: {
    width: 50,
    fontSize: textResizing(15),
    color: "#212529"
  },
  rightText: {
    fontSize: textResizing(15),
    color: "#868e96"
  }
});

export default class Info extends Component {
  render() {
    return (
      <View>
        <Text style={{ color: "#212529", fontWeight: "bold", fontSize: textResizing(24) }}>{this.props.SHOPNAME}</Text>

        {this.props.ADDRESS ? (
          <View style={[style.view, { marginTop: 20 }]}>
            <Text style={style.leftText}>주소</Text>
            <Text style={style.rightText}>{[this.props.ADDRESS, this.props.ADDRESSDETAIL].join(" ")}</Text>
          </View>
        ) : null}

        {this.props.PHONE ? (
          <View style={[style.view]}>
            <Text style={style.leftText}>전화번호</Text>
            <TouchableWithoutFeedback onPress={() => call({ number: this.props.PHONE, prompt: true })}>
              <View>
                <Text style={style.rightText}>{this.props.PHONE}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}

        {/* {this.props.HOMEPAGE ? (
          <View style={[style.view]}>
            <Text style={style.leftText}>영업시간</Text>
            <Text style={style.rightText}>{this.props.ADDRESS}</Text>
          </View>
        ) : null} */}

        {this.props.HOMEPAGE ? (
          <View style={[style.view]}>
            <Text style={style.leftText}>홈페이지</Text>
            <TouchableWithoutFeedback onPress={() => Linking.openURL(this.props.HOMEPAGE)}>
              <View>
                <Text style={style.rightText}>{this.props.HOMEPAGE}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>
    );
  }
}
