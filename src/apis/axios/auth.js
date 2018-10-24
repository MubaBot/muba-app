import { AuthStorage, UserStorage } from "@/apis/storage";
import * as Axios from "./index";

const isLogged = async () => {
  const result = await Axios.Get("/auth/login");
  const isLogin = result.data.isLogin;

  if (!isLogin) await AuthStorage.removeAuthentication();
  else AuthStorage.setAuthentication(result.data.token);

  return isLogin;
};

const register = async ({ id, username, email, password, repassword, ...params }) => {
  return Axios.Post("/auth/user", {
    id: id,
    username: username,
    email: email,
    password: password,
    repassword: repassword
  });
};

const doLogin = async ({ id, password, ...params }) => {
  return Axios.Post("/auth/login", {
    ID: id,
    PW: password
  })
    .then(user => AuthStorage.setAuthentication(user.data))
    .then(() => setLoginInfo());
};

const setLoginInfo = async () => {
  return Axios.Get("/auth/me").then(user => UserStorage.setUserInfo(user.data));
};

const doLogout = async () => AuthStorage.removeAuthentication();

export { isLogged, register, doLogin, doLogout };
