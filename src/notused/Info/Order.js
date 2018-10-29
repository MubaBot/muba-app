import React, { Component } from "react";
import { View, Alert } from "react-native";
import { List, ListItem, Text, Button, Input, Form, Item, Label } from "native-base";

import { UserApi, Shop, CartApi } from "@/apis";

export default class ShopInfo extends Component {
  constructor(props) {
    super(props);

    this.state = { cart: {}, address: "", require: "", phone: "" };
  }

  componentDidMount = () => this.syncAddress();

  componentWillReceiveProps = nextProps => {
    let cart = {};

    for (var i in nextProps.cart)
      cart[nextProps.cart[i].id] = {
        id: nextProps.cart[i].item._id,
        count: 1,
        options: {},
        price: nextProps.cart[i].item.sales.length ? nextProps.cart[i].item.sales[0].PRICE : nextProps.cart[i].item.PRICE
      };

    // alert(JSON.stringify(cart));

    this.setState({ cart: cart });
  };

  onChangeText = (name, text) => this.setState({ [name]: text });

  syncAddress = () =>
    UserApi.getAddressForDevice().then(address => {
      if (!address) return null;

      const existRoad = address.road_address !== "";
      const existAddr = address.address_name !== "";

      const addr = address.road_address + (existRoad && existAddr ? " (" : "") + address.address_name + (existRoad && existAddr ? ")" : "");

      this.setState({ address: [addr, address.detail_address].join(" ") });
    });

  countMenu = (id, count) => {
    const { cart } = this.state;
    this.setState({ cart: this.updateMenuCount(cart, id, count) });
  };

  updateMenuCount = (items, id, count) => {
    items[id].count += count;

    if (items[id].count <= 0) {
      Alert.alert("", "수량은 한개 이상을 선택해 주세요.");
      items[id].count = 1;
    }

    return items;
  };

  deleteMenu = id => {
    CartApi.removeShopCartMenu(this.props.id, id);
    const cart = this.state.cart;
    var newCart = {};

    for (var i in cart) if (parseInt(i) !== id) newCart[i] = cart[i];

    this.setState({ cart: newCart });
  };

  selectOption = (id, option) => {
    var cart = this.state.cart;
    if (cart[id]) cart[id].options[option] = cart[id].options[option] ? false : true;

    this.setState({ cart: cart });
  };

  clearCart = () => CartApi.clearCart(this.props.id).then(() => this.props.goBack());

  orderCart = () => {
    Shop.orderCart({ id: this.props.id, cart: this.state.cart, address: this.state.address, require: this.state.require, phone: this.state.phone }).then(
      res => {
        Alert.alert(`${res.data.price}원 입니다.`);
        this.clearCart();
      }
    );
  };

  render() {
    return (
      <View style={{ marginBottom: 210 }}>
        <Text>Order</Text>
        <Button onPress={this.props.goBack}>
          <Text>뒤로가기</Text>
        </Button>
        <List>
          {this.props.cart.map(
            (x, i) =>
              this.state.cart[x.id] ? (
                <View key={i}>
                  <ListItem>
                    <Text>{x.item.MENUNAME} - </Text>
                    <Text style={x.item.sales.length ? { textDecorationLine: "line-through" } : {}}>{x.item.PRICE}원</Text>
                    {x.item.sales.length ? (
                      <Text>
                        {" "}
                        {x.item.sales[0].PRICE}원 ({x.item.sales[0].COUNT}개 한정)
                      </Text>
                    ) : null}
                    <View>
                      <Button onPress={() => this.countMenu(x.id, -1)}>
                        <Text>-</Text>
                      </Button>
                      <Text>{this.state.cart[x.id].count}</Text>
                      <Button onPress={() => this.countMenu(x.id, 1)}>
                        <Text>+</Text>
                      </Button>
                      <Button onPress={() => this.deleteMenu(x.id)}>
                        <Text>삭제</Text>
                      </Button>
                    </View>
                  </ListItem>
                  {x.item.shop_menu_options.map((ox, oi) => (
                    <ListItem key={oi}>
                      <Text
                        onPress={() => this.selectOption(x.id, ox.OPTIONID)}
                        style={this.state.cart[x.id].options[ox.OPTIONID] ? { backgroundColor: "#999" } : {}}
                      >
                        {"    "}
                        {ox.shop_option.OPTIONNAME} - {ox.shop_option.PRICE}원
                      </Text>
                    </ListItem>
                  ))}
                </View>
              ) : null
          )}
        </List>
        <Form>
          <Item stackedLabel>
            <Label>주소</Label>
            <Input name="address" value={this.state.address} onChangeText={text => this.onChangeText("address", text)} />
          </Item>
          <Item stackedLabel>
            <Label>요구사항</Label>
            <Input name="require" value={this.state.require} onChangeText={text => this.onChangeText("require", text)} />
          </Item>
          <Item stackedLabel>
            <Label>전화번호</Label>
            <Input name="phone" value={this.state.phone} onChangeText={text => this.onChangeText("phone", text)} />
          </Item>
        </Form>

        <Button onPress={this.orderCart}>
          <Text>주문하기</Text>
        </Button>
      </View>
    );
  }
}
