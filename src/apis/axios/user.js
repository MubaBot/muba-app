import * as Axios from "./index";

const getUserInfoByServer = async () => {
  return Axios.Get("/api/user");
};

const updateUserInfo = async ({ phone, gender, birth }) => {
  return Axios.Put("/api/user", { phone, gender, birth });
};

export { getUserInfoByServer, updateUserInfo };
