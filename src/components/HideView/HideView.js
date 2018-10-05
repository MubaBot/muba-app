import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";

const HideView = props => {
  const { children, hide, style } = props;
  if (hide) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={props.onPress ? props.onPress : () => null}>
      <View {...props} style={style}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HideView;
