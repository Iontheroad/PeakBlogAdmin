<template>
  <el-card class="article-read-write">
    <el-form
      ref="articleFormRef"
      :model="articleForm"
      size="default"
      label-width="90px"
      label-suffix=":"
      :rules="articleFormRules"
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
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
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
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            prop="article_content"
            label="文章内容"
            style="display: flex; flex-direction: column"
          >
            <!-- <WangEditor v-model="articleForm.article_content" /> -->
            <MdEditorV3 v-model="articleForm.article_content" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">预览</el-button>
        <el-button type="primary" @click="submitForm(articleFormRef)">提交</el-button>
        <el-button @click="cancel(articleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="dialogVisible"
      :title="articleForm.article_title"
      width="1300px"
      top="50px"
    >
      <div class="view" v-html="articleForm.article_content"></div>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
// import WangEditor from "@/components/WangEditor/index.vue";
import MdEditorV3 from "@/components/MdEditorV3/index.vue";
import { reqSelectCategory, type Category } from "@/api/category";
import {
  reqSelectArticle,
  reqInsertArticle,
  reqUpdateArticle,
  type Article
} from "@/api/article";
const router = useRouter();
const route = useRoute();

let dialogVisible = ref(false);
const articleFormRef = ref<FormInstance>();
const articleForm = reactive<Article.ReqInsertArticle>({
  article_title: "",
  article_digest: "",
  article_cover: "",
  article_type: 1,
  category_id: "",
  comment_status: 1,
  article_content: ""
});
const articleFormRules = {
  article_title: [{ required: true, message: "文章标题不能为空", trigger: "blur" }],
  article_digest: [
    {
      required: true,
      message: "文章摘要不能为空",
      trigger: ["change"]
    }
  ],
  article_type: [
    {
      required: true,
      message: "文章类型不能为空",
      trigger: "change"
    }
  ],
  category_id: [
    {
      required: true,
      message: "文章分类不能为空",
      trigger: ["blur"]
    }
  ],
  article_content: [
    {
      required: true,
      message: "文章内容不能为空",
      trigger: ["change"]
    }
  ],
  comment_status: [
    {
      required: true,
      message: "评论状态不能为空",
      trigger: ["change"]
    }
  ]
};
const categoryList = ref<Category[]>([]);

/**
 * 获取文章分类
 */
async function selectCategory() {
  try {
    let result = await reqSelectCategory();
    categoryList.value = result.data;
  } catch (error) {
    console.log(error);
  }
}

const article_id = computed(() => route.query.article_id as unknown as number);
onMounted(() => {
  selectCategory();
  if (article_id.value) selectArticle();
});
async function selectArticle() {
  try {
    let result = await reqSelectArticle({ article_id: article_id.value });
    result.data.category_id = result.data.category_id.split(",").map(Number);
    Object.assign(articleForm, result.data);
  } catch (error) {
    console.log(error);
  }
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return ElMessage.warning("请检查表单内容");
    try {
      articleForm.category_id = (articleForm.category_id as unknown as number[]).join(
        ","
      ); // 转换为字符串
      let result = null;
      if (article_id.value) {
        result = await reqUpdateArticle({ ...articleForm, article_id: article_id.value });
      } else if (!article_id.value) {
        result = await reqInsertArticle(articleForm);
      }
      if (result?.code == 200) {
        router.back();
        ElMessage.success("操作成功");
      }
    } catch (error) {
      console.log(error);
    }
  });
};
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  router.back();
};
</script>

<style lang="scss" scoped></style>
