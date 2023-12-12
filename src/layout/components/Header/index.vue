<template>
  <el-header class="header">
    <!-- 头部左侧工具栏 -->
    <ToolBarLeft />
    <!-- 右侧 -->
    <ToolBarRight />
  </el-header>
</template>

<script lang="ts" setup name="Header">
import ToolBarLeft from "@/layout/components/Header/ToolBarLeft/index.vue";
import ToolBarRight from "@/layout/components/Header/ToolBarRight/index.vue";
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
