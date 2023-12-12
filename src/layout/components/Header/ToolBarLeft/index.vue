<template>
  <div class="header-tool-left">
    <!-- 点击展开收起的按钮 -->
    <CollapseIcon />
    <!-- 面包屑,在移动端状态下不显示 -->
    <Breadcrumb v-if="themeConfig.isShowBreadcrumb" />
  </div>
</template>

<script setup lang="ts" name="ToolBarLeft">
import CollapseIcon from "./components/CollapseIcon.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import { computed } from "vue";
import { useGlobalStore } from "@/store";
const globalStore = useGlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);
</script>

<style scoped lang="scss">
.header-tool-left {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
