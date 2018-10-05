import React, { Component } from "react";

import RecommendContainer from "components/Recommend";
import PopupComponent from "./PopupComponent";

export default class RecommendPopup extends Component {
  render() {
    return (
      <PopupComponent hide={this.props.hide === true ? true : false} onClose={this.props.onClose}>
        <RecommendContainer {...this.props} />
      </PopupComponent>
    );
  }
}
