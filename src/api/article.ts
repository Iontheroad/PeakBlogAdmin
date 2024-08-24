/**
 * @name 文章api
 */
import { ReqPage, ResResult, ResResultData } from "./interface";
import request from "@/utils/request";
import { type Category } from "./category";
import { type Tags } from "./tags";
const prefix = "/blog";

export enum ArticleStatus {
  "审核中" = 1,
  "通过" = 2,
  "未通过" = 3
}
export namespace Article {
  // 获取文章 列表参数
  export interface ArticleItem {
    article_id: number;
    article_title: string;
    article_digest: string;
    article_content: string;
    article_cover: string;
    article_type: 1 | 2; // 1原创 2转载
    cate_id: number; // 分类id
    category: Category;
    tags: Tags[];
    status: ArticleStatus; // 文章状态 1审核中 2通过 3未通过
    noPass_reason?: string; // 未通过原因
    comment_status: 1 | 2; // 评论状态 1开启 2关闭
    create_by: string;
    create_id: number;
    create_time: string;
    update_by: string;
    update_id: number;
    update_time: string;
  }

  // 请求参数
  export interface ReqSelectArticleList extends ReqPage {
    status: ArticleStatus;
    tag_ids: string; // 标签id (逗号隔开)
    cate_id?: number;
    searchKey?: string;
  }

  // 新增文章 请求参数
  export type ReqInsertArticle = {
    article_title: string;
    article_digest: string;
    article_content: string;
    article_cover: string;
    article_type: 1 | 2; // 1原创 2转载
    tag_ids: number[]; // 标签id
    cate_id: number | undefined;
    comment_status: 1 | 2;
  };

  // 修改文章 请求参数
  export interface ReqUpdateArticle extends ReqInsertArticle {
    article_id: number;
  }

  // 文章审核 请求参数
  export type ReqArticleReview = Pick<ReqUpdateArticle, "article_id"> & {
    status: ArticleStatus;
    noPass_reason?: string;
  };
}

/**
 * 获取文章列表
 */
export function reqSelectArticleList(
  params: Article.ReqSelectArticleList
): Promise<{ data: Article.ArticleItem[]; total: number }> {
  return request({
    url: `${prefix}/article/list`,
    method: "get",
    params
  });
}

/**
 * 获取指定文章
 */
export function reqSelectArticle(params: {
  article_id: number;
}): Promise<ResResultData<Article.ArticleItem>> {
  return request({
    url: `${prefix}/article/${params.article_id}`,
    method: "get"
  });
}

/**
 * 新增文章
 */
export function reqInsertArticle(data: Article.ReqInsertArticle): Promise<ResResult> {
  return request({
    url: `${prefix}/article`,
    method: "post",
    data
  });
}

/**
 * 修改文章
 */
export function reqUpdateArticle(data: Article.ReqUpdateArticle): Promise<ResResult> {
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
export function reqArticleReview(data: Article.ReqArticleReview): Promise<ResResult> {
  return request({
    url: `${prefix}/article/review`,
    method: "patch",
    data
  });
}
