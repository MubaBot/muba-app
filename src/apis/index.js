import * as AuthAxios from "./axios/auth";
import * as AuthStorage from "./storage/auth";

import * as UserAxios from "./axios/user";
import * as UserStorage from "./storage/user";

import * as CartStorage from "./storage/cart";

import * as OrderAxios from "./axios/order";

import * as ShopAxios from "./axios/shop";

import * as ChatAxios from "./axios/chat";
import * as ChatStorage from "./storage/chat";

const AuthApi = { ...AuthAxios, ...AuthStorage };
const ShopApi = { ...ShopAxios };
const UserApi = { ...UserAxios, ...UserStorage };
const CartApi = { ...CartStorage };
const OrderApi = { ...OrderAxios };
const ChatApi = { ...ChatAxios, ...ChatStorage };

export { AuthApi, ShopApi, UserApi, CartApi, OrderApi, ChatApi };
