import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { Alert, Text } from "react-native";
import { Container, Header, Body, Left, Right, Button, Title, Icon, Input, Content, Form, Item, Label } from "native-base";

import RouteButton from "@/components/RouteButton";

import { Auth } from "@/apis";

export default class Login extends Component {
  constructor(props) {
    super(props);
    // if (!props.navigation.state.params.route) {
    //   alert("error");
    //   Actions.pop();
    // }

    this.state = {
      id: "",
      password: ""
    };
  }

  onChangeText = (name, text) => {
    if (name === "repassword") this.setState({ vaildRepass: this.state.password === text });
    if (name === "email") this.setState({ vaildEmail: /^([\w0-9])*\@([\w0-9\.])+$/.test(text) });
    this.setState({ [name]: text });
  };

  checkForm = () => {
    if (this.state.id === "") return Alert.alert("아이디또는 이메일을 입력해 주세요.");
    if (this.state.password === "") return Alert.alert("비밀번호를 입력해 주세요.");
    return true;
  };

  doLogin = () => {
    if (!this.checkForm()) return;
    Auth.doLogin({
      id: "U|L|" + this.state.id,
      password: this.state.password
    })
      .then(() => {
        Actions.pop();
        // Actions[this.props.navigation.state.params.route]({});
      })
      .catch(() => Alert.alert("아이디 또는 비밀번호를 확인해주세요."));
  };

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ backgroundColor: "white" }}>
          <Form>
            <Item stackedLabel>
              <Label>ID or Email</Label>
              <Input ref={this.id} autoFocus onChangeText={text => this.onChangeText("id", text)} />
            </Item>
            <Item stackedLabel last>
              <Label>Password</Label>
              <Input ref={this.password} secureTextEntry={true} password={true} onChangeText={text => this.onChangeText("password", text)} />
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
