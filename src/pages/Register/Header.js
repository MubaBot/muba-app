import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

import { Actions } from "react-native-router-flux";
import Image from "react-native-remote-svg";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default (
  <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingLeft: 30, paddingRight: 30 }}>
    <TouchableWithoutFeedback onPress={() => Actions.popTo("login", { success: 0 })}>
      <View>
        <Image source={require("assets/icons/m-prev.svg")} style={{ width: 20, height: 20 }} />
      </View>
    </TouchableWithoutFeedback>
    <Text style={{ fontSize: textResizing(25), fontWeight: "bold", color: "#212529" }}>회원가입</Text>
    <View style={{ width: 20, height: 20 }} />
  </View>
);
