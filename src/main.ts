import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import pinia from "@/store";

// reset style sheet
import "@/styles/reset.scss";
// font css
import "@/assets/fonts/font.scss";

/* element */
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
//svg icons
import "virtual:svg-icons-register"; // 引入注册脚本
import SvgIcon from "@/components/SvgIcon/index.vue";

const app = createApp(App);

app.component("SvgIcon", SvgIcon);

app.use(router).use(pinia).mount("#app");
