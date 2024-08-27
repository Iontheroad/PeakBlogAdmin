import type { ElTableColumn } from "element-plus";
export type ColConfig = Partial<
  Parameters<Exclude<(typeof ElTableColumn)["setup"], undefined>>[0] & {
    slotHeader: string;
    showOverflowTooltip;
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
