import React, { Component } from "react";
import { StyleSheet, WebView, View, Alert, TouchableWithoutFeedback, Text, TextInput, KeyboardAvoidingView } from "react-native";

import { Actions } from "react-native-router-flux";
import Image from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";

import { UserApi } from "@/apis";

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default class DaumMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: props.navigation.state.params.lat,
      lng: props.navigation.state.params.lng,
      search: props.navigation.state.params.search || "",
      road_address: "",
      address_name: "",
      detail_address: "",

      latLng: { jb: 0, ib: 0 },
      showKeyboard: false
    };
  }

  keyboardDidShowListener = () => {
    this.setState({ showKeyboard: true });
  };

  onSubmit = () => {
    if (this.state.road_address === "" && this.state.address_name === "") return Alert.alert("", "주소를 선택해 주세요.");

    Alert.alert("", "주소를 선택하시겠습니까?", [
      {
        text: "예",
        onPress: () => {
          UserApi.setAddressForDevice({
            road_address: this.state.road_address,
            address_name: this.state.address_name,
            detail_address: this.state.detail_address,
            lat: this.state.latLng.jb,
            lng: this.state.latLng.ib
          });
          Actions.pop({ success: 0 });
        }
      },
      { text: "아니오", onPress: () => null }
    ]);
  };

  onChangeAddressText = text => {
    this.setState({ detail_address: text });
  };

  onParseAddress = event => {
    const data = JSON.parse(event.nativeEvent.data);
    this.setState(data);

    if (data.success === -1) {
      Alert.alert("다른 검색어를 입력해주세요.");
      Actions.pop({ success: -1 });
    }
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header}>
        <KeyboardAvoidingView behavior="position" enabled>
          <View style={{ height: "65%", marginTop: -10 }}>
            <WebView
              style={styles.webView}
              source={require("assets/html/daum.map.html")}
              injectedJavaScript={require("assets/html/daum.map.html.js")(this.state.lat, this.state.lng, this.state.search)}
              scrollEnabled={false}
              startInLoadingState={true}
              onMessage={this.onParseAddress}
            />
          </View>

          <View style={{ marginTop: 15, marginLeft: 25, marginRight: 25 }}>
            <Text style={{ fontSize: 24 }}>{this.state.address_name || "지번 주소"}</Text>
            <Text style={{ fontSize: 18, marginTop: 5, color: "#969ba7" }}>
              {this.state.road_address ? this.state.road_address.split("구 ")[1] : "도로명 주소"}
            </Text>
            <TextInput
              style={{ borderWidth: 1, marginTop: 15, borderColor: "#d9d9d9", padding: 15, fontSize: 20 }}
              value={this.state.detail_address}
              placeholder="상세주소를 입력하세요."
              onChangeText={this.onChangeAddressText}
            />
            <TouchableWithoutFeedback onPress={this.onSubmit}>
              <View style={{ backgroundColor: "#080808", marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "center", padding: 17 }}>
                <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>완료</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </LoadingContainer>
    );
  }
}
