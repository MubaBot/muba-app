import { AsyncStorage } from "react-native";

import StorageKeys from "./index";

const setUserInfo = async user => {
  return AsyncStorage.setItem(StorageKeys.userStorageKey, JSON.stringify(user));
};

const getUserInfo = async () => {
  return JSON.parse(await AsyncStorage.getItem(StorageKeys.userStorageKey));
};

const removeUserInfo = async () => {
  return AsyncStorage.removeItem(StorageKeys.userStorageKey);
};

const setAddressForDevice = async ({ road_address, address_name, detail_address, lat, lng }) => {
  return AsyncStorage.setItem(StorageKeys.addressStorageKey, JSON.stringify({ road_address, address_name, detail_address, lat, lng }));
};

const getAddressForDevice = async () => {
  return JSON.parse(await AsyncStorage.getItem(StorageKeys.addressStorageKey));
};

export { setUserInfo, getUserInfo, removeUserInfo, setAddressForDevice, getAddressForDevice };
