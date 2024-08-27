<script lang="ts" setup name="PeakConfigTable">
import { ref, useSlots } from "vue";
import type { ColConfig } from "./index.ts";

interface PeakConfigTableProps {
  tableColumns: ColConfig[];
  loading?: boolean;
}
defineOptions({
  name: "PeakConfigTable"
});
withDefaults(defineProps<PeakConfigTableProps>(), {
  tableColumns: () => [],
  loading: false
});

const slots = useSlots();
const peakConfigTableRef = ref(null);

defineExpose({
  peakConfigTableRef
});
</script>

<template>
  <el-table
    ref="peakConfigTableRef"
    v-loading="loading"
    border
    class="peak-config-table"
    style="width: 100%; max-height: 100%; overflow: auto"
    v-bind="$attrs"
  >
    <el-table-column v-for="item in tableColumns" :key="item.prop" v-bind="item">
      <template v-if="item.slotHeader" #header="scope">
        <slot :name="item.slotHeader" v-bind="scope"></slot>
      </template>
      <template v-else-if="slots[item.prop]" #default="scope">
        <slot :name="item.prop" v-bind="scope"></slot>
      </template>
    </el-table-column>

    <template v-if="$slots.empty" #empty="scope">
      <slot name="empty" v-bind="scope"></slot>
    </template>
    <template v-if="$slots.append" #append="scope">
      <slot name="append" v-bind="scope"></slot>
    </template>
  </el-table>
</template>

<style lang="scss" scoped></style>
