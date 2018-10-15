import React, { Component } from "react";
import { StyleSheet, WebView, Alert } from "react-native";
import { Container, Header, Body, Left, Right, Title, Icon, Text } from "native-base";
import { Actions } from "react-native-router-flux";

import RouteButton from "@/components/RouteButton";

import { User } from "@/apis";

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
      road_address: "",
      address_name: "",

      latLng: { jb: 0, ib: 0 }
    };
  }

  onSubmit = () => {
    if (this.state.road_address === "" && this.state.address_name === "") return Alert.alert("", "주소를 선택해 주세요.");

    Alert.alert("", "주소를 선택하시겠습니까?", [
      {
        text: "예",
        onPress: () => {
          User.setAddressForDevice({
            road_address: this.state.road_address,
            address_name: this.state.address_name,
            detail_address: "",
            lat: this.state.latLng.jb,
            lng: this.state.latLng.ib
          });
          Actions.settings();
        }
      },
      { text: "아니오", onPress: () => null }
    ]);
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Set Place</Title>
          </Body>
          <Right>
            <RouteButton onPress={this.onSubmit}>
              <Text>선택</Text>
            </RouteButton>
          </Right>
        </Header>

        <WebView
          style={styles.webView}
          source={require("assets/html/daum.map.html")}
          injectedJavaScript={require("assets/html/daum.map.html.js")(this.state.lat, this.state.lng)}
          scrollEnabled={false}
          startInLoadingState={true}
          onMessage={event => this.setState(JSON.parse(event.nativeEvent.data))}
        />
      </Container>
    );
  }
}
