<template>
  <el-dialog
    class="action-dialog"
    :title="title"
    :model-value="isShowDialog"
    :width="dialogWidth"
    @close="onClose"
  >
    <el-form
      ref="dialogFormRef"
      :model="userForm"
      :rules="rules"
      size="default"
      label-width="90px"
    >
      <el-row :gutter="35">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="username" label="用户名">
            <template #label>
              <el-tooltip effect="dark" content="用来登录的账号" placement="top-start">
                <span>用户名</span>
              </el-tooltip>
            </template>
            <el-input
              v-model="userForm.username"
              placeholder="请输入账号"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="userForm.password"
              placeholder="请输入密码"
              clearable
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="nickname" label="用户昵称">
            <el-input
              v-model="userForm.nickname"
              placeholder="请输入用户昵称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="sex" label="性别">
            <el-radio-group :model-value="userForm.sex">
              <el-radio value="u">未知</el-radio>
              <el-radio value="m">男</el-radio>
              <el-radio value="w">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="age" label="年龄">
            <el-input
              v-model.number="userForm.age"
              controls-position="age"
              placeholder="请输入地址"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="address" label="地址">
            <el-input
              v-model.trim="userForm.address"
              controls-position="right"
              placeholder="请输入地址"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model.number="userForm.phone" placeholder="请输入电话" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="email" label="邮箱">
            <el-input
              type="email"
              v-model="userForm.email"
              controls-position="right"
              placeholder="请输入地址"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="state" label="用户状态">
            <el-switch
              v-model="userForm.state"
              inline-prompt
              :active-value="1"
              active-text="启"
              :inactive-value="2"
              inactive-text="禁"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="avatar" label="头像">
            <!-- FIXME:头像上传待完善 -->
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
            >
              <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
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

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
// import type { User } from "./index.vue";
import { reqInsertUser, reqUpdateUser, type AddUser } from "@/api/user";
import { useResize } from "@/hooks/useResize";

const props = defineProps<{
  isShowDialog: boolean;
  title: string;
  rowUser?: AddUser;
}>();
const emits = defineEmits<{
  "update:isShowDialog": [value: boolean];
  selectUserList: [];
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
let temp: AddUser = {
  username: "",
  nickname: "",
  avatar: "",
  sex: "u",
  age: 0,
  address: "",
  phone: "",
  email: "",
  state: 1
}; // 初始化模板
const userForm = ref<AddUser>({ ...temp });
const rules = reactive<FormRules<AddUser>>({
  nickname: [
    {
      required: true,
      message: "用户昵称不能为空",
      trigger: "change"
    }
  ],
  username: [{ required: true, message: "用户名不能为空", trigger: ["blur", "change"] }]
});
// 监听弹窗 回显数据
watch(
  () => props.isShowDialog,
  (newVal) => {
    if (!newVal) return;
    dialogFormRef.value?.resetFields(); // 先重置表单状态
    if (props.title === "新增用户") userForm.value = { ...temp };
    else if (props.title === "编辑用户") userForm.value = { ...props.rowUser } as AddUser;
    console.log(userForm.value);
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
      console.log(userForm.value);
      if (props.title === "编辑用户") await reqUpdateUser(userForm.value);
      else if (props.title === "新增用户") await reqInsertUser(userForm.value);
      ElMessage.success(`${props.title}成功`);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      emits("selectUserList");
    }
  });
};

// 暴露变量
defineExpose({});
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  .avatar {
    width: 100%;
    height: 100%;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
