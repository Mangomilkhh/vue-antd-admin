<template>
  <a-table :columns="columns" :data-source="data" bordered>
    <div
      v-for="col in editColumns"
      :slot="col"
      slot-scope="text, record"
      :key="col"
    >
      <div style="float: left; margin-right: 0">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
      <div style="float: right">
        <span v-if="record.editable">
          <a
            style="
              color: #2eabff;
              fontsize: 15px;
              margin-left: 0;
              margin-right: 20px;
            "
            @click="() => save(record.key)"
            >确定</a
          >
          <a-popconfirm
            title="确认取消重命名?"
            @confirm="() => cancel(record.key)"
          >
            <a type="close" style="color: #2eabff; fontsize: 15px">取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a-icon
            style="color: #2eabff; fontsize: 20px"
            type="edit"
            :disabled="editingKey !== ''"
            @click="() => edit(record.key)"
          />
        </span>
      </div>
    </div>

    <template slot="operation" slot-scope="text, record">
      <a-popconfirm
        title="Sure to delete?"
        @confirm="() => onDelete(record.key)"
      >
        <a href="javascript:;">Delete</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script>
const columns = [
  {
    title: "name",
    dataIndex: "name",
    width: "25%",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "age",
    dataIndex: "age",
    width: "25%",
    scopedSlots: { customRender: "age" },
  },
  {
    title: "address",
    dataIndex: "address",
    width: "40%",
    scopedSlots: { customRender: "address" },
  },
  {
    title: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default {
  data() {
    this.cacheData = data.map((item) => ({ ...item }));
    return {
      data,
      columns,
      editingKey: "",
      editColumns: ["name", "age", "address"], //自行扩展即可
    };
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      console.log("target:", JSON.stringify(target));
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
  },
};
</script>
<style scoped>
</style>