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
      <el-button size="default" type="primary" @click="clickInsert">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
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
        <template #action="{ row }">
          <el-link type="primary" @click="clickUpdate(row)" style="margin-right: 10px">
            修改
          </el-link>
          <el-link type="danger" @click="clickDelete(row)"> 删除 </el-link>
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
import { reactive, onMounted, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";
import { setColsConfig } from "@/components/PeakConfigTable";
import {
  reqSelectArticleList,
  reqDeleteArticle,
  type Article,
  ArticleStatus
} from "@/api/article";

const StatusType = {
  [ArticleStatus.审核中]: "warning",
  [ArticleStatus.通过]: "success",
  [ArticleStatus.未通过]: "danger"
};

const router = useRouter();

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
        formatter: (row) => (row.article_type == 1 ? "原创" : "转载")
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
        prop: "action",
        width: 120,
        fixed: "right"
      }
    ],
    {
      showOverflowTooltip: true
    }
  ),
  loading: false
});
let queryParams = ref<Article.ReqSelectArticleList>({
  currentPage: 1,
  pageSize: 10,
  status: ArticleStatus.通过,
  tag_ids: ""
});
let { currentPage, pageSize } = toRefs(queryParams.value);
let total = ref(0);

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

/**
 * @description 点击新增
 */
const clickInsert = () => {
  router.push({
    path: "/article/read-write"
  });
};

/**
 * @description 点击修改
 */
let rowUser = ref<Article.ArticleItem>();
const clickUpdate = (row: Article.ArticleItem) => {
  rowUser.value = row;
  router.push({
    name: "ArticleRW",
    // path: "/article/read-write",
    params: {
      article_id: row.article_id
    }
  });
};

/**
 * @description 点击删除
 * @param row
 */
const clickDelete = (row: Article.ArticleItem) => {
  ElMessageBox.confirm("此操作将永久删除该文章, 是否继续?", "提示", {
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
