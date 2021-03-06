import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

import { Actions } from "react-native-router-flux";
import Image from "react-native-remote-svg";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default (
  <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingLeft: 30, paddingRight: 30 }}>
    <View style={{ width: 20, height: 20 }} />

    <Text style={{ fontSize: textResizing(25), fontWeight: "bold", color: "#212529" }}>메뉴/정보</Text>

    <TouchableWithoutFeedback onPress={() => Actions.pop()}>
      <View>
        <Image source={require("assets/icons/m-close.svg")} style={{ width: 20, height: 20 }} />
      </View>
    </TouchableWithoutFeedback>
  </View>
);
