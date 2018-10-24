import React, { Component } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback } from "react-native";

import Image from "react-native-remote-svg";

// import DatePicker from "react-native-datepicker";
// import RadioForm from "react-native-simple-radio-button";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: props.phone
    };
  }

  componentWillReceiveProps = nextProps => this.setState({ phone: nextProps.phone });

  clearPhone = () => {
    this.phone.clear();
    this.props.setPhone("");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 30 }}>전화번호를 입력하세요</Text>

        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 2,
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 5
          }}
        >
          <View style={{ flex: 4 }}>
            <TextInput
              ref={ref => (this.phone = ref)}
              style={{ fontSize: 30 }}
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
          <Text style={{ fontSize: 20 }}>성별 : </Text>

          {/* <RadioForm
            radio_props={[{ label: "선택 안함", value: 0 }, { label: "남", value: 1 }, { label: "여", value: 2 }]}
            initial={0}
            formHorizontal={true}
            onPress={value => this.setState({ value: value })}
          /> */}
        </View>
        <View style={{ marginTop: 5, marginBottom: 5, flex: 1, flexDirection: "row" }}>
          <Text style={{ fontSize: 20 }}>생일 : </Text>
          {/* <DatePicker
            style={{ width: 200, flex: 1 }}
            date={this.state.date}
            mode="date"
            placeholder="날짜 선택"
            format="YYYY년 MM월 DD일"
            confirmBtnText="선택"
            cancelBtnText="취소"
            showIcon={false}
            allowFontScaling={true}
            customStyles={{
              dateInput: { padding: 0, marginTop: -20, borderWidth: 0, justifyContent: "flex-start" },
              placeholderText: { marginTop: 10, fontSize: 20, padding: 0, textAlign: "left" },
              dateText: { marginTop: 10, fontSize: 20, padding: 0, textAlign: "left" },
              btnTextConfirm: { color: "#468ef7" }
            }}
            onDateChange={date => {
              this.setState({ date: date });
            }}
          /> */}
        </View>
      </View>
    );
  }
}
