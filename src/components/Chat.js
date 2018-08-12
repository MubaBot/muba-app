// import "prop-types"; // Supported builtin module

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";

const styles = StyleSheet.create({
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  }
});

export default class MyChat extends Component {
  state = {
    messages: []
  };

  renderCustomView = props => {
    if (props.currentMessage.location) {
      return <View style={props.containerStyle} />;
    }
    return null;
  };

  componentWillMount() {
    this.setState({
      messages: [] // append message
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <View style={[{ flex: 1 }]}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderCustomView={this.renderCustomView}
          user={{
            _id: 1
          }}
          parsePatterns={linkStyle => [
            {
              pattern: /#(\w+)/,
              style: { ...linkStyle, color: "lightgreen" },
              onPress: props => alert(`press on ${props}`)
            }
          ]}
        />
        <KeyboardSpacer />
      </View>
    );
  }
}

/**
 * Message Template
{
  _id: Math.round(Math.random() * 1000000),
  text: "#awesome",
  createdAt: new Date(),
  user: {
    _id: 1,
    name: "Developer"
  }
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "",
  createdAt: new Date(),
  user: {
    _id: 2,
    name: "React Native"
  },
  image:
    "http://www.pokerpost.fr/wp-content/uploads/2017/12/iStock-604371970-1.jpg",
  sent: true,
  received: true
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "Send me a picture!",
  createdAt: new Date(),
  user: {
    _id: 1,
    name: "Developer"
  }
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "",
  createdAt: new Date(),
  user: {
    _id: 2,
    name: "React Native"
  },
  sent: true,
  received: true,
  location: {
    latitude: 48.864601,
    longitude: 2.398704
  }
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "Where are you?",
  createdAt: new Date(),
  user: {
    _id: 1,
    name: "Developer"
  }
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "Yes, and I use Gifted Chat!",
  createdAt: new Date(),
  user: {
    _id: 2,
    name: "React Native"
  },
  sent: true,
  received: true
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "Are you building a chat app?",
  createdAt: new Date(),
  user: {
    _id: 1,
    name: "Developer"
  }
},
{
  _id: Math.round(Math.random() * 1000000),
  text: "You are officially rocking GiftedChat.",
  createdAt: new Date(),
  system: true
}
 */