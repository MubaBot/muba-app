import { AsyncStorage } from "react-native";
import { removeUserInfo } from "./user";

import StorageKeys from "./index";

const setAuthentication = async authentication => {
  return AsyncStorage.setItem(StorageKeys.authenticationKey, authentication);
};

const getAuthentication = async () => {
  return AsyncStorage.getItem(StorageKeys.authenticationKey);
};

const removeAuthentication = async () => {
  return AsyncStorage.removeItem(StorageKeys.authenticationKey).then(() => removeUserInfo());
};

const isLogin = async () => {
  return AsyncStorage.getItem(StorageKeys.authenticationKey).then(auth => (auth ? true : false));
};

export { setAuthentication, getAuthentication, removeAuthentication, isLogin };
