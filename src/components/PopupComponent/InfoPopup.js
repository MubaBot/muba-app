import React, { Component } from "react";

import InfoContainer from "components/Info";
import PopupComponent from "./PopupComponent";

export default class InfoPopup extends Component {
  render() {
    return (
      <PopupComponent hide={this.props.hide === true ? true : false} onClose={this.props.onClose}>
        <InfoContainer {...this.props} />
      </PopupComponent>
    );
  }
}
