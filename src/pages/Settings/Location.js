import React, { Component } from "react";
import { View } from "react-native";
import { Label } from "native-base";

import RouteButton from "components/RouteButton";

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      location: ""
    };
  }

  onSetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        // alert(JSON.stringify(position));
        // alert(position.coords.latitude);
        // alert(position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => {
        alert(JSON.stringify(error));
        this.setState({ error: error.message });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Label>주소</Label>
        <Label value={this.state.location}>서울 특별시 강남구 테헤란로 311 아남타워 7층 SW마에스트로</Label>

        <Label>재설정</Label>
        <RouteButton link="daumMap">
          <Label>현재위치</Label>
        </RouteButton>
        <RouteButton link="daumMapSearch">
          <Label>시/군/도로명 검색</Label>
        </RouteButton>
      </View>
    );
  }
}
