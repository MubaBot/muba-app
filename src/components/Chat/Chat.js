// import "prop-types"; // Supported builtin module

import "moment/locale/ko";
import React, { Component } from "react";
import { Platform, View, TouchableWithoutFeedback, Keyboard, AsyncStorage, Text } from "react-native";
import { Spinner } from "native-base";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";

const TYPE_NORMAL = 0;
const TYPE_LOADING = 1;

export default class Chat extends Component {
  state = {
    messages: []
  };

  /**
   * Lifecycle
   */
  componentWillMount() {
    this.getChatMessage().then(messages => {
      this.setState({
        messages: messages,
        intent: -1,
        argv: JSON.stringify({})
      });
    });
  }

  componentDidMount() {}

  /**
   * Methods
   */
  async onSend(messages = []) {
    if (messages.length === 0) return;

    await this.saveMessage(messages[0].text);

    const chat = await this.saveMessage("", { bot: true, type: TYPE_LOADING });

    fetch(
      "http://222.111.144.32:5000/chatbot/api/get_message?get_params=" +
        JSON.stringify({
          text: messages[0].text,
          intent: this.state.intent,
          argv: JSON.parse(this.state.argv)
        })
    )
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        this.setState({
          intent: responseJson.intent,
          argv: responseJson.argv
        });
        await this.removeChatMessage(chat._id);
        this.saveMessage(responseJson.msg, { bot: true });
      })
      .catch(err => console.log(err));
  }

  parsePatterns(linkStyle) {
    return [
      {
        pattern: /#(\w+)/,
        style: { ...linkStyle, color: "lightgreen" },
        onPress: props => alert(`press on ${props}`)
      }
    ];
  }

  async makeChat({ text, userId, name, createdAt, type }) {
    const chatId = await this.getChatCount();
    return {
      _id: chatId,
      text: text,
      createdAt: createdAt,
      user: {
        _id: userId,
        name: name
      },
      type: type
    };
  }

  async saveMessage(text, { bot, createdAt, type } = { bot: false, createdAt: new Date(), type: TYPE_NORMAL }) {
    let msg = await this.getChatMessage();

    var id = 1,
      name = "User";

    if (bot) {
      id = 0;
      name = "무바 봇";
    }

    const chat = await this.makeChat({
      text,
      userId: id,
      name,
      createdAt: createdAt ? createdAt : new Date(),
      type: type ? type : TYPE_NORMAL
    });
    const c = [chat].concat(msg);

    return AsyncStorage.setItem("chat", JSON.stringify(c))
      .then(() => {
        this.setState(() => ({ messages: GiftedChat.append(this.state.messages, chat) }));
        return chat;
      })
      .catch(() => false);
  }

  async getChatCount() {
    const count = await AsyncStorage.getItem("chatCount");
    let c = 0;
    if (count) c = JSON.parse(count) + 1;

    AsyncStorage.setItem("chatCount", JSON.stringify(c));
    return c;
  }

  async getChatMessage() {
    return AsyncStorage.getItem("chat").then(msg => {
      if (msg) return JSON.parse(msg).filter((i, n) => i.type !== TYPE_LOADING);
      return [];
    });
  }

  async removeChatMessage(id) {
    let exist = false;
    const messages = (await this.getChatMessage()).filter((i, n) => {
      const e = i._id === id;
      if (e) exist = true;
      return !e;
    });

    return AsyncStorage.setItem("chat", JSON.stringify(messages))
      .then(() => this.setState({ messages: messages }))
      .then(() => exist)
      .catch(() => false);
  }

  /**
   * UI
   */
  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <Text>SendTest</Text>
        </View>
      </Send>
    );
  }

  renderCustomView(props) {
    switch (props.currentMessage.type) {
      case TYPE_LOADING:
        return <Spinner size="small" style={{ height: 30, width: 50 }} />;
      case TYPE_NORMAL:
      default:
        return null;
    }
  }

  renderDay(props) {
    console.log(props);
    return <Text>123</Text>;
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
            user={{ _id: 1 }}
            placeholder="입력해주세요."
            parsePatterns={this.parsePatterns}
            onSend={messages => this.onSend(messages)}
            renderCustomView={this.renderCustomView}
            // renderDay={this.renderDay}
          />
          {Spacer}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
