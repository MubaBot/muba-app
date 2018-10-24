import React, { Component } from "react";
import { TouchableWithoutFeedback, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Actions } from "react-native-router-flux";
import Image from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

import Location from "./Location";
import Profile from "./Profile";

export default class Settings extends Component {
  state = {
    inputProfile: false
  };

  focusKeyboard = (panel, mode) => {
    const enable = mode === "in" ? true : false;

    switch (panel) {
      case "profile":
        this.setState({ inputProfile: enable });
    }
  };

  render() {
    return (
      <LoadingContainer requireAuth={true}>
        <KeyboardAvoidingView behavior="position" enabled={this.state.inputProfile}>
          <ScrollView>
            <View style={{ paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#dadada" }}>
              <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <View>
                  <Image source={require("assets/icons/m-close.svg")} style={{ width: 20, height: 20 }} />
                </View>
              </TouchableWithoutFeedback>

              <Location />
            </View>

            <View
              style={{
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 30,
                borderTopWidth: 15,
                backgroundColor: "#FFF",
                borderTopColor: "#ebebeb"
              }}
            >
              <Profile focusKeyboard={this.focusKeyboard} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LoadingContainer>
    );
  }
}
