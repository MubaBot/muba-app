// import "prop-types"; // Supported builtin module

import React, { Component } from "react";
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends Component {
  state = {
    messages: []
  };

  renderCustomView = props => {
    if (props.currentMessage.location) return <View />;
    return null;
  };

  componentWillMount() {
    this.getChatMessage().then(messages => {
      this.setState({
        messages: messages
      });
    });
  }

  componentDidMount() {}

  async onSend(messages = []) {
    for (let i in messages) await this.saveMessage(messages[i].text);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  async getChatCount() {
    const count = await AsyncStorage.getItem("chatCount");
    let c = 0;
    if (count) c = JSON.parse(count) + 1;

    AsyncStorage.setItem("chatCount", JSON.stringify(c));
    return c;
  }

  makeChat(chatId, text, createdAt, userId, name) {
    return {
      _id: chatId,
      text: text,
      createdAt: createdAt,
      user: {
        _id: userId,
        name: name
      }
    };
  }

  async saveMessage(text, bot = false, createdAt = new Date()) {
    const count = await this.getChatCount();
    let msg = await this.getChatMessage();

    var id = 1,
      name = "User";

    if (bot) {
      id = 0;
      name = "Muba Bot";
    }

    const chat = this.makeChat(count, text, createdAt, id, name);
    const c = [chat].concat(msg);

    return AsyncStorage.setItem("chat", JSON.stringify(c))
      .then(() => true)
      .catch(() => false);
  }

  async getChatMessage() {
    return AsyncStorage.getItem("chat").then(msg => {
      if (msg) return JSON.parse(msg);
      return [];
    });
  }

  render() {
    const Spacer = Platform.OS === "ios" ? null : <KeyboardSpacer />;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={[{ flex: 1, backgroundColor: "white" }]}>
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
          {Spacer}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
