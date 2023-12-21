<template>
  <el-card class="role-box">
    <div class="role-search">
      <el-input
        v-model="tableData.search"
        size="default"
        placeholder="请输入角色名称"
        clearable
        style="max-width: 180px; margin-right: 10px"
      >
      </el-input>
      <el-button size="default" type="primary" @click="clickSearch">
        <el-icon><Search /></el-icon>
        查询
      </el-button>
      <el-button size="default" type="primary" @click="clickInsertRole">
        <el-icon><Plus /></el-icon>
        新增角色
      </el-button>
    </div>
    <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="role_name"
        label="角色名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="role_key"
        label="角色字符"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="role_sort"
        label="排序"
        show-overflow-tooltip
        width="60"
      ></el-table-column>
      <el-table-column prop="status" label="角色状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag type="success" v-if="row.status === 1">启用</el-tag>
          <el-tag type="info" v-else-if="row.status === 0">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="角色描述"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="create_by"
        label="创建者"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="update_by"
        label="更新者"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="{ row }">
          <el-link
            type="primary"
            @click="clickUpdateRole(row)"
            style="margin-right: 10px"
          >
            修改
          </el-link>
          <el-link type="danger" @click="clickDeleteRole(row)"> 删除 </el-link>
        </template>
      </el-table-column>
    </el-table>
    <ActionDialog
      v-model:is-show-dialog="isShowDialog"
      :title="title"
      :row-role="rowRole"
      @select-role-list="selectRoleList"
    />
  </el-card>
</template>

<script setup lang="ts" name="Role">
import { reactive, onMounted, ref, watch } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import ActionDialog from "./ActionDialog.vue";
import { reqSelectRoleList, reqDeleteRole } from "@/api/role";

export interface Role {
  role_id?: number;
  role_name: string;
  role_key: string;
  role_sort: number;
  status: 1 | 0; // 1 正常 0 停用
  remark?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
}

// 定义变量内容
const tableData = reactive({
  data: [] as Role[],
  loading: false,
  search: ""
});

// 监听搜索, 空值重新查询
watch(
  () => tableData.search,
  (newVal) => {
    if (newVal === "") selectRoleList();
  }
);
/**
 * 查询角色
 */
async function selectRoleList() {
  tableData.loading = true;
  try {
    let result = await reqSelectRoleList({
      role_name: tableData.search,
      sort: ""
    });
    tableData.data = result.data;
  } catch (error) {
    console.log(error);
  } finally {
    tableData.loading = false;
  }
}

/**
 * 点击查询
 */
const clickSearch = () => {
  selectRoleList();
};

let isShowDialog = ref(false);
let title = ref("");
// 新增角色操作
const clickInsertRole = () => {
  title.value = "新增角色";
  isShowDialog.value = true;
};

// 编辑角色操作
let rowRole = ref(); // 要回显的角色
const clickUpdateRole = (row: Role) => {
  title.value = "编辑角色";
  isShowDialog.value = true;
  rowRole.value = row;
};

// 删除角色
const clickDeleteRole = (row: Role) => {
  ElMessageBox.confirm("此操作将永久删除该角色, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await reqDeleteRole({ ids: [row.role_id] });
      ElMessage.success("删除成功");
    } catch (error) {
      console.log(error);
    } finally {
      selectRoleList();
    }
  });
};

// 页面加载时
onMounted(() => {
  selectRoleList();
});
</script>

<style scoped lang="scss">
.role-box {
  width: 100%;
  height: 100%;
  .role-search {
    display: flex;
    margin-bottom: 20px;
  }
}
</style>
