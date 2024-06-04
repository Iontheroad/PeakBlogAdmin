<template>
  <el-table :data="tableData" v-loading="loading" style="width: 100%" v-bind="$attrs">
    <el-table-column v-for="item in tableColumns" :key="item.prop" v-bind="item">
      <template v-if="item.slotHeader" #header="{ column }">
        <slot name="header" v-bind="column"></slot>
      </template>

      <template #default="scope">
        <slot v-if="item.prop" :name="item.prop" v-bind="scope">{{
          scope.row[item.prop]
        }}</slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
defineOptions({
  name: "PeakTable"
});
export interface PeakTableProps {
  tableData: any[];
  tableColumns: any[];
  loading?: boolean;
}
withDefaults(defineProps<PeakTableProps>(), {
  tableData: () => [],
  tableColumns: () => [],
  loading: false
});
</script>

<style lang="scss" scoped></style>
