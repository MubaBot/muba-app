import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { View, ScrollView } from "react-native";
import { Header, Body, Left, Right, Title, Icon, Button, Text } from "native-base";

import RouteButton from "@/components/RouteButton";
import LoadingContainer from "@/components/LoadingContainer";

import Location from "./Location";
import Tendency from "./Tendency";

import { Auth } from "@/apis";

export default class Settings extends Component {
  doLogout = async () => {
    Auth.doLogout()
      .then(() => Actions.popTo("main"))
      .catch(() => null);
  };
  
  render() {
    return (
      <LoadingContainer requireAuth={true}>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right />
        </Header>

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView>
            <Text>위치설정</Text>
            <Location />

            {/* <Text>성향 설정</Text>
            <Tendency /> */}

            <Button onPress={this.doLogout}>
              <Text>Logout</Text>
            </Button>
          </ScrollView>
        </View>
      </LoadingContainer>
    );
  }
}
