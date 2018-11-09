import React, { Component } from "react";
import { TouchableWithoutFeedback, Platform, View, Keyboard } from "react-native";
import { Body, Left, Right, Text, Title, Icon, Spinner } from "native-base";
import KeyboardSpacer from "react-native-keyboard-spacer";

import GiftedChat from "./GiftedChatComponents/GiftedChat";
import Composer from "./GiftedChatComponents/Composer";
import InputToolbar from "./GiftedChatComponents/InputToolbar";
import Send from "./GiftedChatComponents/Send";
import Message from "./GiftedChatComponents/Message";
import Day from "./GiftedChatComponents/Day";

import Header from "./Header";
import SearchShops from "./PopupItems/SearchShops";

import LoadingContainer from "@/components/LoadingContainer";

import { ChatApi, UserApi } from "@/apis";

export default class Chat extends Component {
  state = { messages: [], keyboard: false, id: null, loading: true, lat: 0, lng: 0 };
  chat = { focusTextInput: () => null };
  /**
   * Lifecycle
   */
  componentDidMount = async () => {
    const messages = await ChatApi.getChatMessage();
    const user = await UserApi.getUserInfoByServer();
    const address = await UserApi.getAddressForDevice();

    this.setState({
      messages: messages,
      intent_history: 1,
      scenario: -1,
      loading: false,
      argv: JSON.stringify({ user: JSON.stringify(user._id) }),
      id: user._id,
      lat: address.lat,
      lng: address.lng
    });

    this.keyboardWillShowListener = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  };

  componentWillReceiveProps = async nextProps => {
    // this.setState({ loading: true });
    const messages = await ChatApi.getChatMessage();
    const user = await UserApi.getUserInfoByServer();
    const address = await UserApi.getAddressForDevice();

    this.setState({
      messages: messages,
      intent_history: 1,
      scenario: -1,
      loading: false,
      argv: JSON.stringify({ user: JSON.stringify(user._id) }),
      id: user._id,
      lat: address.lat,
      lng: address.lng
    });

    // this.chat.focusTextInput();
    this.chat.refreshScreen();
    // this.forceUpdate();
  };

  // componentWillUnmount = () => {
  //   this.keyboardWillShowListener.remove();
  //   this.keyboardWillHideListener.remove();
  // };

  keyboardWillShow = () => this.setState({ keyboard: true });
  keyboardWillHide = () => this.setState({ keyboard: false });

  /**
   * Methods
   */
  async onSend(messages = []) {
    if (messages.length === 0) return;
    if (messages[0].text === "") return;

    await ChatApi.saveMessage(this.state.id, messages[0].text).then(chat => this.setState(() => ({ messages: GiftedChat.append(this.state.messages, chat) })));

    const chat = await ChatApi.saveMessage(ChatApi.CONFIG.BOT_ID, "", ChatApi.CONFIG.TYPE_LOADING).then(chat => {
      this.setState({ messages: GiftedChat.append(this.state.messages, chat) });
      return chat;
    });

    ChatApi.doChat({ text: messages[0].text, scenario: this.state.scenario, intent_history: this.state.intent_history, argv: this.state.argv }).then(
      async response => {
        this.setState({
          intent_history: response.intent_history,
          scenario: response.scenario,
          argv: response.argv
        });
        const messages = await ChatApi.removeChatMessage(chat._id);

        this.setState({ messages: messages });

        var type = ChatApi.CONFIG.TYPE_NORMAL;
        if (this.checkSearch(response.msg)) type = ChatApi.CONFIG.TYPE_SERACH;

        ChatApi.saveMessage(ChatApi.CONFIG.BOT_ID, response.msg, type).then(chat =>
          this.setState(() => ({ messages: GiftedChat.append(this.state.messages, chat) }))
        );
      }
    );
  }

  checkSearch = message => {
    if (!/^근처의/.test(message)) return false;
    if (!/판매점입니다$/.test(message)) return false;
    const test = message.split("근처의 ")[1].split(" 판매점입니다")[0];
    return true;
  };

  getSearchKeyword = message => {
    if (!/^근처의/.test(message)) return null;
    if (!/판매점입니다$/.test(message)) return null;
    const test = message.split("근처의 ")[1].split(" 판매점입니다")[0];
    return test;
  };

  /**
   * UI
   */

  renderCustomView = props => {
    switch (props.currentMessage.type) {
      case ChatApi.CONFIG.TYPE_SERACH:
        return <SearchShops search={this.getSearchKeyword(props.currentMessage.text)} lat={this.state.lat} lng={this.state.lng} />;
      case ChatApi.CONFIG.TYPE_LOADING:
        return <Spinner size="small" style={{ height: 30, width: 50 }} />;
      case ChatApi.CONFIG.TYPE_NORMAL:
      default:
        return null;
    }
  };

  render() {
    // const Spacer = Platform.OS === "ios" ? null : <KeyboardSpacer />;

    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ flex: 1, backgroundColor: "#f1f6f9", marginBottom: this.state.keyboard ? 214 : 70 }}>
            {/* {this.state.id ? ( */}
            <GiftedChat
              ref={ref => (this.chat = ref)}
              loadEarlier={false}
              isLoadingEarlier={false}
              messages={this.state.messages}
              user={{ _id: this.state.id }}
              parsePatterns={this.parsePatterns}
              onSend={messages => this.onSend(messages)}
              renderCustomView={this.renderCustomView}
              placeholder="입력해주세요."
              renderInputToolbar={props => <InputToolbar {...props} />}
              renderComposer={props => <Composer {...props} />}
              renderSend={props => <Send {...props} />}
              renderMessage={props => <Message {...props} />}
              renderDay={props => <Day {...props} />}
            />
            {/* ) : null} */}
            {/* {Spacer} */}
          </View>
        </TouchableWithoutFeedback>
      </LoadingContainer>
    );
  }
}
