<template>
  <el-card class="role_box">
    <div>
      <div>
        <el-input
          v-model="tableData.search"
          size="default"
          placeholder="请输入角色名称"
          style="max-width: 180px"
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
        ></el-table-column>
        <el-table-column prop="status" label="角色状态" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
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
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="clickUpdateRole(row)">
              修改
            </el-button>
            <el-button size="small" text type="primary" @click="clickDeleteRole(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DialogVue v-model:is-show-dialog="isShowDialog" :title="title" :row-role="rowRole" />
  </el-card>
</template>

<script setup lang="ts" name="Role">
import { reactive, onMounted, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import DialogVue from "./dialog.vue";
import { reqSelectRoleList, reqDeleteRole } from "@/api/role";

export interface Role {
  role_id?: number;
  role_name: string;
  role_key: string;
  role_sort: number;
  status: number;
  remark?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
}

// 定义变量内容
const tableData = reactive({
  data: [
    // {
    //   role_id: 1,
    //   role_name: "管理员",
    //   role_key: "admin",
    //   role_sort: 1,
    //   status: 1, // 1 正常 0 停用
    //   create_by: "admin",
    //   create_time: "2021-10-10 10:10:10",
    //   update_by: "",
    //   update_time: "",
    //   remark: "管理员 "
    // }
  ] as Role[],
  loading: false,
  search: ""
});

// 查询角色
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

// 点击查询
const clickSearch = () => {
  selectRoleList();
};

let isShowDialog = ref(false);
let title = ref("");
// 打开新增角色弹窗
const clickInsertRole = () => {
  title.value = "新增角色";
  isShowDialog.value = true;
};

// 打开修改角色弹窗
let rowRole = ref();
const clickUpdateRole = (row: Role) => {
  title.value = "修改角色";
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
      selectRoleList();
    } catch (error) {
      console.log(error);
    }
  });
};

// 页面加载时
onMounted(() => {
  selectRoleList();
});
</script>

<style scoped lang="scss">
.role_box {
  width: 100%;
  height: 100%;
}
</style>
