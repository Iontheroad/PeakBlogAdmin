<script setup lang="tsx" name="Role">
import { reactive, ref, watch } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import ActionDialog from "./ActionDialog.vue";
import { reqSelectRoleList, reqDeleteRole, RoleItem } from "@/api/role";
import PermissionDrawer from "./PermissionDrawer.vue";
import { setColsConfig } from "@/components/PeakConfigTable";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";

// 定义变量内容
const tableData = reactive({
  data: [] as RoleItem[],

  loading: false,
  search: ""
});
const tableColumns = setColsConfig(
  [
    {
      type: "index",
      label: "序号",
      width: 80
    },
    {
      prop: "role_name",
      label: "角色名称",
      align: "left",
      width: 200
    },
    {
      prop: "role_key",
      label: "角色字符",
      width: 140
    },
    {
      prop: "order_num",
      label: "排序",
      width: 100
    },
    {
      prop: "status",
      label: "角色状态",
      width: 150,
      customRender({ row: { status } }) {
        return (
          <>
            <el-tag type={status === 1 ? "success" : "info"}>
              {status === 1 ? "启用" : "禁用"}
            </el-tag>
          </>
        );
      }
    },
    {
      prop: "operation",
      label: "操作",
      customRender({ row }) {
        return (
          <>
            <el-link type="success" onClick={() => clickPrivileges(row)}>
              分配权限
            </el-link>
            <el-link type="primary" class="mx-10" onClick={() => clickUpdateRole(row)}>
              修改
            </el-link>
            <el-link type="danger" onClick={() => clickDeleteRole(row)}>
              删除
            </el-link>
          </>
        );
      }
    }
  ],
  {
    align: "center"
  }
);

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
selectRoleList();

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
let rowRole = ref({} as RoleItem); // 要回显的角色
const clickUpdateRole = (row: RoleItem) => {
  title.value = "编辑角色";
  isShowDialog.value = true;
  rowRole.value = row;
};

// 删除角色
const clickDeleteRole = (row: RoleItem) => {
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

const isDrawerShow = ref(false);
/**
 * 分配权限
 */
function clickPrivileges(row) {
  rowRole.value = row;
  isDrawerShow.value = true;
}
</script>

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

    <PeakConfigTable
      :data="tableData.data"
      :table-columns="tableColumns"
      border
    ></PeakConfigTable>

    <ActionDialog
      v-model:is-show-dialog="isShowDialog"
      :title="title"
      :row-role="rowRole"
      @select-role-list="selectRoleList"
    />

    <PermissionDrawer v-model:is-visible="isDrawerShow" :row-item="rowRole" />
  </el-card>
</template>

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
