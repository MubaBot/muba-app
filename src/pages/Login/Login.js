import React, { Component } from "react";
import { Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { Container, Header, Body, Left, Right, Button, Title, Icon, Input, Content, Form, Item, Label } from 'native-base';

import ActionButton from "components/ActionButton";

export default class Login extends Component {

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => { Actions.main({}); }}>
              <Icon name='home' />
            </Button>
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
            <ActionButton link="register"><Text>Register</Text></ActionButton>
            <Button>
              <Text>Submit</Text>
            </Button>
          </Form>
        </Content>

      </Container>
    );
  }
}
