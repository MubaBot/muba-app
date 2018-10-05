import React, { Component } from "react";
import { ListItem, Thumbnail, Body, Text, Button } from "native-base";

export default class Order extends Component {
  render() {
    return (
      <ListItem>
        <Thumbnail square size={80} source={{ uri: "Image URL" }} />
        <Body>
          <Text>2018. 08. 08</Text>
          <Text note>xx분식 떡볶이 2, 김말이 1, 오뎅 1, 콜라 대 1</Text>

          <Button onPress={() => this.props.showShopOrder(this.props.id)}>
            <Text>재주문</Text>
          </Button>
        </Body>
      </ListItem>
    );
  }
}
