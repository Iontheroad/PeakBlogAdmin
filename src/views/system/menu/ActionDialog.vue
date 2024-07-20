<script setup lang="ts">
import { Search, QuestionFilled } from "@element-plus/icons-vue";
import IconSelect from "@/components/IconSelect/index.vue";
import { ref, watch } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
// import { reqInsertRole, reqUpdateRole } from "@/api/role";
import { useResize } from "@/hooks/useResize";
import { MenuItem, MenuType, reqInsetOrUpdateMenu } from "@/api/menu";
const props = defineProps<{
  isShowDialog: boolean;
  title: string;
  rowItem: MenuItem;
  menuOptions: any;
}>();
const emits = defineEmits<{
  "update:isShowDialog": [value: boolean];
  getMenuList: [];
}>();

// 监听屏幕宽度, 响应式弹窗宽度
const { windowWidth } = useResize();
let dialogWidth = ref("769px");
watch(
  windowWidth,
  (w) => {
    if (w < 768) dialogWidth.value = "90%";
    else dialogWidth.value = "769px";
  },
  { immediate: true }
);

const dialogFormRef = ref<FormInstance>();
const roleForm = ref<MenuItem>();
const rules = {
  menu_name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  order_num: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
  path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
};
// 监听弹窗 回显数据
watch(
  () => props.isShowDialog,
  (newVal) => {
    if (!newVal) return;
    dialogFormRef.value?.resetFields();
    roleForm.value = { ...props.rowItem };
  }
);

const iconSelectRef = ref(null);
/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
}
/** 选择图标 */
function selected(name) {
  roleForm.value.icon = name;
}

// 关闭
const onClose = () => {
  emits("update:isShowDialog", false);
};
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    try {
      await reqInsetOrUpdateMenu(roleForm.value);
      ElMessage.success(`${props.title}成功`);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      emits("getMenuList");
    }
  });
};

// 暴露变量
defineExpose({});
</script>
<template>
  <el-dialog
    :title="title"
    :model-value="isShowDialog"
    :width="dialogWidth"
    @close="onClose"
  >
    <el-form ref="dialogFormRef" :model="roleForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="roleForm.parent_id"
              :data="menuOptions"
              :props="{ value: 'menu_id', label: 'menu_name', children: 'children' }"
              value-key="menu_id"
              node-key="menu_id"
              placeholder="选择上级菜单"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="菜单类型" prop="menu_type">
            <el-radio-group v-model="roleForm.menu_type">
              <el-radio value="M">目录</el-radio>
              <el-radio value="C">菜单</el-radio>
              <el-radio value="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="roleForm.menu_type != 'F'">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover placement="bottom-start" :width="540" trigger="click">
              <template #reference>
                <el-input
                  v-model="roleForm.icon"
                  placeholder="点击选择图标"
                  @blur="showSelectIcon"
                  readonly
                >
                  <template #prefix>
                    <SvgIcon
                      v-if="roleForm.icon"
                      :icon-name="roleForm.icon"
                      class="el-input__icon"
                      style="height: 32px; width: 16px"
                    />
                    <el-icon v-else style="height: 32px; width: 16px">
                      <Search />
                    </el-icon>
                  </template>
                </el-input>
              </template>
              <icon-select
                ref="iconSelectRef"
                @selected="selected"
                :active-icon="roleForm.icon"
              />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input v-model="roleForm.menu_name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="order_num">
            <el-input-number
              v-model="roleForm.order_num"
              controls-position="right"
              :min="0"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="roleForm.menu_type != 'F'">
          <el-form-item prop="route_name">
            <template #label>
              <span>
                <el-tooltip
                  content="路由地址的别名，用于访问的路由地址，如：地址：`/article/detail` ，别名：`articleDetail`"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由别名
              </span>
            </template>
            <el-input v-model="roleForm.route_name" placeholder="请输入路由别名" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="roleForm.menu_type != 'F'">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="roleForm.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="roleForm.menu_type != 'F'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
                是否外链
              </span>
            </template>
            <el-radio-group v-model="roleForm.is_link">
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="roleForm.menu_type == 'C'">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="roleForm.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input
              v-model="roleForm.perms"
              placeholder="请输入权限标识"
              maxlength="100"
            />
            <template #label>
              <span>
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="form.menu_type == 'C'">
            <el-form-item>
              <el-input
                v-model="form.query"
                placeholder="请输入路由参数"
                maxlength="255"
              />
              <template #label>
                <span>
                  <el-tooltip
                    content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col> -->
        <el-col :span="12" v-if="roleForm.menu_type == 'C'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="roleForm.is_keep_alive">
              <el-radio :value="0">不缓存</el-radio>
              <el-radio :value="1">缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="roleForm.menu_type != 'F'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否隐藏
              </span>
            </template>
            <el-radio-group v-model="roleForm.is_hidden">
              <el-radio :value="0">显示</el-radio>
              <el-radio :value="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="[MenuType['目录'], MenuType['菜单']].includes(roleForm.menu_type)"
        >
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否禁用
              </span>
            </template>
            <el-radio-group v-model="roleForm.is_disabled">
              <el-radio :value="0">启用</el-radio>
              <el-radio :value="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button size="default" @click="onClose">关 闭</el-button>
      <el-button type="primary" size="default" @click="onSubmit(dialogFormRef)">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
