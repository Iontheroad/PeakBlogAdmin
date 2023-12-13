<script setup lang="ts" name="MobileMask">
import { useAppStore } from "@/store/modules/app";
import { computed } from "vue";
const appStore = useAppStore();

const isCollapse = computed(() => appStore.sidebar.isCollapse);
import { useResize } from "@/hooks/useResize";
const { menuResize } = useResize();
/**
 * 点击空白处，移除遮罩层，并收起菜单
 */
function handleClickOutside() {
  appStore.toggleSidebar(true); // 收起
}
</script>

<template>
  <div
    v-if="menuResize == 'hidden' && !isCollapse"
    class="drawer-bg"
    @click="handleClickOutside"
  />
</template>

<style scoped>
/* 遮罩层 */
.drawer-bg {
  position: absolute;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0.3;
}
</style>
