import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Container, Header, Body, Left, Right, Button, Text, Title, Icon } from 'native-base';

import ChatButton from "./ChatButton";
import ActionButton from "components/ActionButton";

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
            <ActionButton transparent link="settings">
              <Icon name='settings' />
            </ActionButton>
          </Right>
        </Header>

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ActionButton link=""><Text>1</Text></ActionButton>
          <ActionButton link=""><Text>2</Text></ActionButton>
          <ActionButton link=""><Text>3</Text></ActionButton>
          <ActionButton onPress={this.clearChat}><Text>Clear Chat</Text></ActionButton>
          <ChatButton />
        </View>
      </Container>
    );
  }
}
