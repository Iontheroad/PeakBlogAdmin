/**
 * @name 文章api
 */

import request from "@/utils/request";
const prefix = "/admin";

export interface Article {
  article_id: number;
  article_title: string;
  article_digest: string;
  article_content: string;
  article_cover: string;
  article_type: 1 | 2; // 1原创 2转载
  category_id: string; // 分类id 1,2,3
  status: 1 | 2 | 3; // 文章状态 1审核中 2通过 3未通过
  noPass_reason: string;
  comment_status: 1 | 2; // 评论状态 1开启 2关闭
  create_by: string;
  create_id: number;
  create_time: string;
  update_by: string;
  update_id: number;
  update_time: string;
}

export type SelectParams = {
  currentPage: number;
  pageSize: number;
  status: 1 | 2 | 3;
};
/**
 * 获取文章
 */
export function reqSelectArticleList(
  params: SelectParams
): Promise<{ data: Article[]; total: number }> {
  return request({
    url: `${prefix}/article`,
    method: "get",
    params
  });
}

export type InsertParams = Pick<
  Article,
  | "article_title"
  | "article_digest"
  | "article_content"
  | "article_type"
  | "category_id"
  | "comment_status"
>;
/**
 * 新增文章
 */
export function reqInsertArticle(data: InsertParams) {
  return request({
    url: `${prefix}/article`,
    method: "post",
    data
  });
}

/**
 * 修改文章
 */
export function reqUpdateArticle(data: InsertParams & { article_id: number }) {
  return request({
    url: `${prefix}/article`,
    method: "put",
    data
  });
}

/**
 * 删除文章
 */
export function reqDeleteArticle(data: { ids: number[] }) {
  return request({
    url: `${prefix}/article`,
    method: "delete",
    data
  });
}

/**
 * 文章审核
 */
export function reqArticleReview(
  data: Pick<Article, "article_id" | "status"> & Pick<Partial<Article>, "noPass_reason">
) {
  return request({
    url: `${prefix}/article/review`,
    method: "put",
    data
  });
}
