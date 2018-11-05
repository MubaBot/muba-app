import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, TextInput, Picker, Alert } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";

import { AuthApi, UserApi } from "@/apis";

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showAddress: false,
      picker: null
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.nowAddress !== this.state.address)
      this.setState({
        address: nextProps.nowAddress
      });
  };

  searchAddress = () => {
    if (this.state.search === "") return Alert.alert("주소를 입력해주세요.");
    return Actions.push("daumMapSetting", { lat: this.props.latitude || null, lng: this.props.longitude || null, search: this.state.search });
  };

  onChangeAddressText = text => this.setState({ search: text });
  onChangeAddressPicker = id => this.setState({ picker: id });

  doLogout = async () => {
    AuthApi.doLogout()
      .then(() => Actions.pop())
      .catch(() => null);
  };

  updateAddressByPicker = () => {
    if (this.state.showAddress === true) {
      if (this.state.picker !== null) {
        const address = this.props.user_addresses[this.state.picker];

        UserApi.setAddressForDevice({
          road_address: address.ADDRESS1,
          address_name: "",
          detail_address: address.ADDRESS2,
          lat: address.LAT,
          lng: address.LNG
        });

        this.props.syncNowAddress();
      }

      this.setState({ picker: null });
    }
    this.setState({ showAddress: !this.state.showAddress });
  };

  displayAddress = text => (text.length > 21 ? text.substring(0, 21 - 3) + "..." : text === "" ? "주소를 선택해주세요." : text);

  render() {
    return (
      <View style={{ marginTop: 30, flex: 1 }}>
        <Text style={{ fontSize: 30 }}>
          지번, 도로명, 건물명을 {"\n"}
          입력하세요.
        </Text>

        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 2,
            borderBottomColor: "#212529",
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 5
          }}
        >
          <View style={{ flex: 4 }}>
            <TextInput
              style={{ fontSize: 30 }}
              onChangeText={this.onChangeAddressText}
              value={this.state.search}
              placeholder="역삼동 아남타워"
              onSubmitEditing={this.searchAddress}
            />
          </View>
          <View style={{ flex: 1, marginRight: -45 }}>
            <TouchableWithoutFeedback onPress={this.searchAddress}>
              <View>
                <Image source={require("assets/icons/m-address-search.svg")} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => Actions.push("daumMapSetting", { lat: this.props.latitude || null, lng: this.props.longitude || null })}>
          <View
            style={{
              marginTop: 10,
              padding: 13,
              borderWidth: 1,
              borderColor: "#d9d9d9",
              alignItems: "center",
              flex: 1,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Image source={require("assets/icons/m-address.svg")} />
            <Text style={{ marginLeft: 10, fontSize: 20 }}>현 위치로 주소 설정</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.updateAddressByPicker}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              borderWidth: 1,
              borderColor: "#d9d9d9",
              justifyContent: "space-between",
              marginTop: 10
            }}
          >
            <Text style={{ padding: 15, fontSize: 20 }}>{this.state.showAddress ? "주소 선택" : this.displayAddress(this.props.nowAddress)}</Text>
            <Image style={{ padding: 13, marginRight: 25 }} source={require("assets/icons/m-select.svg")} />
          </View>
        </TouchableWithoutFeedback>

        <View
          style={{
            display: this.state.showAddress ? "flex" : "none",
            overflow: "hidden",
            height: 100,
            justifyContent: "center",
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: "#d9d9d9"
          }}
        >
          <Picker
            selectedValue={this.state.picker}
            itemStyle={{ fontSize: 13 }}
            onValueChange={(itemValue, itemIndex) => this.onChangeAddressPicker(itemValue)}
          >
            <Picker.Item label="선택 안함" value={null} />
            {this.props.user_addresses.map((v, i) => (
              <Picker.Item key={v._id} label={[v.ADDRESS1, v.ADDRESS2].join(" ")} value={i} />
            ))}
          </Picker>
        </View>

        <TouchableWithoutFeedback onPress={this.doLogout}>
          <View style={{ flex: 1, alignSelf: "flex-end", marginTop: 20 }}>
            <Text style={{ marginLeft: 10, fontSize: 20, textDecorationLine: "underline" }}>로그아웃</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
