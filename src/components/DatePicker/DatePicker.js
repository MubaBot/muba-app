import React, { Component } from "react";
import { View, Text } from "react-native";

import PickerSelect from "@/components/lib/PickerSelect";

import { range } from "lodash";

import moment from "moment";
import "moment/locale/ko";

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: props.year,
      month: props.month,
      day: props.day
    };
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      year: nextProps.year,
      month: nextProps.month,
      day: nextProps.day
    });
  };

  render() {
    const maxYear = parseInt(moment(moment()).format("YYYY"));

    return (
      <View style={{ flexDirection: "row" }}>
        <PickerSelect
          doneText="확인"
          placeholder={{ label: `${maxYear}년`, value: maxYear }}
          items={range(1900, maxYear)
            .reverse()
            .map(v => ({ label: `${v}년`, value: v }))}
          onValueChange={this.props.updateYear ? this.props.updateYear : year => this.setState({ year })}
          value={this.state.year}
        >
          <Text style={{ fontSize: textResizing(20), marginLeft: 10 }}>{this.state.year}년</Text>
        </PickerSelect>

        <PickerSelect
          doneText="확인"
          placeholder={{ label: "12월", value: 12 }}
          items={range(1, 12)
            .reverse()
            .map(v => ({ label: `${v}월`, value: v }))}
          onValueChange={this.props.updateMonth ? this.props.updateMonth : month => this.setState({ month })}
          value={this.state.month}
        >
          <Text style={{ fontSize: textResizing(20), marginLeft: 10 }}>{this.state.month}월</Text>
        </PickerSelect>

        <PickerSelect
          doneText="확인"
          placeholder={{ label: "31일", value: 31 }}
          items={range(1, 31)
            .reverse()
            .map(v => ({ label: `${v}일`, value: v }))}
          onValueChange={this.props.updateDay ? this.props.updateDay : day => this.setState({ day })}
          value={this.state.day}
        >
          <Text style={{ fontSize: textResizing(20), marginLeft: 10 }}>{this.state.day}일</Text>
        </PickerSelect>
      </View>
    );
  }
}
