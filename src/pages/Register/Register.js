import React, { Component } from "react";
import { Container, Header, Body, Left, Right, Title, Icon, Input, Content, Form, Item, Label, Text } from "native-base";

import RouteButton from "components/RouteButton";

export default class Register extends Component {
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
            <RouteButton goBack={true}>
              <Text>Register</Text>
            </RouteButton>
          </Form>
        </Content>
      </Container>
    );
  }
}
