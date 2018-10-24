import React, { Component } from "react";
import { Alert } from "react-native";
import { Container, Header, Body, Left, Right, Title, Icon, Input, Content, Form, Item, Label, Text, Button } from "native-base";
import { Actions } from "react-native-router-flux";

import RouteButton from "@/components/RouteButton";

import { AuthApi } from "@/apis";

export default class Register extends Component {
  state = {
    id: "",
    username: "",
    email: "",
    password: "",
    repassword: "",
    vaildEmail: false,
    vaildRepass: false
  };

  id = null;
  username = null;
  email = null;
  password = null;
  repassword = null;

  onChangeText = (name, text) => {
    if (name === "repassword") this.setState({ vaildRepass: this.state.password === text });
    if (name === "email") this.setState({ vaildEmail: /^([\w0-9])*\@([\w0-9\.])+$/.test(text) });
    this.setState({ [name]: text });
  };

  checkForm = () => {
    if (this.state.id === "") return Alert.alert("아이디를 입력해 주세요.");
    if (this.state.username === "") return Alert.alert("이름을 입력해 주세요.");
    if (this.state.email === "" || !this.state.vaildEmail) return Alert.alert("올바른 이메일을 입력해 주세요.");
    if (this.state.password === "") return Alert.alert("비밀번호를 입력해 주세요.");
    if (this.state.repassword === "" || !this.state.vaildRepass) return Alert.alert("비밀번호 확인을 다시 입력해 주세요.");
    return true;
  };

  doRegister = () => {
    if (!this.checkForm()) return;
    AuthApi.register(this.state)
      .then(() => Actions.pop())
      .catch(() => Alert.alert("잠시 후 다시 시도해 주세요."));
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
            <Title>Register</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ backgroundColor: "white" }}>
          <Form>
            <Item stackedLabel success={this.state.id !== ""} error={this.state.id === ""}>
              <Label>ID</Label>
              <Input ref={this.id} autoFocus onChangeText={text => this.onChangeText("id", text)} />
            </Item>
            <Item stackedLabel success={this.state.username !== ""} error={this.state.username === ""}>
              <Label>Username</Label>
              <Input ref={this.username} onChangeText={text => this.onChangeText("username", text)} />
            </Item>
            <Item stackedLabel success={this.state.vaildEmail} error={!this.state.vaildEmail}>
              <Label>E-Mail</Label>
              <Input ref={this.email} emailAddress={true} onChangeText={text => this.onChangeText("email", text)} />
            </Item>
            <Item stackedLabel success={this.state.password !== ""} error={this.state.password === ""}>
              <Label>Password</Label>
              <Input ref={this.password} secureTextEntry={true} password={true} onChangeText={text => this.onChangeText("password", text)} />
            </Item>
            <Item stackedLabel success={this.state.vaildRepass} error={!this.state.vaildRepass} last>
              <Label>Re-Password</Label>
              <Input ref={this.repassword} secureTextEntry={true} password={true} onChangeText={text => this.onChangeText("repassword", text)} />
            </Item>
            <Button onPress={this.doRegister}>
              <Text>Register</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
