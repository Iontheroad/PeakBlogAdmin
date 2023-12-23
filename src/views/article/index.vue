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
      <el-button size="default" type="primary" @click="clickSearch">
        <el-icon><Search /></el-icon>
        查询
      </el-button>
      <el-button size="default" type="primary" @click="clickInsertRole">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
    </div>
    <el-tabs v-model="status" @tab-click="clickArticleStatus">
      <el-tab-pane label="审核中" :name="1"></el-tab-pane>
      <el-tab-pane label="通过" :name="2"></el-tab-pane>
      <el-tab-pane label="未通过" :name="3"></el-tab-pane>
    </el-tabs>
    <PeakTable
      :table-data="tables.tableData"
      :table-columns="tables.tableColumns"
      :loading="tables.loading"
    >
      <template #article_type="{ row }">
        <el-tag type="info" v-if="row.article_type === 1">原创</el-tag>
        <el-tag type="info" v-else-if="row.article_type === 2">转载</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag type="warning" v-if="row.status === 1">审核中</el-tag>
        <el-tag type="success" v-else-if="row.status === 2">通过</el-tag>
        <el-tag type="danger" v-else-if="row.status === 3">未通过</el-tag>
      </template>
      <template #comment_status="{ row }">
        <el-tag type="success" v-if="row.comment_status === 1">开启</el-tag>
        <el-tag type="danger" v-else-if="row.comment_status === 2">关闭</el-tag>
      </template>
      <template #action="{ row }">
        <el-link type="primary" @click="clickUpdate(row)" style="margin-right: 10px">
          修改
        </el-link>
        <el-link type="danger" @click="clickDelete(row)"> 删除 </el-link>
      </template>
    </PeakTable>
    <el-pagination
      style="margin-top: 10px"
      v-show="total"
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      :total="total"
      layout="total, sizes, prev, pager, next"
    />
  </el-card>
</template>

<script setup lang="ts" name="Article">
import { reactive, onMounted, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage, type TabsPaneContext } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import PeakTable from "@/components/PeakTable/index.vue";
import {
  reqSelectArticleList,
  reqDeleteArticle,
  // reqArticleReview,
  type Article
} from "@/api/article";

const router = useRouter();

onMounted(() => {
  selectArticleList();
});

const tables = reactive({
  tableData: [] as Article[],
  tableColumns: [
    {
      type: "index",
      label: "序号",
      width: 60
    },
    {
      prop: "article_title",
      label: "文章标题",
      showOverflowTooltip: true
    },
    {
      prop: "article_digest",
      label: "摘要",
      showOverflowTooltip: true
    },
    {
      prop: "article_cover",
      label: "封面",
      showOverflowTooltip: true
    },
    {
      prop: "article_type",
      slot: "article_type",
      label: "文章类型"
      // formatter: (row) => (row.article_type == 1 ? "原创" : "转载")
    },
    {
      prop: "status",
      slot: "status",
      label: "文章状态"
    },
    {
      prop: "comment_status",
      slot: "comment_status",
      label: "评论状态"
    },
    {
      prop: "category_id",
      label: "文章分类",
      showOverflowTooltip: true
    },
    {
      prop: "create_by",
      label: "创建人",
      showOverflowTooltip: true
    },
    {
      prop: "create_time",
      label: "创建时间",
      showOverflowTooltip: true
    },
    {
      prop: "update_by",
      slot: "state",
      label: "更新人",
      showOverflowTooltip: true
    },
    {
      prop: "update_time",
      label: "更新时间",
      showOverflowTooltip: true
    },
    {
      label: "操作",
      prop: "action",
      slot: "action",
      width: 120,
      fixed: "right"
    }
  ],
  loading: false
});
let queryParams = ref({
  currentPage: 1,
  pageSize: 10,
  status: 1 as Article["status"]
});
let { currentPage, pageSize, status } = toRefs(queryParams.value);
let total = ref(0);
const clickArticleStatus = (tab: TabsPaneContext) => {
  status.value = tab.props.name as Article["status"];
  selectArticleList();
};
/**
 * 查询文章
 */
async function selectArticleList() {
  tables.loading = true;
  try {
    let result = await reqSelectArticleList({
      currentPage: 1,
      pageSize: 10,
      status: status.value
    });

    tables.tableData = result.data;
    total.value = result?.total;
  } catch (error) {
    console.log(error);
  } finally {
    tables.loading = false;
  }
}

/**
 * 点击查询
 */
const clickSearch = () => {
  selectArticleList();
};

let isShowDialog = ref(false);
let title = ref("");
// 新增用户操作
const clickInsertRole = () => {
  router.push("/article/read-write");
};

// 编辑用户操作
let rowUser = ref<Article>(); // 要回显的用户
const clickUpdate = (row: Article) => {
  title.value = "编辑用户";
  isShowDialog.value = true;
  rowUser.value = row;
};

// 删除用户
const clickDelete = (row: Article) => {
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await reqDeleteArticle({ ids: [row.article_id] });
      ElMessage.success("删除成功");
    } catch (error) {
      console.log(error);
    } finally {
      selectArticleList();
    }
  });
};
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
