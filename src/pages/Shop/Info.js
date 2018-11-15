import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, StyleSheet, Linking } from "react-native";

import { Actions } from "react-native-router-flux";
import { Rating } from "react-native-elements";
import call from "react-native-phone-call";

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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            {this.props.POINT !== null ? (
              <Rating startingValue={this.props.POINT} readonly={true} style={{ paddingVertical: 10, marginBottom: 2 }} imageSize={18} />
            ) : null}
            <Text style={{ marginBottom: 13, marginLeft: 4 }}>({this.props.reviews.length}개)</Text>
          </View>

          <TouchableWithoutFeedback onPress={() => Actions.push("review", { id: this.props._id })}>
            <View>
              <Text style={{ color: "#468ef7", fontWeight: "bold", fontSize: 20 }}>리뷰</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

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
