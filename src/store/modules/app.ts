/**
 * 页面的一些状态
 *   菜单栏,语言,大小
 */

import { getSize, setSize } from "@/utils/localStorage"; // 本地存储
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
// import { useStorage } from "@vueuse/core";

// setup
export const useAppStore = defineStore("app", () => {
  // state
  // 菜单栏
  const sidebar = reactive({
    isCollapse: false // 是否折叠
  });
  // pc：desktop    移动： mobile 窗口宽度小于992
  // const device = useStorage<string>("device", "desktop"); //默认pc  自动存取
  const size = ref(getSize() || "default"); // 布局大小

  // actions
  /**
   * 菜单展开收起
   * @param withoutAnimation
   */
  function toggleSidebar(isCollapse: boolean) {
    sidebar.isCollapse = isCollapse;
  }

  /**
   * 更换主题大小
   * @param val(default | large | small)
   */
  function changeSize(val: string) {
    size.value = val;
    setSize(val);
  }

  return {
    sidebar,
    size,
    changeSize,
    toggleSidebar
  };
});
