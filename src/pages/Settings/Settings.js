import React, { Component } from "react";
import { View, ScrollView, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Text } from "react-native";
import { Actions } from "react-native-router-flux";

import moment from "moment";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import Location from "./Location";
import Profile from "./Profile";

import { UserApi } from "@/apis";

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.50374576425619,
      longitude: 127.04485358330714,
      inputProfile: false,
      PHONE: "",
      GENDER: null,
      BIRTH: "",
      nowAddress: ""
    };
  }

  componentWillReceiveProps = nextProps => this.syncNowAddress();

  componentDidMount = () => {
    this.onSetLocation();
    this.syncNowAddress();
    this.getUserInfo();
  };

  syncNowAddress = () =>
    UserApi.getAddressForDevice().then(address => {
      if (!address) return null;

      const addr =
        address.road_address !== "" ? [address.road_address, address.detail_address].join(" ") : [address.address_name, address.detail_address].join(" ");

      this.setState({ nowAddress: addr });
    });

  onSetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position =>
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        }),
      error => this.setState({ error: error.message })
    );
  };

  getUserInfo = () => UserApi.getUserInfoByServer().then(result => this.setState(result.data.user));

  focusKeyboard = (panel, mode) => {
    const enable = mode === "in" ? true : false;

    switch (panel) {
      case "profile":
        this.setState({ inputProfile: enable });
    }
  };

  setPhone = text => this.setState({ PHONE: text });
  setGender = value => this.setState({ GENDER: value });
  setBirth = (year, month, day) => this.setState({ BIRTH: moment({ year, month: month - 1, day }).format("YYYYMMDD") });

  doExit = () => {
    if (this.state.PHONE !== "" && !/^\d{3}-\d{3,4}-\d{4}$/.test(this.state.PHONE)) return Alert.alert("올바른 전화번호를 입력해 주세요.");

    // update user info
    return UserApi.updateUserInfo({ phone: this.state.PHONE, gender: this.state.GENDER, birth: this.state.BIRTH })
      .then(() => Actions.pop())
      .catch(err => alert(err));
  };

  render() {
    const date = this.state.BIRTH ? String(this.state.BIRTH) : moment().format("YYYYMMDD");

    const year = parseInt(moment(date).format("YYYY"));
    const month = parseInt(moment(date).format("MM"));
    const day = parseInt(moment(date).format("DD"));

    return (
      <LoadingContainer requireAuth={true} header={Header}>
        <KeyboardAvoidingView behavior="position" enabled={this.state.inputProfile}>
          <ScrollView>
            <View style={{ paddingTop: 10, paddingLeft: 30, paddingRight: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#dadada" }}>
              <Location syncAddress={this.syncNowAddress} nowAddress={this.state.nowAddress} latitude={this.state.latitude} longitude={this.state.longitude} />
            </View>

            <View
              style={{
                paddingTop: 30,
                paddingLeft: 30,
                paddingRight: 30,
                paddingBottom: 30,
                borderTopWidth: 15,
                backgroundColor: "#FFF",
                borderTopColor: "#ebebeb"
              }}
            >
              <Profile
                focusKeyboard={this.focusKeyboard}
                phone={this.state.PHONE}
                setPhone={this.setPhone}
                inputProfile={this.state.inputProfile}
                gender={this.state.GENDER}
                setGender={this.setGender}
                year={year}
                month={month}
                day={day}
                setBirth={this.setBirth}
              />
            </View>

            <TouchableWithoutFeedback onPress={() => this.doExit()}>
              <View style={{ width: "100%", marginBottom: 30, paddingLeft: 30, paddingRight: 30 }}>
                <Text
                  style={{
                    backgroundColor: "#468ef7",
                    color: "#FFF",
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingTop: 15,
                    paddingBottom: 15,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  완료
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </LoadingContainer>
    );
  }
}
