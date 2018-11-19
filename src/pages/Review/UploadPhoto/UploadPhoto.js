import React, { Component } from "react";
import { TouchableWithoutFeedback, ScrollView, View, Text, CameraRoll, Alert, Image, Dimensions } from "react-native";

import Svg from "react-native-remote-svg";

import LoadingContainer from "@/components/LoadingContainer";

const deviceWidth = Dimensions.get("window").width;
const pageCount = 18;

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class UploadPhoto extends Component {
  state = { count: 0, photos: [], page: 1, selectedPhotos: {} };

  componentWillReceiveProps = nextProps => {
    if (nextProps.open) {
      CameraRoll.getPhotos({
        first: pageCount,
        assetType: "Photos"
      })
        .then(r => this.setState({ photos: r.edges, page: this.state.page + 1 }))
        .catch(err => Alert.alert("사진 권한을 확인해주세요."));
    } else {
      this.setState({ count: 0, photos: [], page: 1, selectedPhotos: {} });
    }
  };

  uploadPhotos = () => {
    if (this.state.count <= 0) return Alert.alert("사진을 선택해주세요.");

    const photos = this.state.photos.filter((v, i) => this.state.selectedPhotos[i]);
    this.props.selectPhotos(photos);
    this.props.closeUploadPopup();
  };

  selectPhoto = id => {
    let { selectedPhotos } = this.state;

    selectedPhotos[id] = selectedPhotos[id] === true ? false : true;
    this.setState({ selectedPhotos: selectedPhotos, count: this.state.count + (selectedPhotos[id] === true ? 1 : -1) });
  };

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y) {
      CameraRoll.getPhotos({
        first: pageCount * this.state.page,
        assetType: "Photos"
      })
        .then(r => this.setState({ photos: r.edges, page: this.state.page + 1 }))
        .catch(err => {
          //Error Loading Images
        });
    }
  };

  render() {
    return (
      <LoadingContainer loading={false}>
        <View
          style={{
            height: 50,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#e9ecef"
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingLeft: 30, paddingRight: 30 }}>
            <TouchableWithoutFeedback onPress={this.props.closeUploadPopup}>
              <View>
                <Svg source={require("assets/icons/m-prev.svg")} style={{ width: 20, height: 20 }} />
              </View>
            </TouchableWithoutFeedback>

            <Text style={{ fontSize: textResizing(25), fontWeight: "bold", color: "#212529" }}>모든 사진</Text>

            <TouchableWithoutFeedback onPress={this.uploadPhotos}>
              <View>
                <Text>{this.state.count}개 선택</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <ScrollView onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {this.state.photos.map((p, i) => (
              <TouchableWithoutFeedback key={i} onPress={() => this.selectPhoto(i)}>
                <View style={{ width: "33%", height: deviceWidth / 3, marginBottom: 2, backgroundColor: "#FFF" }}>
                  <View
                    style={{
                      position: "absolute",
                      right: 6,
                      top: 6,
                      zIndex: this.state.selectedPhotos[i] === true ? 999 : 0,
                      backgroundColor: this.state.selectedPhotos[i] === true ? "rgba(0,0,0,0.5)" : "#FFF",
                      borderRadius: 15,
                      padding: 5
                    }}
                  >
                    <Svg source={require("assets/icons/icon-check-v.svg")} style={{ width: 15, height: 15 }} />
                  </View>
                  <Image style={{ width: "100%", height: "100%" }} source={{ uri: p.node.image.uri }} />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
      </LoadingContainer>
    );
  }
}
