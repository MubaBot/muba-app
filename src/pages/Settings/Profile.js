import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";

import DatePicker from "react-native-datepicker";
import RadioForm from "react-native-simple-radio-button";

export default class Profile extends Component {
  state = {
    phone: ""
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 30 }}>전화번호를 입력하세요</Text>

        <View
          style={{
            borderBottomWidth: 2,
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 5
          }}
        >
          <TextInput
            style={{ fontSize: 30 }}
            onFocus={() => this.props.focusKeyboard("profile", "in")}
            onBlur={() => this.props.focusKeyboard("profile", "out")}
            onChangeText={text => null}
            value={this.state.phone}
            placeholder="010-1234-5678"
          />
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
