<script setup lang="tsx">
import { reqGetMenuList, reqDeleteMenu, MenuType, MenuItem } from "@/api/menu";
import { ref, nextTick, h, computed } from "vue";
import { ElTag, ElMessageBox, ElMessage } from "element-plus";
import { Plus, Sort } from "@element-plus/icons-vue";
import PeakConfigTable from "@/components/PeakConfigTable/index.vue";
import { setColsConfig } from "@/components/PeakConfigTable/index";
import ActionDialog from "./ActionDialog.vue";
const menuType = [
  {
    label: "目录",
    value: MenuType["目录"],
    type: "primary"
  },
  {
    label: "菜单",
    value: MenuType["菜单"],
    type: "success"
  },
  {
    label: "按钮",
    value: MenuType["按钮"],
    type: "warning"
  }
];

const menuList = ref([]);
const menuOptions = computed(() => {
  return [{ menu_id: 0, menu_name: "主类目", children: menuList.value }];
});
/**
 * 获取菜单列表
 */
async function getMenuList() {
  try {
    let result = await reqGetMenuList();
    menuList.value = result.data;
  } catch (error) {}
}
getMenuList();
const tableColumns = setColsConfig(
  [
    {
      prop: "menu_name",
      label: "菜单名称",
      align: "left",
      width: 200
    },
    {
      prop: "menu_type",
      label: "菜单类型",
      width: 100,
      customRender({ row }) {
        return (
          <>
            <el-tag type={menuType.find((item) => item.value === row.menu_type)?.type}>
              {menuType.find((item) => item.value === row.menu_type)?.label}
            </el-tag>
          </>
        );
      }
    },
    {
      prop: "route_name",
      label: "路由别名",
      width: 140
    },
    {
      prop: "path",
      label: "路由地址"
    },
    {
      prop: "component",
      label: "组件路径"
    },
    {
      prop: "perms",
      label: "权限标识",
      customRender: ({ row }) => h(ElTag, { type: "info" }, () => row.perms)
    },
    {
      prop: "order_num",
      label: "排序",
      width: 100
    },
    {
      prop: "operation",
      label: "操作",
      width: 200,
      customRender({ row }) {
        return (
          <>
            {row.menu_type !== MenuType["按钮"] && (
              <el-link type="success" onClick={() => handleAdd(row)}>
                新增
              </el-link>
            )}
            <el-link type="primary" class="mx-10" onClick={() => clickUpdateRole(row)}>
              修改
            </el-link>
            <el-link type="danger" onClick={() => clickDeleteMenu(row)}>
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

const rowItem = ref<MenuItem>({} as MenuItem);
let isShowDialog = ref(false);
let title = ref("");
/**
 * 新增按钮操作
 */
function handleAdd(row: MenuItem) {
  rowItem.value = {
    menu_id: 0,
    parent_id: 0,
    menu_name: "",
    route_name: "",
    path: "",
    component: "",
    target: "blank",
    menu_type: MenuType["目录"],
    active_menu: null,
    icon: "",
    order_num: 0,
    is_link: 0,
    is_keep_alive: 0,
    is_hidden: 0,
    is_disabled: 0,
    is_refresh: 0,
    is_affix: 0,
    is_full: 0,
    is_always_show: 0,
    perms: "",
    remark: ""
  };
  if (row != null && row.menu_id) {
    rowItem.value.parent_id = row.menu_id;
  } else {
    rowItem.value.parent_id = 0;
  }
  isShowDialog.value = true;
  title.value = "添加菜单";
}

/**
 * 删除
 * @param row
 */
const clickDeleteMenu = (row: MenuItem) => {
  ElMessageBox.confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await reqDeleteMenu({ ids: [row.menu_id] });
      ElMessage.success("删除成功");
    } catch (error) {
      console.log(error);
    } finally {
      getMenuList();
    }
  });
};
/**
 * 编辑
 * @param row
 */
const clickUpdateRole = (row) => {
  isShowDialog.value = true;
  rowItem.value = row;
  title.value = "编辑菜单";
};

const refreshTable = ref(true);
const isExpandAll = ref(false);
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
</script>

<template>
  <el-card
    header="菜单管理"
    class="menu_box flex flex-col"
    body-class="flex-1 flex flex-col overflow-hidden"
  >
    <el-row :gutter="10" class="mb-10">
      <el-col :span="1.5">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain :icon="Sort" @click="toggleExpandAll">
          展开/折叠
        </el-button>
      </el-col>
    </el-row>

    <PeakConfigTable
      v-if="refreshTable"
      :data="menuList"
      :table-columns="tableColumns"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      flex-1
      row-key="menu_id"
      border
      :default-expand-all="isExpandAll"
    ></PeakConfigTable>

    <ActionDialog
      v-model:is-show-dialog="isShowDialog"
      :title="title"
      :menu-options="menuOptions"
      :row-item="rowItem"
      @get-menu-list="getMenuList"
    />
  </el-card>
</template>

<style scoped lang="scss">
.menu_box {
  width: 100%;
  height: 100%;
}
</style>
