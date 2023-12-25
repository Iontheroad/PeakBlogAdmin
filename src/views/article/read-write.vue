<template>
  <el-card class="article-read-write">
    <el-form
      ref="articleFormRef"
      :model="articleForm"
      size="default"
      label-width="90px"
      label-suffix=":"
    >
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="article_title" label="文章标题">
            <el-input
              v-model="articleForm.article_title"
              placeholder="请输入文章标题"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="article_digest" label="文章摘要">
            <template #label>
              <el-tooltip
                effect="dark"
                content="用于 `router/route.ts` meta.roles"
                placement="top-start"
              >
                <span>文章摘要</span>
              </el-tooltip>
            </template>
            <el-input
              v-model="articleForm.article_digest"
              placeholder="请输入文章摘要"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item prop="article_cover" label="文章封面">
            <el-input v-model="articleForm.article_cover" placeholder="请输入文章封面" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="article_type" label="文章类型">
            <el-radio-group v-model="articleForm.article_type">
              <el-radio :label="1"> 原创 </el-radio>
              <el-radio :label="2"> 转载 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="category_id" label="文章分类">
            <el-select
              v-model="articleForm.category_id"
              multiple
              placeholder="请选择文章分类"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.cate_id"
                :label="item.cate_name"
                :value="item.cate_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item prop="comment_status" label="评论状态">
            <el-switch
              v-model="articleForm.comment_status"
              inline-prompt
              :active-value="1"
              active-text="启"
              :inactive-value="0"
              inactive-text="禁"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-form-item
          prop="article_content"
          label="文章内容"
          style="display: flex; flex-direction: column"
        >
          <WangEditor v-model="articleForm.article_content" />
        </el-form-item>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submitForm(articleFormRef)">提交</el-button>
        <el-button @click="cancel(articleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import WangEditor from "@/components/WangEditor/index.vue";
// TODO: 完善剩余字段
// TODO: 抽离表单封装组件
const articleFormRef = ref<FormInstance>();
const articleForm = reactive({
  article_title: "",
  article_digest: "",
  article_cover: "",
  article_type: 1,
  category_id: "",
  comment_status: 1,
  article_content: "" as string
});
const categoryList = [
  {
    cate_id: 1,
    cate_name: "NodeJS"
  },
  {
    cate_id: 2,
    cate_name: "Vue3"
  }
];

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (!valid) {
      console.log("error submit!!");
      return false;
    }
    console.log("submit!", articleForm);
  });
};
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss" scoped></style>
