/**
 * 注册全局组件
 */

import * as ElIcons from "@element-plus/icons-vue";
// : App<Element>
// 注册所有图标
export function setupElIcons(app) {
  for (const [key, component] of Object.entries(ElIcons)) {
    app.component(key, component);
  }
}

export default {
  install: (app) => {
    for (const key in ElIcons) {
      const componentConfig = (ElIcons as any)[key];
      app.component(componentConfig.name, componentConfig);
    }
  }
};
