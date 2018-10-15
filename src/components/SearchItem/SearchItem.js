import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem, Body, Text, Label, Grid, Row, Col, Button } from "native-base";
import { Rating } from "react-native-elements";

import call from "react-native-phone-call";

import DaumMap from "@/components/DaumMap";

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: 150,
    marginTop: 5
  }
});

export default class SearchItem extends Component {
  render() {
    return (
      <ListItem style={{ flex: 1 }}>
        <Grid>
          <Row>
            <Col>
              <Label>{this.props.SHOPNAME}</Label>
              <Rating startingValue={1.2} readonly={true} style={{ paddingVertical: 10 }} imageSize={30} />
            </Col>
          </Row>

          <Row>
            <Col>
              <TouchableOpacity
                // onPress={() => (this.props.onPressMap ? this.props.onPressMap() : null)}
                onPressIn={this.props.onPressMapBegin}
                onPressOut={this.props.onPressMapEnd}
              >
                <View style={styles.view} hide={true}>
                  <DaumMap
                    name={this.props.SHOPNAME}
                    id={this.props._id}
                    address={this.props.shop_address.ADDRESS}
                    lat={this.props.shop_address.ADDRLAT}
                    lng={this.props.shop_address.ADDRLNG}
                  />
                </View>
              </TouchableOpacity>
            </Col>
          </Row>

          <Body>
            <Button onPress={() => this.props.showShopInfo(this.props._id)}>
              <Text>메뉴/정보</Text>
            </Button>
            <Button onPress={() => this.props.showShopReview(this.props._id)}>
              <Text>리뷰</Text>
            </Button>
            {this.props.PHONE ? (
              // <Button onPress={() => this.props.showShopOrder(this.props._id)}>
              <Button onPress={() => call({ number: this.props.PHONE, prompt: true })}>
                <Text>전화 주문</Text>
              </Button>
            ) : null}
          </Body>
        </Grid>
      </ListItem>
    );
  }
}
