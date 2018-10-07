import React, { Component } from "react";

import DaumMapContainer from "@/components/DaumMap";
import PopupComponent from "./PopupComponent";

export default class DaumMapPopup extends Component {
  render() {
    return (
      <PopupComponent hide={this.props.hide === true ? true : false} onClose={this.props.onClose}>
        <DaumMapContainer {...this.props} />
      </PopupComponent>
    );
  }
}
