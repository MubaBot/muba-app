import { Platform, Dimensions } from "react-native";

const TEXT_SIZE = Platform.OS === "ios" ? 1 : Dimensions.get("window").width / 600;
const MARGIN_SIZE = Platform.OS === "ios" ? 1 : Dimensions.get("window").width / 650;

const CONFIG = {
  TEXT_SIZE,
  MARGIN_SIZE
};

const textResizing = size => Math.round(size * TEXT_SIZE);
const marginResizing = size => Math.round(size * MARGIN_SIZE);

export { textResizing, marginResizing };

export default CONFIG;
