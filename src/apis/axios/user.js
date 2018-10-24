import * as Axios from "./index";

const getUserInfoByServer = async () => {
  return Axios.Get("/api/user");
};

const updateUserInfo = async ({ phone, gender }) => {
  return Axios.Put("/api/user", { phone, gender });
};

export { getUserInfoByServer, updateUserInfo };
