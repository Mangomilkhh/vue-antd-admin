<template>
  <page-layout title="修改：可编辑行">
    <a-card :bordered="false">
      <div v-if="editInput">
        <a-button @click="() => save()">确定</a-button>
        <a-button @click="() => cancel()">取消</a-button>
      </div>
      <a-button v-else @click="editInput = true">批量编辑</a-button>

      <a-table :columns="columns" :data-source="data" rowKey="name" bordered>
        <!--   ['name', 'age', 'address'] -->
        <span
          v-for="(col, index) in columns"
          :slot="col.dataIndex"
          slot-scope="text, record"
          :key="index"
        >
          <a-input
            :key="record.key"
            id="myInput"
            v-if="editInput"
            :value="text"
            @change="(e) => handleChange(text, e.target.value, record.key, col)"
            :style="changeStyle ? 'color: #ee4d2d' : 'color: #000000a6'"
          />
          <template v-else>
            {{ text }}
          </template>
        </span>

        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            title="Sure to delete?"
            @confirm="() => onDelete(record.key)"
          >
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </page-layout>
</template>
<script>
import PageLayout from "../../layouts/PageLayout";
const columns = [
  {
    cnname: "名字",
    name: "request_title",
    width: "25%",
    scopedSlots: { customRender: "request_title" },
    customCell: () => {
      //改变样式
      return {
        style: {
          // color: "red",
          textAlign: "center",
        },
      };
    },
  },
  {
    cnname: "年龄",
    name: "age",
    width: "25%",
    scopedSlots: { customRender: "age" },
  },
  {
    cnname: "地址",
    name: "address",
    width: "40%",
    scopedSlots: { customRender: "address" },
  },
  {
    cnname: "操作",
    name: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  components: {
    PageLayout,
  },
  data() {
    return {
      data: [],
      cacheData: [],
      columns,
      editInput: false,
      changeStyle: false,
    };
  },
  created() {
    this.initData();
    this.changeColumns();
  },
  methods: {
    changeColumns() {
      let keyMap = { cnname: "title", name: "dataIndex" };
      this.columns = columns.map((item) => {
        var objs = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
        return objs;
      });
    },
    initData() {
      for (let i = 0; i < 100; i++) {
        this.data.push({
          // key: i.toString(),
          request_title: `Edrward ${i}`,
          age: "",
          address: `London Park no. ${i}`,
        });
      }
      // this.cacheData = data.map((item) => ({ ...item })); //创建副本，始终为初始值
      this.cacheData = JSON.parse(JSON.stringify(this.data));
    },
    handleChange(text, value, key, column) {
      (this.changeStyle = true),
        //值  行  列
        console.log("单元格更改", value, key, column);
      const newData = this.data;
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    save() {
      this.editInput = false;
      // const aaa= this.data;
      //调接口保存aaa
    },
    cancel() {
      this.editInput = false;
      this.data = JSON.parse(JSON.stringify(this.cacheData));
      // 重新刷新接口的函数获取最新值后赋给表格
    },
  },
};
</script>
<style scoped>
</style>