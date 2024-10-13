<template>
  <el-card class="user-box">
    <div class="user-search">
      <el-input
        v-model="username"
        size="default"
        placeholder="请输入用户名"
        clearable
        style="max-width: 180px; margin-right: 10px"
      >
      </el-input>
      <el-input
        v-model="nickname"
        size="default"
        placeholder="请输入用户昵称"
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
        新增
      </el-button>
    </div>

    <PeakConfigTable
      :data="tables.tableData"
      :table-columns="tables.tableColumns"
      :loading="tables.loading"
    >
      <template #state="{ row }">
        <el-tag type="success" v-if="row.state === 1">启用</el-tag>
        <el-tag type="danger" v-else-if="row.state === 2">禁用</el-tag>
      </template>
      <template #action="{ row }">
        <el-link type="primary" @click="clickUpdate(row)" style="margin-right: 10px">
          修改
        </el-link>
        <el-link type="danger" @click="clickDelete(row)"> 删除 </el-link>
      </template>
    </PeakConfigTable>

    <ActionDialog
      v-model:is-show-dialog="isShowDialog"
      :title="title"
      :row-user="rowUser"
      @select-user-list="selectUserList"
    />
  </el-card>
</template>

<script setup lang="tsx" name="User">
import { reactive, onMounted, ref, watch } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";
import { setColsConfig } from "@/components/PeakConfigTable";
import ActionDialog from "./ActionDialog.vue";
import { reqSelectUserList, reqDeleteUser, type User } from "@/api/user";

const tables = reactive({
  tableData: [] as User[],
  tableColumns: setColsConfig([
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
      prop: "roles",
      label: "角色",
      showOverflowTooltip: true,
      formatter(row) {
        return row.roles.map((role) => (
          <el-tag type="info" size="small" class="mr-4">
            {role.role_name}
          </el-tag>
        ));
      }
    },
    {
      prop: "sex",
      label: "性别",
      showOverflowTooltip: true,
      formatter: (row: User) => (row.sex === "m" ? "男" : row.sex === "w" ? "女" : "未知")
    },
    {
      prop: "age",
      label: "年龄",
      showOverflowTooltip: true,
      formatter: (row: User) => row.age + "岁"
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
      showOverflowTooltip: true
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
    },
    {
      label: "操作",
      prop: "action",
      width: 150
    }
  ]),
  loading: false
});

// 监听搜索, 空值重新查询
let username = ref("");
let nickname = ref("");
watch(username, (newVal) => !newVal && selectUserList());
watch(nickname, (newVal) => !newVal && selectUserList());
/**
 * 查询用户
 */
async function selectUserList() {
  tables.loading = true;
  try {
    let result = await reqSelectUserList({
      username: username.value,
      nickname: nickname.value
    });
    console.log(result);

    tables.tableData = result.data;
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
  selectUserList();
};

let isShowDialog = ref(false);
let title = ref("");
// 新增用户操作
const clickInsertRole = () => {
  title.value = "新增用户";
  isShowDialog.value = true;
};

// 编辑用户操作
let rowUser = ref<User>(); // 要回显的用户
const clickUpdate = (row: User) => {
  title.value = "编辑用户";
  isShowDialog.value = true;
  rowUser.value = row;
};

// 删除用户
const clickDelete = (row: User) => {
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await reqDeleteUser({ ids: [row.user_id!] });
      ElMessage.success("删除成功");
    } catch (error) {
      console.log(error);
    } finally {
      selectUserList();
    }
  });
};

// 页面加载时
onMounted(() => {
  selectUserList();
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
