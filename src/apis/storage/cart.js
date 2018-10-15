import { AsyncStorage } from "react-native";

import StorageKeys from "./index";

const addShopCart = async (shop, item) => {
  if (item.SOLD) return false;
  let cart = await getShopCart(shop);
  cart.push({ id: await getCartCount(), item: item });

  return updateCartByShop(shop, cart);
};

const updateCartByShop = async (shop, items) => {
  let cart = await getAllCart();
  cart[shop] = items;

  return AsyncStorage.setItem(StorageKeys.cartStorageKey, JSON.stringify(cart));
};

const getShopCart = async shop => {
  const cart = await getAllCart();

  return cart[shop] || [];
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

export { addShopCart, getShopCart, removeShopCartMenu, clearCart };
