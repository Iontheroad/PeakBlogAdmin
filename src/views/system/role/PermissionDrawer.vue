<script lang="ts" setup name="PermissionDrawer">
import {
  reqSelectRoleSelectedMenu,
  reqUpdateRoleSelectedMenu,
  RoleItem
} from "@/api/role";
import { reqGetMenuList, MenuItem, menuType } from "@/api/menu";
import { computed, ref, watch } from "vue";
import { ElMessage, ElTree } from "element-plus";
const props = defineProps<{
  isVisible: boolean;
  rowItem: RoleItem;
}>();

const emits = defineEmits<{
  "update:isVisible": [value: boolean];
}>();

// 菜单权限下拉
const menuPermOptions = ref<MenuItem[]>([]);
/**
 * 查询菜单选项
 */
async function getMenuList() {
  try {
    let result = await reqGetMenuList();
    console.log(result);
    menuPermOptions.value = result.data;
  } catch (error) {
    console.log(error);
  }
}
getMenuList();

const permTreeRef = ref<InstanceType<typeof ElTree>>(null);
/**
 * 查询角色拥有的菜单
 */
async function selectRoleSelectedMenu() {
  try {
    let result = await reqSelectRoleSelectedMenu({ role_id: props.rowItem.role_id });
    console.log(result);
    result.data.forEach((menuId) => permTreeRef?.value?.setChecked(menuId, true, false));
  } catch (error) {
    console.log(error);
  }
}
const isOpenDrawer = computed({
  get: () => props.isVisible,
  set: (newVal) => emits("update:isVisible", newVal)
});
watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      selectRoleSelectedMenu();
    } else {
      permTreeRef.value?.setCheckedKeys([]);
    }
  }
);

const permKeywords = ref("");
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});
/**
 * 权限筛选
 */
function handlePermFilter(
  value: string,
  data: {
    [key: string]: string;
  }
) {
  if (!value) return true;
  return data.menu_name.includes(value);
}

const isExpanded = ref(true);
/**
 * 展开/收缩 菜单权限
 */
function togglePermTree() {
  isExpanded.value = !isExpanded.value;
  if (permTreeRef.value) {
    Object.values(permTreeRef.value.store.nodesMap).forEach((node: any) => {
      if (isExpanded.value) {
        node.expand();
      } else {
        node.collapse();
      }
    });
  }
}

const parentChildLinked = ref(true);
/** 父子菜单节点是否联动 change*/
function handleParentChildLinkedChange(val: any) {
  parentChildLinked.value = val;
}

/**
 * 分配菜单权限提交
 */
function handleAssignPermSubmit() {
  const role_id = props.rowItem.role_id;
  if (role_id) {
    const checkedMenuIds: number[] = permTreeRef
      .value!.getCheckedNodes(false, true)
      .map((node: any) => node.menu_id);

    reqUpdateRoleSelectedMenu({ role_id, menuIds: checkedMenuIds })
      .then(() => {
        ElMessage.success("分配权限成功");
        emits("update:isVisible", false);
      })
      .finally(() => {});
  }
}
</script>

<template>
  <!-- 分配权限弹窗 -->
  <el-drawer v-model="isOpenDrawer" size="500">
    <template #header>
      <div class="text-20">
        {{ "【" + rowItem.role_name + "】权限分配" }}
      </div>
    </template>
    <div class="">
      <el-input
        v-model="permKeywords"
        clearable
        class="w-[200px]"
        placeholder="菜单权限名称"
      >
      </el-input>

      <div class="flex items-center my-10">
        <el-button type="primary" plain @click="togglePermTree">
          {{ isExpanded ? "收缩" : "展开" }}
        </el-button>
        <el-checkbox
          v-model="parentChildLinked"
          @change="handleParentChildLinkedChange"
          class="ml-10"
          >父子联动
        </el-checkbox>

        <el-tooltip placement="bottom">
          <template #content>
            如果只需勾选菜单权限，不需要勾选子菜单或者按钮权限，请关闭父子联动
          </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>
    </div>

    <el-tree
      ref="permTreeRef"
      show-checkbox
      node-key="menu_id"
      :data="menuPermOptions"
      :props="{ children: 'children', label: 'menu_name' }"
      :filter-node-method="handlePermFilter"
      :default-expand-all="true"
      :check-strictly="!parentChildLinked"
      class="mt-5"
    >
      <template #default="{ node, data }">
        <div class="flex justify-between items-center">
          <span>{{ node.label }}</span>
          <span class="mx-6">
            <el-tag
              size="small"
              :type="menuType.find((item) => item.value === data.menu_type)?.type"
            >
              {{ menuType.find((item) => item.value === data.menu_type)?.label }}
            </el-tag>
          </span>
          <el-tag type="info" size="small">{{ data.perms }}</el-tag>
        </div>
      </template>
    </el-tree>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleAssignPermSubmit">确 定</el-button>
        <el-button @click="emits('update:isVisible', false)">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
