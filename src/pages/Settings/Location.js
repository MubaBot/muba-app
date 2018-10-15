import React, { Component } from "react";
import { View } from "react-native";
import { Label, Input } from "native-base";
import { debounce } from "debounce";

import RouteButton from "@/components/RouteButton";

import { User } from "@/apis";

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.50374576425619,
      longitude: 127.04485358330714,
      location: "",
      detail: ""
    };
  }

  componentWillReceiveProps = nextProps => this.syncAddress();

  componentDidMount = () => {
    this.syncAddress();
    this.onSetLocation();
  };

  shouldComponentUpdate = (nextProps, nextState) => this.state.address_name !== nextState.address_name || this.state.detail === nextState.detail;

  onSetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => {
        this.setState({ error: error.message });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  syncAddress = () =>
    User.getAddressForDevice().then(address => {
      if (!address) return null;

      const existRoad = address.road_address !== "";
      const existAddr = address.address_name !== "";

      const addr = address.road_address + (existRoad && existAddr ? " (" : "") + address.address_name + (existRoad && existAddr ? ")" : "");

      this.setState({ ...address, location: addr, detail: address.detail_address });
    });

  saveDetailAddress = () => {
    User.setAddressForDevice({
      road_address: this.state.road_address,
      address_name: this.state.address_name,
      detail_address: this.state.detail,
      lat: this.state.lat,
      lng: this.state.lng
    });
  };

  debounced = debounce(this.saveDetailAddress, 1000);

  onChangeAddressText = text => {
    this.setState({ detail: text });
    this.debounced();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RouteButton link="daumMap" linkOptions={{ lat: this.state.latitude || null, lng: this.state.longitude || null }}>
          <Label>지도로 선택</Label>
        </RouteButton>
        <RouteButton link="daumMapSearch">
          <Label>시/군/도로명 검색</Label>
        </RouteButton>
        <Label>주소</Label>
        <Label>{this.state.location}</Label>
        <Label>상세주소</Label>
        <Input style={{ borderBottomWidth: 1 }} onChangeText={text => this.onChangeAddressText(text)} value={this.state.detail} />
      </View>
    );
  }
}
