// import "prop-types"; // Supported builtin module

import React, { Component } from "react";
import { Platform, View, TouchableWithoutFeedback, Keyboard, AsyncStorage, Alert } from "react-native";
import { Header, Body, Left, Right, Text, Title, Icon, Spinner } from "native-base";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";
import querystring from "querystring";
import "moment/locale/ko";

import RouteButton from "@/components/RouteButton";
import LoadingContainer from "@/components/LoadingContainer";

const TYPE_NORMAL = 0;
const TYPE_LOADING = 1;

export default class Chat extends Component {
  state = { messages: [] };

  /**
   * Lifecycle
   */
  componentWillMount = () => {
    this.getChatMessage().then(messages => {
      this.setState({
        messages: messages,
        intent_history: 1,
        scenario: -1,
        argv: JSON.stringify({ user: "say2" })
      });
    });
  };

  /**
   * Methods
   */
  async onSend(messages = []) {
    if (messages.length === 0) return;

    await this.saveMessage(messages[0].text);

    const chat = await this.saveMessage("", { bot: true, type: TYPE_LOADING });

    fetch(
      "https://chat.mubabot.com/chatbot/api/get_message?" +
        querystring.stringify({
          text: messages[0].text,
          scenario: this.state.scenario,
          intent_history: this.state.intent_history,
          argv: this.state.argv
        })
    )
      .then(response => response.json())
      .then(async responseJson => {
        this.setState({
          intent_history: responseJson.intent_history,
          scenario: responseJson.scenario,
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

    var id = 1;
    var name = "User";

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

  clearChat = () => {
    Alert.alert(
      "",
      "채팅 기록을 지우시겠습니까?",
      [
        {
          text: "예",
          onPress: async () => {
            await AsyncStorage.removeItem("chatCount");
            await AsyncStorage.removeItem("chat");
            this.setState({ messages: [] });
          }
        },
        { text: "아니오", onPress: () => null }
      ],
      { cancelable: false }
    );
  };

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
      <LoadingContainer requireAuth={true}>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Muba Chat</Title>
          </Body>
          <Right>
            <RouteButton transparent onPress={this.clearChat}>
              <Icon name="trash" style={{ color: "#000" }} />
            </RouteButton>
          </Right>
        </Header>

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
      </LoadingContainer>
    );
  }
}
