import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem, Body, Text, Label, Grid, Row, Col, Button } from "native-base";
import { Rating } from "react-native-elements";

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: 150,
    marginTop: 5
  }
});

import DaumMap from "@/components/DaumMap";

export default class SearchItem extends Component {
  render() {
    return (
      <ListItem style={{ flex: 1 }}>
        <Grid>
          <Row>
            <Col>
              <Label>Title</Label>
              <Rating startingValue={1.2} readonly={true} style={{ paddingVertical: 10 }} imageSize={30} />
            </Col>
          </Row>

          <Row>
            <Col>
              <TouchableOpacity onPress={() => (this.props.onPressMap ? this.props.onPressMap() : null)} onPressIn={this.props.onPressMapBegin} onPressOut={this.props.onPressMapEnd}>
                <View style={styles.view}>
                  <DaumMap />
                </View>
              </TouchableOpacity>
            </Col>
          </Row>

          <Body>
            <Button onPress={() => this.props.showShopInfo(this.props.id)}>
              <Text>메뉴/정보</Text>
            </Button>
            <Button onPress={() => this.props.showShopReview(this.props.id)}>
              <Text>리뷰</Text>
            </Button>
            <Button onPress={() => this.props.showShopOrder(this.props.id)}>
              <Text>주문</Text>
            </Button>
          </Body>
        </Grid>
      </ListItem>
    );
  }
}
