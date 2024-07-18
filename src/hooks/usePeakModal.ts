import { ElConfigProvider, ElDialog } from "element-plus";

import type { VNode } from "vue";
import { createApp, ref, h, defineComponent } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

/**
 * @description 生成唯一ID
 * @returns string
 */
function generateUniqueId(): string {
  // 获取当前时间戳
  const timestamp = Date.now();

  // 生成一个0到1之间的随机数，并转化为字符串
  const randomNum = Math.random().toString().slice(2);

  // 将时间戳和随机数拼接起来，形成一个唯一ID
  const uniqueId = timestamp + randomNum;

  // 也可以转化为更短的形式，例如使用Base64编码（可选）
  // uniqueId = btoa(uniqueId);

  return uniqueId;
}

interface Prop {
  title?: string; // 模态框的标题
  header?: (prop: Prop) => VNode | string; // 模态框的头部内容
  default?: (prop: Prop) => VNode | string; // 模态框的默认内容
  footer?: (prop: Prop) => VNode | string; // 模态框的脚部内容
  attrs?: Record<string, any>; // 添加到 el-dialog 的属性
  events?: Record<string, any>; // 添加到 el-dialog 的事件
  [key: string]: any; // 外部自定义的属性或方法,也会添加到插槽中
}

/**
 * @description 管理模态框的 hook.
 *
 * @property {(prop: Prop)=>void} open - 打开模态框的函数，接受一个配置对象作为参数
 * @property {()=>void} remove - 移除模态框的函数
 */
export function usePeakModal() {
  const modalDom = document.createElement("div"); // 容器
  const id = ref(Number(generateUniqueId()) as number);
  const visible = ref(true);
  let app = null; // 应用实例

  const defaultEvents = {
    onClosed: () => {
      // 默认添加 el-dialog 的 onClosed 事件
      // console.log('动画结束再删除节点')
      app?.beforeUnmount?.();
      app?.unmount?.();
      document.body.removeChild(modalDom);
    }
  };
  /**
   * @description 手动销毁模态框(无动画)
   */
  function remove() {
    visible.value = false;
    defaultEvents.onClosed();
  }
  const defaultAttrs = {
    // destroyOnClose: true // 当关闭 Dialog 时，销毁其中的元素
  };

  function init(prop: Prop) {
    visible.value = prop.visible ?? true;
    prop.attrs = { ...defaultAttrs, ...prop.attrs };

    if (!prop.events) {
      prop.events = { ...defaultEvents };
    } else {
      const closed = prop?.events?.onClosed;
      prop.events.onClosed = () => {
        closed?.();
        defaultEvents.onClosed();
      };
    }

    const slots: Pick<Prop, "header" | "default" | "footer"> = {
      header: () => prop.title
    };
    if (prop.header) slots.header = () => prop.header(prop);
    if (prop.default) slots.default = () => prop.default(prop);
    if (prop.footer) slots.footer = () => prop.footer(prop);

    const DialogComponent = defineComponent({
      setup() {
        return () =>
          h(
            ElConfigProvider,
            { locale: zhCn },
            {
              default: () =>
                h(
                  ElDialog,
                  {
                    modelValue: visible.value,
                    onUpdate: (modelValue) => {
                      visible.value = modelValue;
                    },
                    ...(prop?.attrs ?? {}),
                    ...(prop?.events ?? {})
                  },
                  slots
                )
            }
          );
        // <ElDialog
        //   modelValue={visible.value}
        //   onUpdate:modelValue={(val) => {
        //     visible.value = val;
        //   }}
        //   {...prop?.attrs ?? {}}
        //   {...prop?.events ?? {}}
        // >
        //   {slots}
        // </ElDialog>
      },
      mounted() {
        // console.log('我创建了嘛')
      },
      unmounted() {
        // console.log('我销毁了嘛')
      }
    });
    app = createApp(DialogComponent);
    modalDom.setAttribute("id", `dialog-${id.value}`);
    document.body.appendChild(modalDom);
    app.mount(modalDom);
  }

  return {
    id,
    modalDom,
    visible,

    /**
     * @description 初始化模态框
     * @param prop - ElDialog模态框的属性对象
     */
    init,

    /**
     * @description 打开模态框
     */
    open() {
      visible.value = true;
    },
    /**
     * @description 移除模态框
     */
    remove
  };
}
