<template>
  <div class="collapse-icon" @click="toggleClick">
    <!-- 展开收起的按钮图标 -->
    <svg
      :class="{ 'is-active': isCollapse }"
      class="icon"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup name="Hamburger">
import { useAppStore } from "@/store/modules/app";
import { computed } from "vue";

const appStore = useAppStore();
const isCollapse = computed(() => appStore.sidebar.isCollapse); // 菜单栏状态

// 点击触发
function toggleClick() {
  appStore.toggleSidebar(!isCollapse.value);
}
</script>

<style scoped lang="scss">
.collapse-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: background 0.3s; // 动画
  -webkit-tap-highlight-color: transparent;
  &:hover {
    background: rgb(0 0 0 / 2.5%);
  }
  .icon {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    &.is-active {
      transform: rotate(180deg);
    }
  }
}
</style>
