import React, { Component } from "react";
import { Header, Body, Left, Right, Title, Icon, Content, Button, Text } from "native-base";

import LoadingContainer from "components/LoadingContainer";
import RouteButton from "components/RouteButton";

import { RecommendPopup } from "components/PopupComponent";

export default class Recommend extends Component {
  state = {
    loading: false,
    showPopup: false,
    skip: false
  };

  closeEvent = () => {
    this.setState({ showPopup: false });
  };

  showRecommendPopup = async ({ skip }) => {
    this.setState({ showPopup: true, skip: skip === true ? true : false, loading: true });
    this.setState({ loading: false });
  };

  render() {
    return (
      <LoadingContainer requireAuth={true} loading={this.state.loading}>
        <Header>
          <Left>
            <RouteButton transparent goBack={true}>
              <Icon name="arrow-back" />
            </RouteButton>
          </Left>
          <Body>
            <Title>Recommend</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ flex: 1, backgroundColor: "white" }}>
          <Button onPress={() => this.showRecommendPopup({ skip: false })}>
            <Text>오늘의 성향에 따른 추천</Text>
          </Button>

          <Button onPress={() => this.showRecommendPopup({ skip: true })}>
            <Text>주문내역에 따른 추천</Text>
          </Button>
        </Content>
        <RecommendPopup hide={!this.state.showPopup} skip={this.state.skip} onClose={this.closeEvent} />
      </LoadingContainer>
    );
  }
}
