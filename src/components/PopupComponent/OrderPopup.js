import React, { Component } from "react";

import OrderContainer from "components/Order";
import PopupComponent from "./PopupComponent";

export default class OrderPopup extends Component {
  render() {
    return (
      <PopupComponent hide={this.props.hide === true ? true : false} onClose={this.props.onClose}>
        <OrderContainer {...this.props} />
      </PopupComponent>
    );
  }
}
