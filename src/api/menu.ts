/**
 * 菜单api
 */

import requestMock from "@/utils/request_mock.ts";
import request from "@/utils/request.ts";
const prefix = "/admin";

/**
 * 获取权限菜单接口
 * @param data
 */
export function reqGetMenuTree() {
  return requestMock({
    url: `/menus/tree`,
    method: "get"
  });
}
/**
 * 获取路由
 * @param data
 */
export function reqGetRouters() {
  return request({
    url: `${prefix}/menu/getRouters`,
    method: "get"
  });
}
