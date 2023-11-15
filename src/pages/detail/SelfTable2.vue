<template>
  <page-layout title="修改：可编辑行">
    <a-card :bordered="false">
      <div v-if="editInput">
        <a-button @click="() => save()">确定</a-button>
        <a-button @click="() => cancel()">取消</a-button>
      </div>
      <a-button v-else @click="editInput = true">批量编辑</a-button>

      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="name"
        bordered
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: 200,
        }"
      >
        <!--   ['name', 'age', 'address'] -->
        <span
          v-for="(col, index) in columns"
          :slot="col.dataIndex"
          slot-scope="text, record"
          :key="index"
        >
          <span v-if="editInput">
            <div v-if="col.type == 'input'">
              <span v-if="record.disable_edit" style="color: #ccc"
                >{{ text }}
              </span>
              <span v-else>
                <span
                  v-show="record.change_status"
                  @click="changeEdit(record)"
                  >{{ text }}</span
                >

                <a-input
                  v-show="!record.change_status"
                  :key="record.key"
                  id="myInput"
                  :value="text"
                  @change="
                    (e) => handleChange(text, e.target.value, record.key, col)
                  "
                  :style="changeStyle ? 'color: #ee4d2d' : 'color: #000000a6'"
              /></span>
            </div>

            <div v-if="col.type == 'multiple_select'">
              <span v-if="record.disable_edit" style="color: #ccc"
                >{{ text }}
              </span>
              <span v-else>
                <span
                  v-show="record.change_status"
                  @click="changeEdit(record)"
                  >{{ text }}</span
                >
                <a-select
                  v-show="!record.change_status"
                  style="width: 100%"
                  :value="text"
                  mode="tags"
                  @change="
                    (value) => selectChange(text, value, record.key, col)
                  "
                >
                  <a-select-option
                    v-for="item in col.options.select"
                    :key="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </span>
            </div>
          </span>
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
    type: "input",
  },
  {
    cnname: "年龄",
    name: "age",
    width: "25%",
    scopedSlots: { customRender: "age" },
    type: "multiple_select",
    options: {
      select: ["a", "b", "c", "d", "e"],
    },
  },
  {
    cnname: "地址",
    name: "address",
    width: "40%",
    scopedSlots: { customRender: "address" },
    type: "input",
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
      for (let i = 0; i < 800; i++) {
        this.data.push({
          key: i.toString(),
          request_title: `Edrward ${i}`,
          age: ["aaa"],
          address: `London Park no. ${i}`,
          disable_edit: false,
          change_status: true,
        });
      }
      // this.cacheData = data.map((item) => ({ ...item })); //创建副本，始终为初始值
      this.cacheData = JSON.parse(JSON.stringify(this.data));
    },
    handleChange(text, value, key, column) {
      // (this.changeStyle = true),
      //值  行  列
      console.log("单元格更改", value, key, column);
      const newData = this.data;
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    selectChange(text, value, key, column) {
      console.log("1111", text, value, key, column);
      const newData = this.data;
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    changeEdit(record) {
      record.change_status = !record.change_status;
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