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
        messages: messages
      });
    });
  }

  componentDidMount() {}

  /**
   * Methods
   */
  async onSend(messages = []) {
    for (let i in messages) await this.saveMessage(messages[i].text);

    const chat = await this.saveMessage("", { bot: true, type: TYPE_LOADING });

    fetch("https://randomuser.me/api/?results=1", {
      // method: 'POST',
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({
      //   firstParam: 'yourValue',
      // }),
    })
      .then(response => response.json())
      .then(async responseJson => {
        await this.removeChatMessage(chat._id);
        this.saveMessage(responseJson.results[0].login.username, { bot: true });
      });
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
      name = "Muba Bot";
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
      if (msg) return JSON.parse(msg);
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
