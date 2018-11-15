import React, { Component } from "react";
import { View, Alert, Text, TextInput, TouchableWithoutFeedback } from "react-native";
import { Actions } from "react-native-router-flux";

import LoadingContainer from "@/components/LoadingContainer";

import { AuthApi } from "@/apis";

export default class Login extends Component {
  constructor(props) {
    super(props);

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
    AuthApi.doLogin({
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
      <LoadingContainer loading={false} header={<Text style={{ fontSize: 25, fontWeight: "bold", color: "#212529" }}>로그인</Text>}>
        <View>
          <TextInput
            style={{
              fontSize: 24,
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 40,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            autoFocus
            placeholder="아이디 또는 이메일"
            onChangeText={text => this.onChangeText("id", text)}
          />
          <TextInput
            style={{
              fontSize: 24,
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            placeholder="비밀번호"
            secureTextEntry={true}
            onChangeText={text => this.onChangeText("password", text)}
            onSubmitEditing={this.doLogin}
          />
          <TouchableWithoutFeedback onPress={this.doLogin}>
            <View
              style={{ marginLeft: 30, marginRight: 30, marginTop: 60, backgroundColor: "#468ef7", paddingTop: 15, paddingBottom: 15, alignItems: "center" }}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 20 }}>로그인</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => Actions.push("register")}>
            <View style={{ marginLeft: 30, marginRight: 30, marginTop: 15, paddingTop: 15, paddingBottom: 15, alignItems: "center" }}>
              <Text style={{ color: "#468ef7", fontWeight: "bold", fontSize: 20 }}>회원가입</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </LoadingContainer>
    );
  }
}
