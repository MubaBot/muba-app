import React, { Component } from "react";
import { ListItem, Thumbnail, Body, Text, Button } from "native-base";

import moment from "moment";

export default class Order extends Component {
  showMenus = () => {
    if (this.props.order_menus.length)
      return this.props.order_menus.map((x, i) => {
        return x.COUNT ? (
          <Text key={i}>
            {x.shop_menu.MENUNAME} {x.order_menu_options.length ? "(" + this.getOptions(x) + ") " : ""}- ({this.getPrice(x)}
            원, {x.COUNT}
            개)
          </Text>
        ) : null;
      });
    return <Text disabled>목록이 없습니다.</Text>;
  };

  getPrice = menu => {
    var price = menu.PRICE;
    for (var i in menu.order_menu_options) {
      const option = menu.order_menu_options[i];
      price += option.shop_menu_option.shop_option.PRICE;
    }

    return price;
  };

  getOptions = menu => {
    var options = [];
    for (var i in menu.order_menu_options) {
      const option = menu.order_menu_options[i];
      options.push(option.shop_menu_option.shop_option.OPTIONNAME);
    }

    return options.join(", ");
  };

  render() {
    return (
      <ListItem>
        <Body>
          <Text>{moment(this.props.createdAt).fromNow()}</Text>
          <Text>{this.props.ADDRESS}</Text>
          {this.showMenus()}

          {/* <Button onPress={() => this.props.showShopOrder(this.props.id)}>
            <Text>재주문</Text>
          </Button> */}
        </Body>
      </ListItem>
    );
  }
}
