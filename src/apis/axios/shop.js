import * as Axios from "./index";

const searchShop = async ({ keyword, page }) => {
  return Axios.Get(["/api/shop/list", page, keyword].join("/"));
};

const getShopInfo = async ({ id }) => {
  return Axios.Get("/api/shop/" + id);
};

const setLatlng = async ({ id, lat, lng }) => {
  return Axios.Put(["/api/shop", id, "latlng"].join("/"), {
    lat: lat,
    lng: lng
  }).catch(() => null);
};

const orderCart = async ({ id, cart, address, require, phone }) => {
  return Axios.Post(["/api/shop", id, "order"].join("/"), {
    cart,
    address,
    require,
    phone
  });
};

export { searchShop, setLatlng, getShopInfo, orderCart };
