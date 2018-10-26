import React, { Component } from "react";
import Muba from "./src/Routers";

if (!__DEV__) console.disableYellowBox = true;

export default class App extends Component {
  render() {
    return <Muba />;
  }
}
