import * as Axios from "./index";

const getUserInfoByServer = async () => {
  return Axios.Get("/api/user");
};

const updateUserInfo = async ({ phone }) => {
  return Axios.Put("/api/user", { phone });
};

export { getUserInfoByServer, updateUserInfo };
