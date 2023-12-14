<script setup lang="ts" name="MobileMask">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { useResize } from "@/hooks/useResize";
const appStore = useAppStore();
const route = useRoute();

const isCollapseMenu = computed(() => appStore.isCollapseMenu);
const { windowWidth } = useResize();
const isShow = computed(() => windowWidth.value < 992 && !isCollapseMenu.value);
watch(route, () => appStore.toggleSidebar(true));

function handleClickOutside() {
  appStore.toggleSidebar(true); // 收起
}
</script>

<template>
  <div v-if="isShow" class="drawer-bg" @click="handleClickOutside" />
</template>

<style scoped>
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
