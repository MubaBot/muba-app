import * as Axios from "./index";

const searchSaleShopList = async ({ lat, lng, page, time }) => {
  return Axios.Get(["/api/shop/list/sale", page, lat, lng, time].join("/"));
};

const searchShop = async ({ keyword, page, lat, lng }) => {
  return Axios.Get(["/api/shop/list", page, lat, lng, keyword].join("/"));
};

const getShopInfo = async ({ id }) => {
  return Axios.Get("/api/shop/" + id);
};

const getShopMenus = async ({ id }) => {
  return Axios.Get(["/api/shop", id, "menus", "sales"].join("/"));
};

const setLatlng = async ({ id, lat, lng }) => {
  return Axios.Put(["/api/shop", id, "latlng"].join("/"), {
    lat: lat,
    lng: lng
  }).catch(() => null);
};

const orderCart = async ({ id, cart, address, address_detail, require, phone, visit, lat, lng }) => {
  return Axios.Post(["/api/shop", id, "order"].join("/"), {
    cart,
    address,
    address_detail,
    require,
    phone,
    visit,
    lat,
    lng
  });
};

const writeReview = async ({ shop, id, data }) => {
  return Axios.Post(["/api/shop", shop, "order", id, "review"].join("/"), data);
};

const getReview = async ({ shop, page }) => {
  return Axios.Get(["/api/shop", shop, "review", page].join("/")).then(res => res.data.reviews);
};

export { searchSaleShopList, searchShop, setLatlng, getShopInfo, getShopMenus, orderCart, writeReview, getReview };
