/**
 * 用户
 */
import { defineStore } from "pinia";
import type { PersistedStateOptions } from "pinia-plugin-persistedstate";
import { useTabsStore } from "./tabs";
import { usePermissionStore } from "./permission";
import { reqSelectUser } from "@/api/user";
interface UserProps {
  access_token: string;
  refresh_token: string;
  userInfo?: {
    avatar: string;
    nickname: string;
    perms: string[];
    roles: string[];
    userId: string;
  };
}

export const useUserStore = defineStore({
  id: "peak-blog-user",
  state: (): UserProps => ({
    access_token: "", // 访问令牌
    refresh_token: "", // 刷新令牌
    userInfo: {
      avatar: "http://119.91.22.164:8085/images/11411538250643115avatar.jpg", // 头像
      nickname: "Peak", // 昵称
      perms: ["sys:user:edit", "sys:user:delete", "sys:user:add"], //权限字段
      roles: ["admin"], // 角色
      userId: "1" // 用户id
    }
  }),
  actions: {
    setToken({ access_token, refresh_token }: UserProps) {
      this.access_token = access_token;
      this.refresh_token = refresh_token;
    },

    /**
     * 登录成功后 获取用户信息
     * @returns
     */
    async getUserInfo() {
      try {
        let result = await reqSelectUser();
        this.userInfo = result.data;
        return Promise.resolve(true);
      } catch (error) {
        return Promise.reject(false);
      }
    },

    /**
     * 重置用户数据
     */
    resetUser() {
      // 重置数据
      this.access_token = "";
      this.refresh_token = "";
      this.userInfo = {};
      const tabsStore = useTabsStore();
      tabsStore.resetTabs_actions(); // 清空缓存的tabs和路由
      const permissionStore = usePermissionStore();
      permissionStore.menuList = []; // 清空缓存的路由
    }
  },
  getters: {},
  persist: {
    enabled: true, // 开启数据存储
    strategies: [
      {
        key: "peak-user",
        storage: localStorage
      }
    ]
  } as PersistedStateOptions
});
