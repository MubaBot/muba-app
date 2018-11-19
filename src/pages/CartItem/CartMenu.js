import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image, Alert } from "react-native";

import accounting from "accounting-js";
import SvgImage from "react-native-remote-svg";

import { CartApi } from "@/apis";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class CartMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      URL: "",
      MENUNAME: "",
      count: 0,
      sales: [],
      shop_menu_options: [],
      options: []
    };
  }

  componentWillReceiveProps = nextProps => this.setState({ ...nextProps.menu, count: nextProps.count, options: nextProps.options || [] });

  countMenu = count => {
    const c = this.updateMenuCount(count);

    CartApi.updateCountByCartInShop(this.props.shop, this.props.id, c).then(() => {
      this.setState({ count: c });
      this.props.updateCartInfo();
    });
  };

  removeMenu = () => CartApi.removeShopCartMenu(this.props.shop, this.props.id).then(() => this.props.updateCartInfo());
  selectOption = option => CartApi.updateOptionByCartInShop(this.props.shop, this.props.id, option).then(() => this.props.updateCartInfo());

  updateMenuCount = count => {
    const c = this.state.count + count;

    if (c <= 0) {
      Alert.alert("", "수량은 한개 이상을 선택해 주세요.");
      return 1;
    }

    return c;
  };

  render() {
    return (
      <View style={{ borderBottomColor: "#f1f3f5", borderBottomWidth: 10 }}>
        <View style={{ padding: 20, borderBottomColor: "#dee2e6", borderBottomWidth: 1, flexDirection: "row" }}>
          <Image
            style={{ width: 70, height: 70, borderRadius: 3, marginRight: 15 }}
            source={{ uri: "https://api.mubabot.com/static/" + (this.state.URL ? "menu/" + this.state.URL : "public/img/noimage.png") }}
          />

          <View style={{ width: "100%" }}>
            <Text style={{ color: "#212529", fontSize: textResizing(22), lineHeight: 35 }}>{this.state.MENUNAME}</Text>
            <View style={this.state.shop_menu_options.length !== 0 ? { borderBottomColor: "#dee2e6", borderBottomWidth: 1, paddingBottom: 20 } : {}}>
              <View>
                <View style={{ flexDirection: "row", height: 35, alignItems: "center" }}>
                  <Text
                    style={[
                      this.state.sales[0]
                        ? { fontSize: textResizing(15), color: "#868e96", textDecorationLine: "line-through" }
                        : { fontSize: textResizing(16), color: "#212529", fontWeight: "bold" }
                    ]}
                  >
                    {accounting.formatMoney(this.state.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
                  </Text>
                  {this.state.sales[0] ? (
                    <Text style={{ fontSize: textResizing(16), color: "#212529", fontWeight: "bold", marginLeft: 3, marginRight: 3 }}>
                      {accounting.formatMoney(this.state.sales[0].PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
                    </Text>
                  ) : null}
                </View>

                {this.state.sales[0] && this.state.sales[0].COUNT !== 0 ? (
                  <Text style={{ fontSize: textResizing(16), color: "#212529", marginTop: -10 }}>({this.state.sales[0].COUNT}개 남음)</Text>
                ) : null}
              </View>
            </View>

            <View style={{ marginTop: this.state.shop_menu_options.length === 0 ? 0 : 20 }}>
              {this.state.shop_menu_options.map((v, i) => (
                <View key={v._id} style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
                  <TouchableWithoutFeedback onPress={() => this.selectOption(v._id)}>
                    <View
                      style={{
                        borderWidth: 1,
                        width: 20,
                        height: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: this.state.options[v._id] ? "#468ef7" : "#dee2e6",
                        marginRight: 7
                      }}
                    >
                      <SvgImage
                        source={require("assets/icons/icon-check-select.svg")}
                        style={{ width: 12, height: 12, display: !this.state.options[v._id] ? "none" : "flex" }}
                      />
                      <SvgImage
                        source={require("assets/icons/icon-check.svg")}
                        style={{ width: 12, height: 12, display: this.state.options[v._id] ? "none" : "flex" }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={{ color: "#212529", fontWeight: "bold", marginRight: 5 }}>{v.shop_option.OPTIONNAME}</Text>
                  <Text style={{ color: "#212529", fontWeight: "bold" }}>
                    {accounting.formatMoney(v.shop_option.PRICE, { symbol: "원", format: "%v%s", precision: 0 })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={{ position: "absolute", top: 11, right: 11 }}>
          <TouchableWithoutFeedback onPress={() => this.removeMenu()}>
            <View>
              <SvgImage source={require("assets/icons/icon-close-s.svg")} style={{ width: 12, height: 12 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ flexDirection: "row", position: "absolute", top: 50, right: 20, borderWidth: 1, borderColor: "#dee2e6" }}>
          <TouchableWithoutFeedback onPress={() => this.countMenu(-1)}>
            <View style={{ width: 30, height: 30, backgroundColor: "#f8f9fa", justifyContent: "center", alignItems: "center" }}>
              <Text>-</Text>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: 30,
              height: 30,
              borderLeftWidth: 1,
              borderLeftColor: "#dee2e6",
              borderRightWidth: 1,
              borderRightColor: "#dee2e6",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>{this.state.count}</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => this.countMenu(1)}>
            <View style={{ width: 30, height: 30, backgroundColor: "#f8f9fa", justifyContent: "center", alignItems: "center" }}>
              <Text>+</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* <Text>{JSON.stringify(this.props)}</Text> */}
        {/* <Text>{JSON.stringify(this.props.menu)}</Text> */}
        {/* <Text>{JSON.stringify(this.state.shop_menu_options)}</Text> */}
      </View>
    );
  }
}
