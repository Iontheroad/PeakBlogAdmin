/**
 * @name 标签api
 */

import request from "@/utils/request";
const prefix = "/blog";

export interface Tags {
  tag_id: number;
  tag_name: string;
  create_time: string;
  update_time: string;
}

/**
 * 获取标签
 */
export function reqSelectTags() {
  return request({
    url: `${prefix}/tags`,
    method: "get"
  });
}

/**
 * 新增标签
 */
export function reqInsertTags(data: Pick<Tags, "tag_name">) {
  return request({
    url: `${prefix}/tags`,
    method: "post",
    data
  });
}

/**
 * 修改标签
 */
export function reqUpdateTags(data: Omit<Tags, "create_time" | "update_time">) {
  return request({
    url: `${prefix}/tags`,
    method: "put",
    data
  });
}

/**
 * 删除标签
 */
export function reqDeleteTags(data: { ids: number[] }) {
  return request({
    url: `${prefix}/tags`,
    method: "delete",
    data
  });
}
