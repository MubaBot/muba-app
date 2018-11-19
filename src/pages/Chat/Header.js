import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Actions } from "react-native-router-flux";

import Image from "react-native-remote-svg";

import { ChatApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default (
  <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
    <View style={{ width: 20, height: 20 }} />

    <Text style={{ fontSize: textResizing(25), fontWeight: "bold", color: "#212529" }}>채팅하기</Text>

    <TouchableWithoutFeedback onPress={() => ChatApi.clearChat().then(() => Actions.refresh())}>
      <View>
        <Image source={require("assets/icons/icon-trash.svg")} style={{ width: 20, height: 20 }} />
      </View>
    </TouchableWithoutFeedback>
  </View>
);
