<template>
  <div class="header-tool-left">
    <!-- 点击展开收起的按钮 -->
    <Hamburger />
    <!-- 面包屑,在移动端状态下不显示 -->
  </div>
</template>

<script setup lang="ts" name="ToolBarLeft">
import Hamburger from "./components/Hamburger.vue";
</script>

<style scoped lang="scss">
.header_tool_left {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
