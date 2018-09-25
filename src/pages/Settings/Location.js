import React, { Component } from "react";
import { View } from "react-native";
import { Label, Button } from "native-base";

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      location: ''
    }
  }

  onSetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(JSON.stringify(position));
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  render() {
    return (
      <View>
        <Label value={this.state.location}>Location</Label>
        <Button onPress={this.onSetLocation}><Label>재설정</Label></Button>
      </View>
    );
  }
}
