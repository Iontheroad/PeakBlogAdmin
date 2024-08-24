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
        <template #article_type="{ row }">
          <el-tag type="info" v-if="row.article_type === 1">原创</el-tag>
          <el-tag type="info" v-else-if="row.article_type === 2">转载</el-tag>
        </template>
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
        <!-- <template #action="{ row }">
          <el-link type="primary" @click="clickUpdate(row)" style="margin-right: 10px">
            修改
          </el-link>
          <el-link type="danger" @click="clickDelete(row)"> 删除 </el-link>
        </template> -->
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

<script setup lang="ts">
import { reactive, onMounted, ref, toRefs } from "vue";
import type { TabsPaneContext } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";
import { setColsConfig } from "@/components/PeakConfigTable";
import {
  reqSelectArticleList,
  // reqArticleReview,
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
  tableColumns: setColsConfig([
    {
      type: "index",
      label: "序号",
      width: 60
    },
    {
      prop: "article_title",
      label: "文章标题",
      showOverflowTooltip: true,
      customRender() {
        return "asdasds";
      }
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
      label: "文章类型"
      // formatter: (row) => (row.article_type == 1 ? "原创" : "转载")
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
      label: "文章分类",
      showOverflowTooltip: true
    },
    {
      prop: "tags",
      label: "文章标签",
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
      width: 120,
      fixed: "right"
    }
  ]),
  loading: false
});
let queryParams = ref<Article.ReqSelectArticleList>({
  currentPage: 1,
  pageSize: 10,
  status: ArticleStatus.审核中,
  tag_ids: ""
});
let { currentPage, pageSize, status } = toRefs(queryParams.value);
let total = ref(0);
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

/**
 * @description 点击查询
 */
const clickSearch = () => {
  selectArticleList();
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
