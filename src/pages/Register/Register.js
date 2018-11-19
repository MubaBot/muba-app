import React, { Component } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, Alert, TextInput, TouchableWithoutFeedback } from "react-native";
import { Actions } from "react-native-router-flux";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";

import { AuthApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

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
      <LoadingContainer loading={false} header={Header}>
        <KeyboardAvoidingView behavior="position">
          <TextInput
            style={{
              fontSize: textResizing(24),
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 40,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            placeholder="아이디"
            underlineColorAndroid="transparent"
            onChangeText={text => this.onChangeText("id", text)}
          />

          <TextInput
            style={{
              fontSize: textResizing(24),
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            underlineColorAndroid="transparent"
            placeholder="이름"
            onChangeText={text => this.onChangeText("username", text)}
          />

          <TextInput
            style={{
              fontSize: textResizing(24),
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            underlineColorAndroid="transparent"
            placeholder="이메일"
            onChangeText={text => this.onChangeText("email", text)}
          />

          <TextInput
            style={{
              fontSize: textResizing(24),
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            placeholder="비밀번호"
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => this.onChangeText("password", text)}
          />

          <TextInput
            style={{
              fontSize: textResizing(24),
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              borderBottomWidth: 1,
              borderBottomColor: "#ced4da"
            }}
            placeholder="비밀번호 확인"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={text => this.onChangeText("repassword", text)}
            onSubmitEditing={this.doRegister}
          />

          <TouchableWithoutFeedback onPress={this.doRegister}>
            <View
              style={{ marginLeft: 30, marginRight: 30, marginTop: 60, backgroundColor: "#468ef7", paddingTop: 15, paddingBottom: 15, alignItems: "center" }}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: textResizing(20) }}>가입하기</Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LoadingContainer>
    );
  }
}
