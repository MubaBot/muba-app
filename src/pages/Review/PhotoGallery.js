import React, { Component } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import Gallery from "react-native-image-gallery";
import Svg from "react-native-remote-svg";

export default class PhotoGallery extends Component {
  state = { photos: [] };

  componentWillReceiveProps = nextProps => {
    let photos = [];
    for (var i in nextProps.photos) {
      const photo = nextProps.photos[i];
      photos.push({ source: { uri: ["https://api.mubabot.com", "static", "review", photo.URL].join("/") } });
    }

    this.setState({ photos: photos });
  };

  render() {
    return this.props.open ? (
      <View style={{ flex: 1 }}>
        <View style={{ position: "absolute", left: 30, top: 35, zIndex: 99999 }}>
          <TouchableWithoutFeedback onPress={this.props.closePopup}>
            <View>
              <Svg source={require("assets/icons/m-close-white.svg")} style={{ width: 20, height: 20 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Gallery style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }} images={this.state.photos} />
      </View>
    ) : (
      <View />
    );
  }
}
