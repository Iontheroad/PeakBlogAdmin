<template>
  <slot v-if="$slots.default"></slot>
  <div
    v-else-if="isType === IconType.URL"
    :style="styleExternalIcon"
    class="icon-render"
  />
  <el-icon v-else-if="isType === IconType.ELEMENT" class="icon-render">
    <component :is="iconName.replace('el-icon-', '')" />
  </el-icon>
  <SvgIcon
    v-else-if="isType === IconType.SVG"
    :prefix="prefix"
    :icon-name="iconName"
    class="icon-render"
  />
</template>
<script setup lang="ts" name="IconRender">
import { computed } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { isExternal } from "@/utils/validate.ts";
interface Icon {
  prefix?: string;

  /**
   * 支持三种图标：URL、ELEMENT（element自带的要加上 el-icon- ）、SVG
   */
  iconName: string;
}
/**
 * 图标类型
 */
enum IconType {
  "URL" = 1,
  "ELEMENT" = 2,
  "SVG" = 3
}
const props = withDefaults(defineProps<Icon>(), {
  prefix: "icon"
});

const isType = computed((): IconType => {
  if (isExternal(props.iconName)) {
    return IconType.URL;
  } else if (props.iconName.startsWith("el-icon-")) {
    return IconType.ELEMENT;
  } else {
    return IconType.SVG;
  }
});

// url图标
const styleExternalIcon = computed(() => {
  return {
    mask: `url(${props.iconName}) no-repeat 50% 50%`,
    "-webkit-mask": `url(${props.iconName}) no-repeat 50% 50%`
  };
});

console.log();
</script>

<style scoped>
.icon-render {
  width: 1em;
  height: 1em;
}
</style>
