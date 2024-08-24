<template>
  <el-card class="article-box">
    <div class="user-search">
      <!-- <el-input
        v-model="username"
        size="default"
        placeholder="请输入用户名"
        clearable
        style="max-width: 180px; margin-right: 10px"
      >
      </el-input> -->
      <!-- <el-button size="default" type="primary" @click="clickSearch">
        <el-icon><Search /></el-icon>
        查询
      </el-button> -->
    </div>
    <div>
      <el-tabs v-model="status" @tab-click="clickArticleStatus">
        <el-tab-pane label="审核中" :name="ArticleStatus.审核中"></el-tab-pane>
        <el-tab-pane label="通过" :name="ArticleStatus.通过"></el-tab-pane>
        <el-tab-pane label="未通过" :name="ArticleStatus.未通过"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <PeakConfigTable
        :data="tables.tableData"
        :table-columns="tables.tableColumns"
        :loading="tables.loading"
        border
      >
        <template #status="{ row }">
          <el-tag :type="StatusType[row.status]">
            {{ ArticleStatus[row.status] }}
          </el-tag>
        </template>
        <template #comment_status="{ row }">
          <el-tag type="success" v-if="row.comment_status === 1">开启</el-tag>
          <el-tag type="danger" v-else-if="row.comment_status === 2">关闭</el-tag>
        </template>
        <template #category="{ row }">
          <el-tag type="success" size="small">{{ row.category.cate_name }} </el-tag>
        </template>
        <template #tags="{ row }">
          <el-tag type="success" size="small" v-for="item in row.tags" :key="item.tag_id">
            {{ item.tag_name }}
          </el-tag>
        </template>
        <!-- FIXME: 文章审核按钮 -->
        <template #action="{ row }">
          <el-link type="primary" @click="clickReview(row)"> 审核 </el-link>
          <!-- <el-link type="danger" @click="clickDelete(row)"> 删除 </el-link> -->
        </template>
      </PeakConfigTable>
    </div>
    <div>
      <el-pagination
        style="margin-top: 10px"
        v-show="total"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :total="total"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </el-card>
</template>

<script setup lang="tsx">
import { reactive, onMounted, ref, toRefs, h } from "vue";
import { ElMessage, ElTag, type TabsPaneContext } from "element-plus";
// import { Search } from "@element-plus/icons-vue";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";
import { setColsConfig } from "@/components/PeakConfigTable";
import { usePeakDialog } from "@/hooks/usePeakDialog";
import {
  reqSelectArticleList,
  reqArticleReview,
  type Article,
  ArticleStatus
} from "@/api/article";

const StatusType = {
  [ArticleStatus.审核中]: "warning",
  [ArticleStatus.通过]: "success",
  [ArticleStatus.未通过]: "danger"
};

onMounted(() => {
  selectArticleList();
});

const tables = reactive({
  tableData: [] as Article.ArticleItem[],
  tableColumns: setColsConfig(
    [
      {
        type: "index",
        label: "序号",
        width: 60
      },
      {
        prop: "article_title",
        label: "文章标题"
      },
      {
        prop: "article_digest",
        label: "摘要"
      },
      {
        prop: "article_cover",
        label: "封面"
      },
      {
        prop: "article_type",
        label: "文章类型",
        // formatter: (row) => (row.article_type == 1 ? "原创" : "转载")
        formatter: (row) =>
          h(ElTag, null, { default: () => (row.article_type == 1 ? "原创" : "转载") })
      },
      {
        prop: "status",
        label: "文章状态"
      },
      {
        prop: "comment_status",
        label: "评论状态"
      },
      {
        prop: "category",
        label: "文章分类"
      },
      {
        prop: "tags",
        label: "文章标签"
      },
      {
        prop: "create_by",
        label: "创建人"
      },
      {
        prop: "create_time",
        label: "创建时间"
      },
      {
        prop: "update_by",
        label: "更新人"
      },
      {
        prop: "update_time",
        label: "更新时间"
      },
      {
        label: "操作",
        align: "center",
        prop: "action",
        width: 120,
        fixed: "right"
      }
    ],
    {
      align: "center",
      showOverflowTooltip: true
    }
  ),
  loading: false
});
const queryParams = ref<Article.ReqSelectArticleList>({
  currentPage: 1,
  pageSize: 10,
  status: ArticleStatus.审核中,
  tag_ids: ""
});
const { currentPage, pageSize, status } = toRefs(queryParams.value);
const total = ref(0);
const clickArticleStatus = (tab: TabsPaneContext) => {
  status.value = tab.props.name as Article.ReqSelectArticleList["status"];
  selectArticleList();
};
/**
 * @description 查询文章
 */
async function selectArticleList() {
  tables.loading = true;
  try {
    let result = await reqSelectArticleList(queryParams.value);

    tables.tableData = result.data;
    total.value = result?.total;
  } catch (error) {
    console.log(error);
  } finally {
    tables.loading = false;
  }
}

// /**
//  * @description 点击查询
//  */
// const clickSearch = () => {
//   selectArticleList();
// };

const reviewDialog = usePeakDialog();
/**
 * @description 点击审核
 */
function clickReview(row: Article.ArticleItem) {
  const ruleFormRef = ref(null);
  const rules = reactive({
    status: [
      {
        required: true,
        message: "请设置友链状态",
        trigger: "change"
      }
    ]
    // noPass_reason: [
    //   {
    //     required: true,
    //     message: "请填写网站描述",
    //     trigger: "change"
    //   }
    // ]
  });

  const ruleForm = reactive({
    article_id: undefined,
    noPass_reason: "",
    status: 1
  });
  if (row?.article_id) Object.assign(ruleForm, row);

  reviewDialog.init({
    title: "文章审核",
    attrs: { width: "500px" },
    default: ({ confirm }) => {
      return (
        <el-form
          ref={ruleFormRef}
          rules={rules}
          model={ruleForm}
          label-width="auto"
          status-icon
        >
          <el-form-item label="是否通过" prop="status">
            <el-switch
              v-model={ruleForm.status}
              inline-prompt
              active-value={ArticleStatus.通过}
              active-text="通过"
              inactive-value={ArticleStatus.未通过}
              inactive-text="未通过"
            ></el-switch>
          </el-form-item>
          {ruleForm.status == ArticleStatus.未通过 && (
            <el-form-item label="未通过原因" prop="noPass_reason">
              <el-input
                v-model={ruleForm.noPass_reason}
                type="textarea"
                placeholder="请输入未通过原因"
              />
            </el-form-item>
          )}
          <div class="flex justify-end">
            <el-button type="default" onClick={() => reviewDialog.close()}>
              取消
            </el-button>
            <el-button type="primary" onClick={() => confirm(ruleFormRef.value)}>
              确定
            </el-button>
          </div>
        </el-form>
      );
    },
    confirm: (formEl) => {
      if (!formEl) return;
      formEl.validate(async (valid, fields) => {
        if (valid) {
          try {
            const result = await reqArticleReview(ruleForm);
            ElMessage.success(result?.msg);

            reviewDialog.close();
          } catch (error) {
            console.log(error);
          } finally {
            selectArticleList();
          }
        } else {
          console.log("error submit!", fields);
        }
      });
    }
  });
}
</script>

<style scoped lang="scss">
.article-box {
  width: 100%;
  height: 100%;
  .user-search {
    display: flex;
    margin-bottom: 20px;
  }
}
</style>
