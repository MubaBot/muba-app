import React, { Component } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback } from "react-native";

import Image from "react-native-remote-svg";

import { RadioGroup, RadioButton } from "@/components/lib/RadioButton";
import DatePicker from "@/components/DatePicker";

import CONFIG, { textResizing, marginResizing } from "@/config";

const genderList = [{ label: "선택 안함", value: null }, { label: "남", value: true }, { label: "여", value: false }];

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: props.phone || "",
      name: props.name || "",
      gender: this.convertGender(props.gender),
      year: props.year,
      month: props.month,
      day: props.day
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.state.phone !== nextProps.phone) this.setState({ phone: nextProps.phone || "" });
    if (this.state.name !== nextProps.name) this.setState({ name: nextProps.name || "" });
    if (this.state.gender !== this.convertGender(nextProps.gender)) this.setState({ gender: this.convertGender(nextProps.gender) });

    if (this.state.year !== nextProps.year) this.setState({ year: nextProps.year });
    if (this.state.month !== nextProps.month) this.setState({ month: nextProps.month });
    if (this.state.day !== nextProps.day) this.setState({ day: nextProps.day });
  };

  convertGender = gender => {
    gender = gender === "1" ? true : gender;
    gender = gender === "0" ? false : gender;

    switch (gender) {
      case true:
        return 1;
      case false:
        return 2;
      case null:
      default:
        return 0;
    }
  };

  clearPhone = () => {
    this.phone.clear();
    this.props.setPhone("");
  };

  clearName = () => {
    this.name.clear();
    this.props.setName("");
  };

  updateYear = year => this.props.setBirth(year, this.state.month, this.state.day);
  updateMonth = month => this.props.setBirth(this.state.year, month, this.state.day);
  updateDay = day => this.props.setBirth(this.state.year, this.state.month, day);

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: textResizing(30) }}>이름을 입력하세요</Text>

        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 2,
            borderBottomColor: "#212529",
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 5,
            marginBottom: 15
          }}
        >
          <View style={{ flex: 4 }}>
            <TextInput
              ref={ref => (this.name = ref)}
              style={{ fontSize: textResizing(30), padding: 0 }}
              underlineColorAndroid="transparent"
              onFocus={() => this.props.focusKeyboard("profile", "in")}
              onBlur={() => this.props.focusKeyboard("profile", "out")}
              onChangeText={this.props.setName}
              value={this.state.name}
              placeholder="무바봇"
            />
          </View>
          <View style={{ flex: 1, marginRight: -45, display: this.state.name !== "" ? "flex" : "none" }}>
            <TouchableWithoutFeedback onPress={this.clearName}>
              <View>
                <Image source={require("assets/icons/m-close.svg")} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <Text style={{ fontSize: textResizing(30) }}>전화번호를 입력하세요</Text>

        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 2,
            borderBottomColor: "#212529",
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 5
          }}
        >
          <View style={{ flex: 4 }}>
            <TextInput
              ref={ref => (this.phone = ref)}
              underlineColorAndroid="transparent"
              style={{ fontSize: textResizing(30), padding: 0 }}
              onFocus={() => this.props.focusKeyboard("profile", "in")}
              onBlur={() => this.props.focusKeyboard("profile", "out")}
              onChangeText={this.props.setPhone}
              value={this.state.phone}
              textContentType="telephoneNumber"
              placeholder="010-1234-5678"
            />
          </View>
          <View style={{ flex: 1, marginRight: -45, display: this.state.phone !== "" ? "flex" : "none" }}>
            <TouchableWithoutFeedback onPress={this.clearPhone}>
              <View>
                <Image source={require("assets/icons/m-close.svg")} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={{ marginTop: 15, marginBottom: 5, flex: 1, flexDirection: "row" }}>
          <Text style={{ fontSize: textResizing(20) }}>성별 : </Text>

          <RadioGroup selectedIndex={this.state.gender} onSelect={(i, v) => this.props.setGender(v)} style={{ flex: 1, flexDirection: "row", marginTop: -10 }}>
            {genderList.map((x, i) => (
              <RadioButton key={i} value={x.value} color="#468ef7" activeColor="#000" borderColor="#bababa">
                <Text style={{ fontSize: textResizing(20) }}>{x.label}</Text>
              </RadioButton>
            ))}
          </RadioGroup>
        </View>
        <View style={{ marginTop: 5, marginBottom: 5, flex: 1, flexDirection: "row" }}>
          <Text style={{ fontSize: textResizing(20) }}>생일 : </Text>
          <DatePicker
            year={this.state.year}
            month={this.state.month}
            day={this.state.day}
            updateYear={this.updateYear}
            updateMonth={this.updateMonth}
            updateDay={this.updateDay}
          />
        </View>
      </View>
    );
  }
}
