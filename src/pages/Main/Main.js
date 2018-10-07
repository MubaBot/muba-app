import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Container, Header, Body, Left, Right, Text, Title, Icon } from "native-base";

import ChatButton from "./ChatButton";
import RouteButton from "@/components/RouteButton";

export default class Main extends Component {
  async clearChat() {
    await AsyncStorage.removeItem("chatCount");
    await AsyncStorage.removeItem("chat");
    alert("clear");
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Muba</Title>
          </Body>
          <Right>
            <RouteButton transparent link="settings">
              <Icon name="settings" />
            </RouteButton>
          </Right>
        </Header>

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <RouteButton link="recommend">
            <Text>추천받기</Text>
          </RouteButton>
          <RouteButton link="search">
            <Text>상점찾기</Text>
          </RouteButton>
          <RouteButton link="order">
            <Text>주문목록</Text>
          </RouteButton>
          <RouteButton onPress={this.clearChat}>
            <Text>Clear Chat</Text>
          </RouteButton>
          <ChatButton />
        </View>
      </Container>
    );
  }
}
