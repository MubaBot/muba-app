import { AsyncStorage } from "react-native";

const isLogged = () => AsyncStorage.getItem("user").then(user => (user ? true : false));
const doLogin = async () => AsyncStorage.setItem("user", "test");
const doLogout = async () => AsyncStorage.removeItem("user");

export { isLogged, doLogin, doLogout };
