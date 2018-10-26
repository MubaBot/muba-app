import * as AuthAxios from "./axios/auth";
import * as AuthStorage from "./storage/auth";

import * as UserAxios from "./axios/user";
import * as UserStorage from "./storage/user";

import * as CartStorage from "./storage/cart";

import * as OrderAxios from "./axios/order";

import * as ShopAxios from "./axios/shop";

const AuthApi = { ...AuthAxios, ...AuthStorage };
const ShopApi = { ...ShopAxios };
const UserApi = { ...UserAxios, ...UserStorage };
const CartApi = { ...CartStorage };
const OrderApi = { ...OrderAxios };

export { AuthApi, ShopApi, UserApi, CartApi, OrderApi };
