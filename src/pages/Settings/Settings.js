import React, { Component } from "react";
import { TouchableWithoutFeedback, View, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

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
      phone: "",
      nowAddress: ""
    };
  }

  componentWillReceiveProps = nextProps => this.syncNowAddress();

  componentDidMount = () => {
    this.syncNowAddress();
    this.onSetLocation();
    // this.getUserInfo();
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
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  // getUserInfo = () => UserApi.getUserInfoByServer().then(result => this.setState(result.data.user));

  focusKeyboard = (panel, mode) => {
    const enable = mode === "in" ? true : false;

    switch (panel) {
      case "profile":
        this.setState({ inputProfile: enable });
    }
  };

  setPhone = text => this.setState({ phone: text });

  doExit = () => {
    if (this.state.phone !== "" && !/^\d{3}-\d{3,4}-\d{4}$/.test(this.state.phone)) return Alert.alert("올바른 전화번호를 입력해 주세요.");

    // update user info
    return UserApi.updateUserInfo({ phone: this.state.phone })
      .then(() => Actions.pop())
      .catch(err => alert(err));
  };

  render() {
    return (
      <LoadingContainer requireAuth={true}>
        <KeyboardAvoidingView behavior="position" enabled={this.state.inputProfile}>
          <ScrollView>
            <View style={{ paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#dadada" }}>
              <TouchableWithoutFeedback onPress={this.doExit}>
                <View>
                  <Image source={require("assets/icons/m-close.svg")} style={{ width: 20, height: 20 }} />
                </View>
              </TouchableWithoutFeedback>

              <Location syncAddress={this.syncNowAddress} nowAddress={this.state.nowAddress} latitude={this.state.latitude} longitude={this.state.longitude} />
            </View>

            <View
              style={{
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 30,
                borderTopWidth: 15,
                backgroundColor: "#FFF",
                borderTopColor: "#ebebeb"
              }}
            >
              <Profile focusKeyboard={this.focusKeyboard} phone={this.state.phone} setPhone={this.setPhone} inputProfile={this.state.inputProfile} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LoadingContainer>
    );
  }
}
