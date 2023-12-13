/**
 * 监听窗口
 */
import { ref, onMounted, onUnmounted, Ref } from "vue";

export const useResize = () => {
  onMounted(() => {
    window.addEventListener("resize", resize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });

  let width = ref<number>();
  /**
   * 菜单栏是否折叠
   */
  let isCollapse: Ref<boolean> = ref(false);

  /**
   * 菜单栏状态
   */
  let menuResize = ref<"expand" | "collapse" | "hidden">("expand"); // expand collapse hidden
  function resize() {
    width.value = document.body.getBoundingClientRect().width;
    if (width.value >= 1200) {
      isCollapse.value = false;
      menuResize.value = "expand";
    } else if (width.value > 992) {
      isCollapse.value = true;
      menuResize.value = "collapse";
    } else {
      isCollapse.value = true;
      menuResize.value = "hidden";
    }
  }
  resize();
  return {
    width,
    isCollapse,
    menuResize
  };
};
