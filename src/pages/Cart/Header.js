import React from "react";
import { View, Text } from "react-native";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default (
  <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", paddingLeft: 30, paddingRight: 30 }}>
    <Text style={{ fontSize: textResizing(25), fontWeight: "bold", color: "#212529" }}>장바구니</Text>
  </View>
);
