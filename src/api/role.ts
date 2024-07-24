/**
 * @name 角色api
 */
import request from "@/utils/request.ts";
const local_prefix = "/admin";

export interface RoleItem {
  role_id?: number;
  role_name: string;
  role_key: string;
  role_sort: number;
  status: 1 | 0; // 1 正常 0 停用
  remark?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
}

/**
 * 查询角色
 * @param data
 */
export function reqSelectRoleList(data: any) {
  return request({
    url: `${local_prefix}/role`,
    method: "get",
    params: data
  });
}

/**
 * 新增角色
 * @param data
 */
export function reqInsertRole(data: any) {
  return request({
    url: `${local_prefix}/role`,
    method: "post",
    data
  });
}

/**
 * 修改角色
 * @param data
 */
export function reqUpdateRole(data: any) {
  return request({
    url: `${local_prefix}/role`,
    method: "put",
    data
  });
}

/**
 * 删除角色
 * @param data
 */
export function reqDeleteRole(data: any) {
  return request({
    url: `${local_prefix}/role`,
    method: "delete",
    data
  });
}

/**
 * 查询角色已选菜单
 * @param data
 */
export function reqSelectRoleSelectedMenu(data: { role_id: number }) {
  return request({
    url: `${local_prefix}/role/selectedMenu/${data.role_id}`,
    method: "get"
  });
}

/**
 * 修改角色已选菜单
 * @param data
 */
export function reqUpdateRoleSelectedMenu(data: { role_id: number; menuIds: number[] }) {
  return request({
    url: `${local_prefix}/role/selectedMenu`,
    method: "post",
    data
  });
}
