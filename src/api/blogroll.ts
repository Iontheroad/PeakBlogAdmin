/**
 * @name 友链api
 */

import request from "@/utils/request";
import { ReqPage, ResPage, ResResult } from "@/api/interface/index";
const prefix = "/blog";

export namespace Blogroll {
  export interface BlogrollItem {
    id: number;
    site_name: string;
    site_url: string;
    site_icon: string;
    email: string;
    description: string;
    is_active: 0 | 1; // 0:禁用 1:正常
    create_time?: string;
    update_time?: string;
  }
  export type ReqInsertUpdateBlogroll = Omit<
    BlogrollItem,
    "id" | "create_time" | "update_time"
  > & { id?: number; site_icon?: string; email?: string };
}

/**
 * 获取友链
 */
export function reqSelectBlogroll(
  params: ReqPage
): Promise<ResPage<Blogroll.BlogrollItem>> {
  return request({
    url: `${prefix}/blogroll`,
    method: "get",
    params
  });
}

/**
 * 新增友链
 */
export function reqInsertBlogroll(
  data: Blogroll.ReqInsertUpdateBlogroll
): Promise<ResResult> {
  return request({
    url: `${prefix}/Blogroll`,
    method: "post",
    data
  });
}

/**
 * 修改友链
 */
export function reqUpdateBlogroll(
  data: Blogroll.ReqInsertUpdateBlogroll
): Promise<ResResult> {
  return request({
    url: `${prefix}/blogroll`,
    method: "put",
    data
  });
}

/**
 * 删除友链
 */
export function reqDeleteBlogroll(data: { ids: number[] }) {
  return request({
    url: `${prefix}/blogroll`,
    method: "delete",
    data
  });
}
