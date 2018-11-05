import * as Axios from "./index";

const getOrderList = async ({ page }) => {
  return Axios.Get("/api/user/order/" + page);
};

const cancelMenu = async ({ order }) => {
  return Axios.Delete("/api/user/order/" + order);
};

export { getOrderList, cancelMenu };
