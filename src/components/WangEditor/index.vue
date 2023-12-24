<template>
  <div style="border: 1px solid #cccccc">
    <Toolbar
      style="border-bottom: 1px solid #cccccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
    />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: "WangEditor"
});
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
const editorRef = shallowRef();
const mode = "default"; // 或 'simple'
// 内容 HTML
const valueHtml = ref("<p>hello</p>");

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
  }, 1500);
});

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>
