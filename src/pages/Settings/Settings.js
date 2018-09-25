import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { View, Text } from "react-native";
import { Container, Header, Body, Left, Right, Button, Title, Icon } from 'native-base';

import Location from "./Location";

export default class Settings extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={Actions.pop}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right />
        </Header>

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Text>위치설정</Text>
          <Location />
        </View>
      </Container>
    );
  }
}
