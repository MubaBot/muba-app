import * as Axios from "./index";

const getOrderList = async ({ page }) => {
  return Axios.Get("/api/order/user/" + page);
};

export { getOrderList };
