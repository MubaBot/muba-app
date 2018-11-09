import { AsyncStorage, Alert } from "react-native";

import StorageKeys from "./index";

const CONFIG = {
  TYPE_LOADING: -1,
  TYPE_NORMAL: 0,
  TYPE_SERACH: 1,

  BOT_ID: -1,
  BOT_NAME: "무 바"
};

const makeChat = async ({ text, userId, name, createdAt, type }) => {
  const chatId = await getChatCount();
  return {
    _id: chatId,
    text: text,
    createdAt: createdAt,
    user: {
      _id: userId,
      name: name
    },
    type: type
  };
};

const saveMessage = async (id, text, type = CONFIG.TYPE_NORMAL, createdAt = new Date()) => {
  let msg = await getChatMessage();

  var name = "User";

  if (id === CONFIG.BOT_ID) {
    name = CONFIG.BOT_NAME;
  }

  const chat = await makeChat({
    text,
    userId: id,
    name,
    createdAt: createdAt ? createdAt : new Date(),
    type: type ? type : CONFIG.TYPE_NORMAL
  });
  const c = [chat].concat(msg);

  return AsyncStorage.setItem(StorageKeys.chatStorageKey, JSON.stringify(c))
    .then(() => chat)
    .catch(() => false);
};

const getChatMessage = async () => {
  return AsyncStorage.getItem(StorageKeys.chatStorageKey).then(msg => {
    if (msg) return JSON.parse(msg).filter((i, n) => i.type !== CONFIG.TYPE_LOADING);
    return [];
  });
};

const getChatCount = async () => {
  const count = await AsyncStorage.getItem(StorageKeys.chatCountStorageKey);
  let c = 0;
  if (count) c = JSON.parse(count) + 1;

  AsyncStorage.setItem(StorageKeys.chatCountStorageKey, JSON.stringify(c));
  return c;
};

const clearChat = async () => {
  var result = null;
  Alert.alert("채팅 기록을 지우시겠습니까?", "", [{ text: "예", onPress: () => (result = true) }, { text: "아니오", onPress: () => (result = false) }], {
    cancelable: false
  });

  while (result === null) await new Promise((resolve, reject) => setTimeout(() => resolve(), 100));

  if (result === true) {
    await AsyncStorage.removeItem(StorageKeys.chatStorageKey);
    await AsyncStorage.removeItem(StorageKeys.chatCountStorageKey);
    return Promise.resolve(true);
  }

  return Promise.reject(false);
};

const removeChatMessage = async id => {
  const messages = (await getChatMessage()).filter((i, n) => {
    const e = i._id === id;
    if (e) exist = true;
    return !e;
  });

  return AsyncStorage.setItem(StorageKeys.chatStorageKey, JSON.stringify(messages))
    .then(() => messages)
    .catch(() => false);
};

export { CONFIG, saveMessage, getChatMessage, getChatCount, clearChat, removeChatMessage };
