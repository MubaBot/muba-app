import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Content, Button, Text } from "native-base";

import Swiper from "@/components/Swiper";

import Tendency from "./Tendency";
import Search from "./Search";

export default class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = { index: props.skip === true ? 1 : 0 };
  }

  componentWillReceiveProps = nextProps => this.setState({ index: nextProps.skip === true ? 1 : 0 });
  scrollToTop = () => this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
  goNext = () => {
    this.swiper.scrollBy(1, true);
    this.scrollToTop();
  };

  goBack = () => {
    this.swiper.scrollBy(-1, true);
    this.scrollToTop();
  };

  render() {
    return (
      <ScrollView ref={r => (this.scrollView = r)} scrollEnabled={false}>
        <Swiper ref={r => (this.swiper = r)} stlye={{ flex: 1 }} scrollEnabled={false} showsButtons={false} loop={false} showsPagination={false} autoplay={false} index={this.state.index}>
          <Content style={{ flex: 1 }}>
            <Tendency />
            <Button onPress={this.goNext}>
              <Text>메뉴 추천</Text>
            </Button>
          </Content>
          <Content style={{ flex: 1 }}>
            <Search skip={this.props.skip} goBack={this.goBack} />
          </Content>
        </Swiper>
      </ScrollView>
    );
  }
}
