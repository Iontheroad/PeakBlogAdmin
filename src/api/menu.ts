/**
 * 菜单api
 */
import requestMock from "@/utils/request_mock.ts";
import request from "@/utils/request.ts";
import type { ResResultData } from "./interface/index.ts";
const prefix = "/admin";

/**
 * 菜单类型
 */
export enum MenuType {
  "目录" = "M",
  "菜单" = "C",
  "按钮" = "F"
}
export const menuType = [
  {
    label: "目录",
    value: MenuType["目录"],
    type: "primary"
  },
  {
    label: "菜单",
    value: MenuType["菜单"],
    type: "success"
  },
  {
    label: "按钮",
    value: MenuType["按钮"],
    type: "warning"
  }
];

/**
 * 打开方式
 */
export type MenuTarget = "self" | "blank";

type Boolean = 0 | 1;

export interface MenuItem {
  menu_id: number;
  menu_name: string;
  parent_id: number;
  route_name: string;
  path: string;
  component: string;
  target: MenuTarget;
  menu_type: MenuType;
  active_menu?: string;
  icon: string;
  order_num: number;
  is_link: Boolean;
  is_keep_alive: Boolean;
  is_hidden: Boolean;
  is_disabled: Boolean;
  is_refresh: Boolean;
  is_affix: Boolean;
  is_full: Boolean;
  is_always_show: Boolean;
  perms: string;
  remark: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
  children?: MenuItem[];
}

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
 * 获取动态路由
 * @param data
 */
export function reqGetRouters() {
  return request({
    url: `${prefix}/menu/getRouters`,
    method: "get"
  });
}

/**
 * 获取菜单列表
 * @param data
 */
export function reqGetMenuList(): Promise<ResResultData<MenuItem[]>> {
  return request({
    url: `${prefix}/menu/list`,
    method: "get"
  });
}

/**
 * 新增或更新菜单
 * @param data
 */
export function reqInsetOrUpdateMenu(data: MenuItem) {
  return request({
    url: `${prefix}/menu`,
    method: "post",
    data
  });
}

/**
 * 删除菜单
 * @param data
 */
export function reqDeleteMenu(data: { ids: number[] }) {
  return request({
    url: `${prefix}/menu`,
    method: "delete",
    data
  });
}
