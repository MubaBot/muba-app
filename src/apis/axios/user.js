import * as Axios from "./index";

const getUserInfoByServer = async () => {
  return Axios.Get("/api/user");
};

const updateUserInfo = async ({ name, phone, gender, birth }) => {
  return Axios.Put("/api/user", { name, phone, gender, birth });
};

export { getUserInfoByServer, updateUserInfo };
