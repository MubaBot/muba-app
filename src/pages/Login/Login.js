import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { Text } from "react-native";
import { Container, Header, Body, Left, Right, Button, Title, Icon, Input, Content, Form, Item, Label } from "native-base";

import RouteButton from "@/components/RouteButton";

import { doLogin } from "apis/auth";

export default class Login extends Component {
  constructor(props) {
    super(props);
    if (!props.navigation.state.params.route) {
      alert("error");
      Actions.pop();
    }
  }
  // onSuccess => this.props.navigation.state.params.route

  doLogin = async () => {
    doLogin({
      // id: id,
      // pw: pw
    })
      .then(() => {
        Actions.pop();
        Actions[this.props.navigation.state.params.route]({});
      })
      .catch(() => null);
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
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ backgroundColor: "white" }}>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <RouteButton link="register">
              <Text>Register</Text>
            </RouteButton>
            <Button onPress={this.doLogin}>
              <Text>Submit</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
