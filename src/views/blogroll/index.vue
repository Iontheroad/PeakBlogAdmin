<template>
  <el-card class="category">
    <!-- 操作栏 -->
    <div class="top-action">
      <div class="action-left">
        <el-button type="primary" :icon="CirclePlus" @click="addBlogroll">新增</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :plain="!selectIds.length"
          @click="clickBatchDelete"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="main-table">
      <PeakConfigTable
        :data="tables.tableData"
        :table-columns="tableColumns"
        v-loading="tables.loading"
        @selection-change="handleSelectionChange"
      >
        <template #site_url="{ row }">
          <el-link :href="row.site_url" type="success">{{ row.site_url }}</el-link>
        </template>
        <template #site_icon="{ row }">
          <el-image
            :src="row.site_icon"
            :preview-src-list="[row.site_icon]"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="0"
            :preview-teleported="true"
            fit="cover"
          />
        </template>
        <template #is_active="{ row }">
          <!-- <el-switch
            v-model="ruleForm.is_active"
            inline-prompt
            :active-value="1"
            active-text="正常"
            :inactive-value="0"
            inactive-text="禁用"
          ></el-switch> -->
          <el-tag :closable="false" :type="row.is_active ? 'success' : 'danger'">
            {{ row.is_active ? "正常" : "禁用" }}
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-link type="info" @click="editBlogroll(row)">编辑</el-link>
          <el-popconfirm
            confirm-button-text="确定"
            confirm-button-type="danger"
            cancel-button-text="取消"
            icon-color="#f62226"
            title="是否确定删除该条数据?"
            @confirm="confirmEventRemove(row)"
          >
            <template #reference>
              <el-link style="margin-left: 10px" type="danger">删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </PeakConfigTable>
    </div>

    <!--添加  -->
    <el-dialog
      v-model="dialogVisible"
      title="申请友链"
      style="border-radius: 10px; max-width: 600px"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        size="default"
        status-icon
      >
        <el-form-item label="网站名称" prop="site_name" :inline-message="true">
          <el-input v-model="ruleForm.site_name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站链接" prop="site_url">
          <el-input v-model="ruleForm.site_url" placeholder="请输入网站链接" />
        </el-form-item>
        <el-form-item label="网站图标" prop="site_icon">
          <el-input v-model="ruleForm.site_icon" placeholder="请输入网站图标链接" />
          <p>默认为网站链接下的/favicon.ico</p>
        </el-form-item>
        <el-form-item label="网站描述" prop="description">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            placeholder="请输入网站描述"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="友链状态" prop="is_active">
          <el-switch
            v-model="ruleForm.is_active"
            inline-prompt
            :active-value="1"
            active-text="正常"
            :inactive-value="0"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup name="TableOneRowCheck">
import { reactive, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
// import ImageViewer from "@element-plus/components/image-viewer";
import {
  reqSelectBlogroll,
  reqInsertBlogroll,
  reqUpdateBlogroll,
  reqDeleteBlogroll,
  type Blogroll
} from "@/api/blogroll.ts";

onMounted(() => {
  selectBlogroll();
});
const tableColumns = [
  {
    type: "selection",
    label: "序号",
    width: 60
  },
  {
    prop: "site_name",
    label: "网站名称",
    width: "100px"
  },
  {
    prop: "site_url",
    label: "网站链接",
    showOverflowTooltip: true as any,
    width: "220px"
  },
  {
    prop: "site_icon",
    label: "网站图标",
    width: "140px"
  },
  {
    prop: "description",
    label: "网站描述",
    minWidth: "200px"
    // formatter: (row) => (row.article_type == 1 ? "原创" : "转载")
  },
  {
    prop: "email",
    label: "邮箱",
    width: "120px"
  },
  {
    prop: "is_active",
    label: "友链状态",
    width: "100px"
  },
  {
    prop: "create_time",
    label: "创建时间",
    width: "180px"
  },
  {
    prop: "update_time",
    label: "更新时间",
    width: "180px"
  },
  {
    label: "操作",
    prop: "action",
    width: 120,
    fixed: "right"
  }
];
const tables = reactive({
  tableData: [],
  loading: false
}) as {
  tableData: Blogroll.BlogrollItem[];
  loading: boolean;
};
/**
 * 查询
 */
async function selectBlogroll() {
  try {
    let result = await reqSelectBlogroll({
      currentPage: 1,
      pageSize: 10
    });
    tables.tableData = result.data;
  } catch (error) {
    console.log(error);
  }
}

/** 表格多选 */
let selectIds = ref<number[]>([]);
const handleSelectionChange = (val: Blogroll.BlogrollItem[]) => {
  selectIds.value = val.map((item) => item.id);
};

/**
 * 点击批量删除
 */
const clickBatchDelete = () => {
  if (!selectIds.value.length) ElMessage.warning("请选择要删除的数据");
  ElMessageBox.confirm("此操作将永久删除该友链, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    deleteCategory(selectIds.value);
  });
};

/**
 * 确定 删除
 */
const confirmEventRemove = async (row: Blogroll.BlogrollItem) => {
  await deleteCategory([row.id]);
};

/**
 * 删除事件
 * @param ids
 */
async function deleteCategory(ids: number[]) {
  try {
    await reqDeleteBlogroll({ ids });
    ElMessage.success({
      message: "删除成功",
      showClose: true
    });
  } catch (error) {
  } finally {
    selectBlogroll();
  }
}

const ruleFormRef = ref<FormInstance>();

const rules = reactive({
  site_name: [{ required: true, message: "请填写网站名称", trigger: "blur" }],
  site_url: [
    {
      required: true,
      message: "请填写网站链接",
      trigger: "change"
    }
  ],
  // site_icon: [
  //   {
  //     required: true,
  //     message: "请填写网站图标链接",
  //     trigger: "change"
  //   }
  // ],
  description: [
    {
      required: true,
      message: "请填写网站描述",
      trigger: "change"
    }
  ],
  email: [
    {
      required: false,
      message: "请填写联系邮箱",
      trigger: "change"
    }
  ],
  is_active: [
    {
      required: true,
      message: "请设置友链状态",
      trigger: "change"
    }
  ]
});
const ruleForm = reactive<Blogroll.ReqInsertUpdateBlogroll>({
  // id: undefined,
  site_name: "",
  site_url: "",
  site_icon: "",
  email: "",
  description: "",
  is_active: 1
});
const dialogVisible = ref(false);
const addBlogroll = () => {
  dialogVisible.value = true;
};
const editBlogroll = (row: Blogroll.BlogrollItem) => {
  Object.assign(ruleForm, row);
  dialogVisible.value = true;
};

/**
 * @description 提交
 */
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (!ruleForm?.id) {
          let result = await reqInsertBlogroll(ruleForm);
          ElMessage.success(result?.msg);
        } else {
          let result = await reqUpdateBlogroll(ruleForm);
          ElMessage.success(result?.msg);
        }
        resetForm(ruleFormRef.value);
      } catch (error) {
        console.log(error);
      } finally {
        selectBlogroll();
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.category {
  .top-action {
    .action-left {
      display: flex;
    }
  }

  // 表格
  .main-table {
    margin: 10px 0;
  }
}
</style>
