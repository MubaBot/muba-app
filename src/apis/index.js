import * as AuthAxios from "./axios/auth";
import * as ShopAxios from "./axios/shop";

import * as UserStorage from "./storage/user";

import * as CartStorage from "./storage/cart";

import * as OrderAxios from "./axios/order";

const Auth = { ...AuthAxios };
const Shop = { ...ShopAxios };
const User = { ...UserStorage };
const CartApi = { ...CartStorage };
const OrderApi = { ...OrderAxios };

export { Auth, Shop, User, CartApi, OrderApi };
