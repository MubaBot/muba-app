import * as AuthStorage from "./auth";
import * as UserStorage from "./user";

const StorageKeys = {
  authenticationKey: "authentication",
  userStorageKey: "user",
  addressStorageKey: "address",
  cartStorageKey: "cart",
  cartCountStorageKey: "cartCount"
};

const clearAllData = async () => {
  for (var i in StorageKeys) await AsyncStorage.removeItem(StorageKeys[i]);
};

export { AuthStorage, UserStorage, clearAllData };

export default StorageKeys;
