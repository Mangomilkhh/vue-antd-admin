<template>
  <div class="compare-group-table">
    <a-table
      :dataSource="compareGroups"
      :columns="compareColumns"
      :pagination="false"
      bordered
      size="small"
      :rowKey="(record, index) => index"
    >
    <!-- 对比列 (文件1) -->
      <template slot="col1" slot-scope="text, record">
        <a-select v-model="record.col1" style="width: 100%">
          <a-select-option v-for="opt in columnOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </a-select-option>
        </a-select>
      </template>

      <!-- 对比列 (文件2) -->
      <template slot="col2" slot-scope="text, record">
        <a-select v-model="record.col2" style="width: 100%">
          <a-select-option v-for="opt in columnOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </a-select-option>
        </a-select>
      </template>

      <!-- 对比方式 -->
      <template slot="mode" slot-scope="text, record">
        <a-select v-model="record.mode" style="width: 100%">
          <a-select-option value="add">加 (+)</a-select-option>
          <a-select-option value="subtract">减 (-)</a-select-option>
          <a-select-option value="multiply">乘 (×)</a-select-option>
          <a-select-option value="divide">除 (÷)</a-select-option>
        </a-select>
      </template>

      <!-- 重命名新列 -->
      <template slot="newName" slot-scope="text, record">
        <a-input v-model="record.newName" />
      </template>

      <!-- 操作 -->
      <template slot="action" slot-scope="index">
        <a :disabled="compareGroups.length === 1"
        @click="removeCompareGroup(index)"><a-icon type="delete" /></a>
      </template>

      <!-- footer 插槽：添加按钮 -->
      <template slot="footer">
        <a-button type="primary" @click="addCompareGroup">+ 添加对比组</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'CompareGroupTable',
  data() {
    return {
      columnOptions: [
        { label: '请选择列名', value: '' },
        { label: '用户ID', value: 'user_id' },
        { label: '订单金额', value: 'order_amount' },
        { label: '商品名称', value: 'product_name' }
      ],
      // 对比组数据
      compareGroups: [
        {
          col1: '111',
          col2: '222',
          mode: 'add',
          newName: '333'
        }
      ],
      // 表格列配置
      compareColumns: [
        {
          title: '对比列 (文件1)',
          dataIndex: 'col1',
          scopedSlots: { customRender: 'col1' }
        },
        {
          title: '对比列 (文件2)',
          dataIndex: 'col2',
          scopedSlots: { customRender: 'col2' }
        },
        {
          title: '对比方式',
          width: 85,
          dataIndex: 'mode',
          scopedSlots: { customRender: 'mode' }
        },
        {
          title: '新列名称',
          width: 160,
          dataIndex: 'newName',
          scopedSlots: { customRender: 'newName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 45,
          scopedSlots: { customRender: 'action' }
        }
      ]
    };
  },
  methods: {
    // 添加新的对比组
    addCompareGroup() {
      this.compareGroups.push({
        col1: '',
        col2: '',
        mode: 'add',
        newName: ''
      });
    },
    // 删除对比组
    removeCompareGroup(index) {
      if (this.compareGroups.length > 1) {
        this.compareGroups.splice(index, 1);
      } else {
        this.$message.warning('至少保留一个对比组');
      }
    }
  },
};
</script>

<style scoped>
.compare-group-table {
  margin-bottom: 24px;
}
</style>