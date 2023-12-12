<template>
  <el-main class="main">
    <router-view name="default" v-slot="{ Component, route }">
      <keep-alive :include="keepAliveList">
        <component :is="Component" :key="route.path" v-if="isReload" />
      </keep-alive>
    </router-view>
  </el-main>
</template>

<script setup lang="ts" name="Main">
import { computed, onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import { useAppStore } from "@/store/modules/app";
import { useTabsStore } from "@/store/modules/tabs";
const appStore = useAppStore();
const tabsStore = useTabsStore();

// 刷新当前页
const isReload = computed(() => tabsStore.isReload);
const keepAliveList = computed(() => tabsStore.keepAliveList);

/* 监听窗口大小，在不同情况下，调整菜单栏状态 */
onMounted(() => {
  resizeSidebar();
});
onBeforeMount(() => {
  window.addEventListener("resize", resizeSidebar);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeSidebar);
});

/* FIXME：重新修改菜单栏状态 */
function resizeSidebar() {
  // 我们需要在特定的时候判断页面的显示状态，例如：当视频加载到可播放状态时，根据用户是否停留在当前页面来决定是否开始自动播放。页面的展示的状态的判断就需要用到;
  // bool型，表示页面是否处于隐藏状态。页面隐藏包括页面在后台标签页或者浏览器最小化。
  // 确保页面状态
  if (!document.hidden) {
    const isMobile = document.body.getBoundingClientRect().width;
    if (isMobile < 992) {
      // 小于992调成移动设备
      appStore.toggleDevice("mobile");
      // 关闭菜单
      appStore.closeSideBar(false);
    } else {
      // pc端
      appStore.toggleDevice("desktop");
      if (isMobile >= 1200) {
        //大于1200，展开
        appStore.openSideBar(false);
      } else {
        // 收起
        appStore.closeSideBar(false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  padding: 10px;
  background-color: #eef0f3;

  // display: flex;
  // flex-direction: column;
  // width: 100%;
  // overflow: visible; // 默认滚动条在整个 .layout_main
}
</style>
