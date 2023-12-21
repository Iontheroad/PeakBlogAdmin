<template>
  <el-card class="user-box">
    <div class="user-search">
      <el-input
        v-model="tableData.search"
        size="default"
        placeholder="请输入用户名称"
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
        新增用户
      </el-button>
    </div>
    <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        v-bind="column"
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
  user_id?: number;
  username: string;
  nickname: string;
  sex: string;
  age: string;
  address: string;
  phone: string;
  email: string;
  state: 1 | 0; // 1 正常 2 禁用
  create_time?: string;
  update_time?: string;
}

// TODO: 封装表格,完善用户
let columns = [
  {
    prop: "username",
    label: "用户名",
    showOverflowTooltip: true,
    width: 100
  },
  {
    prop: "nickname",
    label: "用户昵称",
    showOverflowTooltip: true
  },
  {
    prop: "sex",
    label: "性别",
    showOverflowTooltip: true
  },
  {
    prop: "age",
    label: "年龄",
    showOverflowTooltip: true
  },
  {
    prop: "address",
    label: "地址",
    showOverflowTooltip: true
  },
  {
    prop: "phone",
    label: "手机号",
    showOverflowTooltip: true
  },
  {
    prop: "email",
    label: "邮箱",
    showOverflowTooltip: true
  },
  {
    prop: "state",
    label: "用户状态",
    showOverflowTooltip: true,
    slot: "state"
  },
  {
    prop: "create_time",
    label: "创建时间",
    showOverflowTooltip: true
  },
  {
    prop: "update_time",
    label: "更新时间",
    showOverflowTooltip: true
  }
];

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
 * 查询用户
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
// 新增用户操作
const clickInsertRole = () => {
  title.value = "新增用户";
  isShowDialog.value = true;
};

// 编辑用户操作
let rowRole = ref(); // 要回显的用户
const clickUpdateRole = (row: Role) => {
  title.value = "编辑用户";
  isShowDialog.value = true;
  rowRole.value = row;
};

// 删除用户
const clickDeleteRole = (row: Role) => {
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
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
.user-box {
  width: 100%;
  height: 100%;
  .user-search {
    display: flex;
    margin-bottom: 20px;
  }
}
</style>
