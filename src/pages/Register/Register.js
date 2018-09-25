import React, { Component } from "react";
import { Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { Container, Header, Body, Left, Right, Button, Title, Icon, Input, Content, Form, Item, Label } from 'native-base';

export default class Register extends Component {

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
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <Button>
              <Text>Register</Text>
            </Button>
          </Form>
        </Content>

      </Container>
    );
  }
}
