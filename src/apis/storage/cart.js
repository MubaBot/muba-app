import { AsyncStorage } from "react-native";
import moment from "moment";

import StorageKeys from "./index";

const addShopCart = async (shop, item) => {
  if (item.SOLD) return false;
  let cart = await getShopCart(shop);
  const newItem = { id: await getCartCount(), item: item, count: 1 };
  cart.push(newItem);

  await updateCartByShop(shop, cart);
  return newItem;
};

const updateCartByShop = async (shop, items) => {
  let cart = await getAllCart();
  cart[shop] = { time: moment().unix(), cart: items };

  return AsyncStorage.setItem(StorageKeys.cartStorageKey, JSON.stringify(cart));
};

const updateItemByCartInShop = async (shop, item, value) => {
  let cart = await getAllCart();
  let carts = cart[shop] ? cart[shop].cart : [];

  for (var i in carts) if (carts[i].id === item) carts[i] = value;

  cart[shop] = { time: moment().unix(), cart: carts };

  return AsyncStorage.setItem(StorageKeys.cartStorageKey, JSON.stringify(cart));
};

const updateCountByCartInShop = async (shop, item, count) => {
  let cart = await getAllCart();
  let items = (cart[shop] ? cart[shop].cart : []).filter((v, i) => v.id === item);

  if (items.length === 0) return null;

  items[0].count = count;
  return updateItemByCartInShop(shop, item, items[0]);
};

const updateOptionByCartInShop = async (shop, item, option) => {
  let cart = await getAllCart();
  let items = (cart[shop] ? cart[shop].cart : []).filter((v, i) => v.id === item);

  if (items.length === 0) return null;

  let options = items[0].options || {};
  options[option] = options[option] ? false : true;

  items[0].options = options;

  return updateItemByCartInShop(shop, item, items[0]);
};

const getShopCart = async shop => {
  const cart = await getAllCart();

  return cart[shop] && cart[shop].cart ? cart[shop].cart : [];
};

const getAllCart = async () => {
  return JSON.parse((await AsyncStorage.getItem(StorageKeys.cartStorageKey)) || "{}");
};

const getCartCount = async () => {
  const count = JSON.parse((await AsyncStorage.getItem(StorageKeys.cartCountStorageKey)) || "0");

  await AsyncStorage.setItem(StorageKeys.cartCountStorageKey, JSON.stringify(count + 1));
  return count;
};

const removeShopCartMenu = async (shop, id) => {
  let cart = await getShopCart(shop);

  const result = cart.filter(item => item.id !== id);
  return updateCartByShop(shop, result);
};

const clearCart = async shop => {
  return updateCartByShop(shop, []);
};

const resetCart = async () => {
  return AsyncStorage.removeItem(StorageKeys.cartStorageKey);
};

export { addShopCart, updateCountByCartInShop, updateOptionByCartInShop, getAllCart, getShopCart, removeShopCartMenu, clearCart, resetCart };
