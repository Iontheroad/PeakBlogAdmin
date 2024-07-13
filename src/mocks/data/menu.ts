/**
 * 菜单mock
 */
import { MockMethod } from "vite-plugin-mock";
import { errorResponse, successResponse } from "../util";
export const menuList = [
  {
    path: "/home/index",
    name: "Home",
    component: "/home/index",
    meta: {
      title: "首页",
      icon: "menu-home",
      roles: ["admin"],
      activeMenu: "/home/index",
      isHidden: false,
      isLink: false,
      isFull: false,
      isAffix: true,
      isKeepAlive: false,
      isBreadcrumbHidden: false,
      isAlwaysShow: false
    }
  },
  {
    path: "/article",
    name: "Article",
    component: "/article/index",
    meta: {
      title: "文章管理",
      icon: "menu-table",
      roles: ["admin"],
      isHidden: false,
      isLink: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false,
      isBreadcrumbHidden: false
    }
  },
  {
    path: "/article/read-write/:article_id?",
    name: "ArticleRW",
    component: "/article/read-write",
    meta: {
      title: "文章操作",
      icon: "menu-table",
      roles: ["admin"],
      activeMenu: "/article",
      isHidden: true,
      isLink: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false,
      isBreadcrumbHidden: true
    }
  },
  {
    path: "/category",
    name: "Category",
    component: "/category/index",
    meta: {
      title: "分类管理",
      icon: "menu-table",
      roles: ["admin"],
      isHidden: false,
      isLink: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false,
      isBreadcrumbHidden: false,
      isAlwaysShow: false
    }
  },
  {
    path: "/tags",
    name: "Tags",
    component: "/tags/index",
    meta: {
      title: "标签管理",
      icon: "menu-table",
      roles: ["admin"],
      isHidden: false,
      isLink: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false,
      isBreadcrumbHidden: false,
      isAlwaysShow: false
    }
  },
  {
    path: "/blogroll",
    name: "Blogroll",
    component: "/blogroll/index",
    meta: {
      title: "友情管理",
      icon: "menu-table",
      roles: ["admin"],
      isHidden: false,
      isLink: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false,
      isBreadcrumbHidden: false,
      isAlwaysShow: false
    }
  },
  {
    path: "/system",
    name: "System",
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "menu-system",
      roles: ["admin"],
      isHidden: false,
      isLink: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false,
      isBreadcrumbHidden: false,
      isAlwaysShow: false
    },
    children: [
      {
        path: "/system/role",
        name: "Role",
        component: "/system/role/index",
        meta: {
          title: "角色管理",
          icon: "menu-system-role",
          roles: ["admin"],
          isHidden: false,
          isLink: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          isBreadcrumbHidden: false,
          isAlwaysShow: false
        }
      },
      {
        path: "/system/user",
        name: "User",
        component: "/system/user/index",
        meta: {
          title: "用户管理",
          icon: "menu-system-user",
          roles: ["admin"],
          isHidden: false,
          isLink: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          isBreadcrumbHidden: false,
          isAlwaysShow: false
        }
      },
      {
        path: "/system/menu",
        name: "Menu",
        component: "/system/menu/index",
        meta: {
          title: "菜单管理",
          icon: "menu-system-menu",
          roles: ["admin"],
          isHidden: false,
          isLink: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          isBreadcrumbHidden: false,
          isAlwaysShow: false
        }
      }
    ]
  }
];
export default [
  /**
   * 获取权限菜单接口
   */
  {
    url: `/mock/menus/tree`,
    method: "get",
    timeout: 300,
    response: ({ headers }: any) => {
      if (!headers?.authorization) return errorResponse(null, "请先登录", 401);
      return successResponse(menuList, "请求成功", 200);
    }
  }
] as MockMethod[];
