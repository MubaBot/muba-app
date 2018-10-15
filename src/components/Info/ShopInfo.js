import React, { Component } from "react";
import { View } from "react-native";
import { List, ListItem, Text, Button } from "native-base";

import { Shop, CartApi } from "@/apis";

export default class ShopInfo extends Component {
  state = {
    SHOPNAME: "",
    ADDRESS: "",
    PHONE: ""
  };

  componentDidMount = () => this.props.updateShopInfo();

  addCart = menu => CartApi.addShopCart(this.props.id, menu).then(() => this.props.updateCartInfo());
  clearCart = () => CartApi.clearCart(this.props.id).then(() => this.props.updateCartInfo());

  render() {
    return (
      <View style={{ marginBottom: 210 }}>
        <List>
          <ListItem itemDivider>
            <Text>정보</Text>
          </ListItem>
          <ListItem>
            <Text>이름 : {this.props.SHOPNAME}</Text>
          </ListItem>
          <ListItem>
            <Text>주소 : {this.props.ADDRESS}</Text>
          </ListItem>
          <ListItem>
            <Text>전화번호 : {this.props.PHONE}</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>메뉴</Text>
          </ListItem>

          {this.props.MENUS.map((x, i) => (
            <View key={i}>
              <ListItem onPress={() => this.addCart(x)}>
                <Text style={x.SOLD ? { textDecorationLine: "line-through" } : {}}>{x.MENUNAME} </Text>
                <Text>{x.SOLD ? "(품절) " : ""}- </Text>
                <Text style={x.sales.length ? { textDecorationLine: "line-through" } : {}}>{x.PRICE}원</Text>
                {x.sales.length ? (
                  <Text>
                    {" "}
                    {x.sales[0].PRICE}원 ({x.sales[0].COUNT}개 한정)
                  </Text>
                ) : null}
              </ListItem>
              {x.shop_menu_options.map((ox, oi) => (
                <ListItem key={oi}>
                  <Text>
                    {"        "}
                    {ox.shop_option.OPTIONNAME} - {ox.shop_option.PRICE}원
                  </Text>
                </ListItem>
              ))}
            </View>
          ))}
        </List>
        <Button onPress={this.props.goNext}>
          <Text>{this.props.cartLength} 주문하기</Text>
        </Button>
        <Button onPress={this.clearCart}>
          <Text>장바구니 비우기</Text>
        </Button>
      </View>
    );
  }
}
