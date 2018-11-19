import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, TextInput, Image } from "react-native";

import { Rating } from "react-native-elements";
import Svg from "react-native-remote-svg";

import { debounce } from "lodash";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class Write extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ratingPopup: false,
      POINT: 5,
      TEXT: ""
    };

    this.updateRating = debounce(this.updateRating, 100);
  }

  handleUpdate = rating => {
    this.setState({ POINT: rating });
    this.updateRating();
  };

  showRatingPopup = () => {
    this.setState({ ratingPopup: true });
    this.props.scrollToggle();
  };

  updateRating = () => {
    this.setState({ ratingPopup: false });
    this.props.scrollToggle();
  };

  render() {
    return (
      <View>
        <View style={{ borderBottomColor: "#dee2e6", borderBottomWidth: 1, padding: 20 }}>
          <Text style={{ color: "#212529", fontWeight: "bold", fontSize: textResizing(24), marginBottom: 10 }}>리뷰쓰기</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <TouchableWithoutFeedback onPress={this.showRatingPopup}>
                <View>
                  {this.state.ratingPopup === false ? (
                    <Rating startingValue={this.state.POINT} style={{ marginTop: 1 }} readonly={true} imageSize={12} />
                  ) : null}
                </View>
              </TouchableWithoutFeedback>
              {this.props.photos.length === 0 ? (
                <Text style={{ color: "#868e96" }}>사진이 없습니다.</Text>
              ) : (
                <View style={{ flexDirection: "row", marginTop: 3 }}>
                  {this.props.photos.map((p, i) => (
                    <TouchableWithoutFeedback key={i} onPress={() => this.selectPhoto(i)}>
                      <View style={{ width: 30, height: 30, marginRight: 2 }}>
                        <Image style={{ width: "100%", height: "100%" }} source={{ uri: p.node.image.uri }} />
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </View>
              )}
            </View>
            <TouchableWithoutFeedback onPress={this.props.uploadPhoto}>
              <View>
                <Svg source={require("assets/icons/icon-photo-upload.svg")} style={{ width: 24, height: 24 }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginTop: 7, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <TextInput
              style={{ width: "85%", padding: 0 }}
              underlineColorAndroid="transparent"
              multiline={true}
              onChangeText={TEXT => this.setState({ TEXT })}
              placeholder="내용을 입력해주세요."
            />
            <TouchableWithoutFeedback onPress={() => this.props.writeReview(this.state.TEXT, this.state.POINT)}>
              <View style={{ width: "10%", marginTop: 20, borderRadius: 3, backgroundColor: "#468ef7", alignItems: "center", paddingVertical: 5 }}>
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>작성</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Rating Popup */}
        {this.state.ratingPopup === true ? (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Rating startingValue={this.state.POINT} fractions={1} onFinishRating={this.handleUpdate} onStartRating={this.handleUpdate} imageSize={50} />
          </View>
        ) : null}
      </View>
    );
  }
}
