import * as Axios from "./index";

const getOrderList = async ({ page }) => {
  return Axios.Get("/api/user/order/" + page);
};

export { getOrderList };
