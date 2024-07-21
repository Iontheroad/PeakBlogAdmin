<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId"></use>
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from "vue";
export interface SvgProps {
  prefix?: string;
  iconName: string;
}
const props = withDefaults(defineProps<SvgProps>(), {
  prefix: "icon"
});

const symbolId = computed(() => `#${props.prefix}-${props.iconName}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
}
</style>
