import React, { Component } from "react";

import ReviewContainer from "@/components/Review";
import PopupComponent from "./PopupComponent";

export default class ReviewPopup extends Component {
  render() {
    return (
      <PopupComponent hide={this.props.hide === true ? true : false} onClose={this.props.onClose}>
        <ReviewContainer {...this.props} />
      </PopupComponent>
    );
  }
}
