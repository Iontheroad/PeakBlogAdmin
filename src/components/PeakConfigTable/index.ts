import type { ElTableColumn } from "element-plus";
import { VNode } from "vue";

export type ColConfig = Partial<
  Parameters<Exclude<(typeof ElTableColumn)["setup"], undefined>>[0] & {
    slotHeader: string;
    showOverflowTooltip;
    customRender: (...args: any[]) => VNode | string;
  }
>;

/** 纯函数 */
export function setColsConfig(
  colConfigs: ColConfig[],
  config?: Record<string, any>
): ColConfig[] {
  return colConfigs.map((item) => {
    return { ...config, ...item };
  });
}
