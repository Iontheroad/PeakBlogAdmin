import { defineConfig, ConfigEnv, UserConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import vueSetupExtend from "unplugin-vue-setup-extend-plus/vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { viteMockServe } from "vite-plugin-mock";
import vueDevTools from "vite-plugin-vue-devtools";
import Inspect from "vite-plugin-inspect";
import Inspector from "vite-plugin-vue-inspector";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    root,
    base: env.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js" // 清除i18n控制栏警告
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or 'modern'
          additionalData: `@use "@/styles/var.scss" as *;` // 在处理每个SCSS 文件时，都会在文件内容的最前面自动添加这一行代码，以导入 var.scss 文件
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT),
      open: env.VITE_OPEN === "true",
      // cors: true,
      proxy: {
        [env.VITE_API_URL]: {
          target: "http://localhost:10003",
          changeOrigin: true
          // rewrite: (path: string): string => {
          //   // 重写请求路径
          //   return path.replace(new RegExp(`^${env.VITE_API_URL}`), "");
          //   // return path.replace(/^env.VITE_API_URL/, "");
          // }
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      Inspect(),
      Inspector(),
      vueDevTools(),
      // name 可以写在 script 标签上
      vueSetupExtend({}),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      viteMockServe({
        mockPath: "./src/mocks", // 用于指定 Mock.js 文件所在的路径
        enable: true // 是否启动 Mock Server  (实际生产环境建议关闭，只在本地开发时启用，比较方便调试)
      })
    ]
    // optimizeDeps: {
    //   // include: ["unocss"]
    // }
  };
});
