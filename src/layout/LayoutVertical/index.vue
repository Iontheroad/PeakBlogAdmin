<template>
  <el-container class="layout-container" :class="classObj">
    <!-- 移动端遮罩层 -->
    <MobileMask />
    <el-aside :style="{ width: isCollapse ? '65px' : '210px' }">
      <Logo v-if="themeConfig.isShowLogo" :collapse="isCollapse" />
      <el-scrollbar>
        <el-menu
          :router="false"
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <SubMenu :menu-list="permissionStore.menubarList_getters" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="layout-body">
      <!-- 头部 -->
      <LayoutHeader />
      <!-- 视图区域 -->
      <LayoutMain />
      <LayoutFooter v-if="themeConfig.isShowFooter" />
    </el-container>
  </el-container>
</template>

<script lang="ts" setup name="LayoutVertical">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
// 组件
import MobileMask from "@/layout/components/MobileMask.vue";
import Logo from "@/layout/components/Menu/Logo.vue";
import SubMenu from "@/layout/components/Menu/SubMenu.vue";
import LayoutHeader from "@/layout/components/Header/index.vue";

import LayoutMain from "@/layout/components/Main/index.vue";
import LayoutFooter from "@/layout/components/Footer/index.vue";
// store
import { useAppStore } from "@/store/modules/app";
import { usePermissionStore } from "@/store/modules/permission";
import { useGlobalStore } from "@/store/index";
const route = useRoute();
const appStore = useAppStore();
const globalStore = useGlobalStore();
const permissionStore = usePermissionStore(); // 权限路由状态仓库

const sidebar = computed(() => appStore.sidebar);
// pc：desktop    移动：mobile 窗口宽度小于992
const device = computed(() => appStore.device);
const isCollapse = computed(() => !appStore.sidebar.opened); //是否折叠菜单
const themeConfig = computed(() => globalStore.themeConfig);

/* 高亮所设置的指定菜单 */
const activeMenu = computed<string>(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) return meta.activeMenu as string;
  return path;
});
/* 在mobile情况下,路由跳转后关闭菜单栏 */
watch(route, () => {
  if (device.value == "mobile" && sidebar.value.opened) {
    appStore.closeSideBar(false);
  }
});
/**
 * 根据菜单栏的展开/半收起/隐藏状态 动态添加样式类
 */
const classObj = computed(() => {
  return {
    // 收起侧边栏
    hideSidebar: !sidebar.value.opened,
    // 打开侧边栏
    openSidebar: sidebar.value.opened,
    // 动画
    withoutAnimation: sidebar.value.withoutAnimation,
    // 移动端
    mobile: device.value === "mobile" // 移动端
  };
});
</script>

<style lang="scss">
@import "./index.scss";
</style>
