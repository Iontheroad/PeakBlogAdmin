<template>
  <el-card class="tags">
    <!-- 操作栏 -->
    <div class="top-action">
      <div class="action-left">
        <el-button type="primary" :icon="CirclePlus" @click="clickAdd">新增</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :plain="!selectIds.length"
          @click="clickBatchDelete"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="main-table">
      <el-form ref="formRef" :model="formData">
        <el-table
          :data="formData.tableData"
          tooltip-effect="dark"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            label="分类名称"
            prop="tag_name"
            show-overflow-tooltip
            min-width="90"
          >
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`tableData.${$index}.tag_name`"
                :rules="rules.tag_name"
              >
                <el-input
                  v-if="row.isEditor"
                  type="text"
                  placeholder="输入分类名"
                  v-model.trim="row.tag_name"
                ></el-input>
                <span v-else>{{ row.tag_name }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            min-width="120"
            label="创建时间"
            show-overflow-tooltip
          />
          <el-table-column
            prop="update_time"
            min-width="120"
            label="更新时间"
            show-overflow-tooltip
          />

          <el-table-column
            fixed="right"
            label="操作"
            show-overflow-tooltip
            min-width="110"
          >
            <template #default="{ row, $index }">
              <el-link
                v-if="row.isEditor"
                type="success"
                @click="complete(formRef, $index, row)"
              >
                完成
              </el-link>
              <el-link type="info" v-else @click="row.isEditor = true">编辑</el-link>
              <el-popconfirm
                confirm-button-text="确定"
                confirm-button-type="danger"
                cancel-button-text="取消"
                icon-color="#f62226"
                title="是否确定删除该条数据?"
                @confirm="confirmEventRemove(row)"
              >
                <template #reference>
                  <el-link style="margin-left: 10px" type="danger">删除</el-link>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts" setup name="Tags">
import { reactive, ref, toRefs, onMounted } from "vue";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance } from "element-plus";
import {
  reqSelectTags,
  reqInsertTags,
  reqUpdateTags,
  reqDeleteTags,
  type Tags
} from "@/api/tags.ts";

interface TableDataItem extends Tags {
  isEditor?: boolean; // 是否可编辑
  isVirtual?: boolean; // 是否是虚拟数据
}

const formRef = ref<FormInstance>();
const data = reactive({
  formData: {
    tableData: [] as TableDataItem[]
  },
  rules: {
    tag_name: [
      {
        required: true,
        message: "标签名不能为空",
        trigger: "blur"
      }
    ]
  }
});
let { formData, rules } = toRefs(data);

onMounted(() => {
  selectTags();
});

/**
 * 查询
 */
async function selectTags() {
  try {
    let result = await reqSelectTags();
    formData.value.tableData = result.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 表格多选
 */
let selectIds = ref<number[]>([]);
const handleSelectionChange = (val: TableDataItem[]) => {
  selectIds.value = val.map((item) => item.tag_id);
};

/**
 * 点击批量删除
 */
const clickBatchDelete = () => {
  if (!selectIds.value.length) ElMessage.warning("请选择要删除的数据");
  deleteTags(selectIds.value);
};

/**
 * 点击添加
 */
const clickAdd = () => {
  formData.value.tableData.push({
    tag_id: +new Date(),
    tag_name: "",
    create_time: "",
    update_time: "",
    // my 自定义
    isEditor: true, // 是否可编辑
    isVirtual: true // 是否是虚拟数据
  });
};

/**
 * 完成
 */
const complete = (
  formEl: FormInstance | undefined,
  index: number,
  row: TableDataItem
) => {
  if (!formEl) return;
  // 校验点击哪一行的props
  let propsArr = Object.keys(rules.value).map((key) => `tableData.${index}.${key}`);

  formEl.validateField(propsArr, async (isValid) => {
    if (!isValid)
      return ElMessage.warning({
        message: "校验未通过,请按规范输入！",
        showClose: true
      });
    try {
      if (row.isVirtual) {
        await reqInsertTags(row);
      } else await reqUpdateTags(row);
      ElMessage.success({
        message: "操作成功",
        showClose: true
      });
    } catch (error) {
      console.log(error);
    } finally {
      selectTags();
    }
  });
};

/**
 * 确定 删除
 */
const confirmEventRemove = async (row: TableDataItem) => {
  if (row.isVirtual) {
    data.formData.tableData = data.formData.tableData.filter(
      (item) => item.tag_id != row.tag_id
    );
    return;
  }
  if (!row.isVirtual) await deleteTags([row.tag_id]);
};

/**
 * 删除事件
 * @param ids
 */
async function deleteTags(ids: number[]) {
  try {
    await reqDeleteTags({ ids });
    ElMessage.success({
      message: "删除成功",
      showClose: true
    });
  } catch (error) {
  } finally {
    selectTags();
  }
}
</script>

<style scoped lang="scss">
.tags {
  .top-action {
    .action-left {
      display: flex;
    }
  }

  // 表格
  .main-table {
    margin: 10px 0;
  }
}
</style>
