import React, { Component } from "react";
import { TouchableWithoutFeedback, Platform, View, Keyboard } from "react-native";

import { Body, Left, Right, Text, Title, Icon, Spinner } from "native-base";
import { Actions } from "react-native-router-flux";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Toast from "react-native-easy-toast";

import GiftedChat from "./GiftedChatComponents/GiftedChat";
import Composer from "./GiftedChatComponents/Composer";
import InputToolbar from "./GiftedChatComponents/InputToolbar";
import Send from "./GiftedChatComponents/Send";
import Message from "./GiftedChatComponents/Message";
import Day from "./GiftedChatComponents/Day";

import Header from "./Header";
import SearchShops from "./PopupItems/SearchShops";
import SearchFood from "./PopupItems/SearchFood";
import SearchShopRandom from "./PopupItems/SearchShopRandom";
import SearchFoodRandom from "./PopupItems/SearchFoodRandom";
import ShowShopMenu from "./PopupItems/ShowShopMenu";

import LoadingContainer from "@/components/LoadingContainer";

import { ChatApi, UserApi, ShopApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class Chat extends Component {
  state = { messages: [], keyboard: false, id: null, loading: true, lat: 0, lng: 0, keyboardHeight: 0 };
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
    this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow);
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
    this.keyboardWillHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide);
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

  componentWillUnmount = () => {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  };

  keyboardWillShow = e =>
    this.setState({
      keyboard: true,
      keyboardHeight: e && e.endCoordinates && e.endCoordinates.height ? Math.round(e.endCoordinates.height) : this.state.keyboardHeight
    });
  keyboardDidShow = e => this.setState({ keyboard: true, keyboardHeight: Math.round(e.endCoordinates.height) });
  keyboardWillHide = () => this.setState({ keyboard: false });
  keyboardDidHide = () => this.setState({ keyboard: false });

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

        this.setState({ messages: messages });

        const argv = JSON.parse(response.argv);

        var type = ChatApi.CONFIG.TYPE_NORMAL;
        var msg = response.msg;

        let temp;

        switch (response.func) {
          case "show_food_related_restaurant":
            type = ChatApi.CONFIG.TYPE_SERACH_FOOD;
            msg = argv.food[0];
            break;
          case "restaurant_recommend":
            type = ChatApi.CONFIG.TYPE_SERACH_SHOP_RANDOM;
            break;
          case "food_recommend":
            type = ChatApi.CONFIG.TYPE_SERACH_FOOD_RANDOM;
            break;
          case "show_menu":
            type = ChatApi.CONFIG.TYPE_SHOP_MENU;
            temp = await ShopApi.getShopInfoByName({ shop: argv.restaurant[0], lat: this.state.lat, lng: this.state.lng });
            msg = JSON.stringify({ ID: temp._id, SHOPNAME: temp.SHOPNAME });
            break;
          case "show_restaurant_info":
            Actions.push("shop", { id: argv.restaurant[0] });
            break;
        }

        const messages = await ChatApi.removeChatMessage(chat._id);
        ChatApi.saveMessage(ChatApi.CONFIG.BOT_ID, msg, type).then(chat => this.setState(() => ({ messages: GiftedChat.append(this.state.messages, chat) })));
      }
    );
  }

  getSearchKeyword = message => {
    if (!/^근처의/.test(message)) return null;
    if (!/판매점입니다$/.test(message)) return null;
    const test = message.split("근처의 ")[1].split(" 판매점입니다")[0];
    return test;
  };

  /**
   * UI
   */
  renderCustomInnerView = props => {
    switch (props.currentMessage.type) {
      case ChatApi.CONFIG.TYPE_LOADING:
        return <Spinner size="small" style={{ height: 30, width: 50 }} />;
      case ChatApi.CONFIG.TYPE_NORMAL:
      default:
        return null;
    }
  };

  renderCustomUnderView = props => {
    switch (props.currentMessage.type) {
      case ChatApi.CONFIG.TYPE_SERACH_SHOP_RANDOM:
        return <SearchShopRandom lat={this.state.lat} lng={this.state.lng} showShopMenus={this.showShopMenus} />;
      case ChatApi.CONFIG.TYPE_SERACH_FOOD_RANDOM:
        return <SearchFoodRandom lat={this.state.lat} lng={this.state.lng} showShopInfo={this.showShopInfo} />;
      case ChatApi.CONFIG.TYPE_SERACH_FOOD:
        return <SearchFood search={props.currentMessage.text} lat={this.state.lat} lng={this.state.lng} showShopMenus={this.showShopMenus} />;
      case ChatApi.CONFIG.TYPE_SHOP_MENU:
        return <ShowShopMenu data={JSON.parse(props.currentMessage.text)} toast={this.refs.toast} />;
      case ChatApi.CONFIG.TYPE_NORMAL:
      default:
        return null;
    }
  };

  renderCustomText = currentMessage => {
    switch (currentMessage.type) {
      case ChatApi.CONFIG.TYPE_SERACH_FOOD:
        return `근처의 ${currentMessage.text} 판매점입니다.`;
      case ChatApi.CONFIG.TYPE_SHOP_MENU:
        return `${JSON.parse(currentMessage.text).SHOPNAME} 가게의 메뉴 정보입니다.`;
      case ChatApi.CONFIG.TYPE_LOADING:
        return "";
      case ChatApi.CONFIG.TYPE_NORMAL:
      default:
        return currentMessage.text;
    }
  };

  /**
   * Methods
   */
  showShopMenus = (id, name) => {
    ChatApi.saveMessage(ChatApi.CONFIG.BOT_ID, JSON.stringify({ ID: id, SHOPNAME: name }), ChatApi.CONFIG.TYPE_SHOP_MENU).then(chat =>
      this.setState(() => ({ messages: GiftedChat.append(this.state.messages, chat) }))
    );
  };

  showShopInfo = id => Actions.push("shop", { id: id });

  render() {
    return (
      <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#f1f6f9",
              marginBottom: this.state.keyboard ? this.state.keyboardHeight : 70
            }}
          >
            <GiftedChat
              ref={ref => (this.chat = ref)}
              loadEarlier={false}
              isLoadingEarlier={false}
              showAvatarForEveryMessage={true}
              messages={this.state.messages}
              user={{ _id: this.state.id }}
              parsePatterns={this.parsePatterns}
              onSend={messages => this.onSend(messages)}
              renderCustomInnerView={this.renderCustomInnerView}
              renderCustomUnderView={this.renderCustomUnderView}
              renderCustomText={this.renderCustomText}
              placeholder="입력해주세요."
              renderInputToolbar={props => <InputToolbar {...props} />}
              renderComposer={props => <Composer {...props} />}
              renderSend={props => <Send {...props} />}
              renderMessage={props => <Message {...props} />}
              renderDay={props => <Day {...props} />}
            />
            <Toast
              ref="toast"
              positionValue={182}
              style={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, zIndex: 9999 }}
              textStyle={{ fontSize: textResizing(20), fontWeight: "bold", color: "#FFF" }}
            />
          </View>
        </TouchableWithoutFeedback>
      </LoadingContainer>
    );
  }
}
