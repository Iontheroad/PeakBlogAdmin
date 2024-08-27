<template>
  <el-dialog
    :title="title"
    :model-value="isShowDialog"
    :width="dialogWidth"
    @close="onClose"
  >
    <el-form
      ref="roleDialogFormRef"
      :model="roleForm"
      :rules="rules"
      size="default"
      label-width="100px"
    >
      <el-row :gutter="35">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item prop="role_name" label="角色名称">
            <el-input
              v-model="roleForm.role_name"
              placeholder="请输入角色名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item prop="role_key" label="角色标识">
            <template #label>
              <span>
                <el-tooltip
                  effect="dark"
                  content="角色的权限标识（唯一 ！）"
                  placement="top-start"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
                角色标识
              </span>
            </template>
            <el-input
              v-model="roleForm.role_key"
              placeholder="请输入角色标识"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item prop="role_sort" label="排序">
            <el-input-number
              v-model="roleForm.role_sort"
              :min="0"
              :max="999"
              controls-position="right"
              placeholder="请输入排序"
              class="w100"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item prop="status" label="角色状态">
            <el-switch
              v-model="roleForm.status"
              inline-prompt
              :active-value="1"
              active-text="启"
              :inactive-value="0"
              inactive-text="禁"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item prop="remark" label="角色描述">
            <el-input
              v-model="roleForm.remark"
              type="textarea"
              placeholder="请输入角色描述"
              maxlength="150"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button size="default" @click="onClose">关 闭</el-button>
      <el-button type="primary" size="default" @click="onSubmit(roleDialogFormRef)">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reqInsertRole, reqUpdateRole, type RoleItem } from "@/api/role";
import { useResize } from "@/hooks/useResize";

const props = defineProps<{
  isShowDialog: boolean;
  title: string;
  rowRole?: RoleItem;
}>();
const emits = defineEmits<{
  "update:isShowDialog": [value: boolean];
  selectRoleList: [];
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

const roleDialogFormRef = ref<FormInstance>();
const roleForm = ref<RoleItem>({
  role_name: "",
  role_key: "",
  role_sort: 1,
  status: 1, // 1 正常 0 停用
  remark: ""
});
const rules = reactive<FormRules<RoleItem>>({
  role_name: [
    { required: true, message: "角色名称不能为空", trigger: ["blur", "change"] }
  ],
  role_key: [
    {
      required: true,
      message: "角色权限标识",
      trigger: "change"
    }
  ],
  status: [
    {
      required: true,
      message: "角色状态",
      trigger: "change"
    }
  ],
  role_sort: [
    {
      type: "date",
      required: true,
      message: "角色排序",
      trigger: "change"
    }
  ]
});
// 监听弹窗 回显数据
watch(
  () => props.isShowDialog,
  (newVal) => {
    if (!newVal) return;
    roleDialogFormRef.value?.resetFields(); // 先重置表单状态
    if (props.title === "新增角色")
      roleForm.value = {
        role_name: "",
        role_key: "",
        role_sort: 1,
        status: 1,
        remark: ""
      };
    else if (props.title === "编辑角色")
      roleForm.value = { ...props.rowRole } as RoleItem;
  }
);

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
      if (props.title === "编辑角色") await reqUpdateRole(roleForm.value);
      else if (props.title === "新增角色") await reqInsertRole(roleForm.value);
      ElMessage.success(`${props.title}成功`);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      emits("selectRoleList");
    }
  });
};

// 暴露变量
defineExpose({});
</script>

<style scoped lang="scss"></style>
