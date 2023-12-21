/**
 * @name 用户api
 */
// import type { AxiosResponse } from "axios";
import request from "@/utils/request.ts";
const prefix = "/admin";
/**
 * 用户登录
 * @param data
 */
export function reqUserLogin(data: { username: string; password: string }) {
  return request({
    url: `${prefix}/user/login`,
    method: "post",
    data
  });
}

/**
 * 用户登出
 * @returns
 */
export function reqUserLogout() {
  return request({
    url: `${prefix}/user/logout`,
    method: "post"
  });
}

/**
 * 用户注册
 * @param data
 */
export function reqUserRegister(data: { username: string; password: string }) {
  return request({
    url: `${prefix}/user/register`,
    method: "post",
    data
  });
}

/**
 * 重置密码
 * @param data
 */
export function reqUserResetPassword(data: { username: string; password: string }) {
  return request({
    url: `/user/resetPassword`,
    method: "patch",
    data
  });
}

/**
 * 刷新token
 */
export function reqRefreshToken(options: any) {
  return request({
    url: `/refresh/token`,
    method: "post",
    ...options
  });
}

/**
 * 获取路由菜单集合
 * @returns
 */
export function reqGetMenuListApi() {
  return request({
    url: `/user/menus`,
    method: "get"
  });
}
