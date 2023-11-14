<template>
  <page-layout title="修改：可编辑单元格">
    <a-card :bordered="false" v-if="showComponent">
      <div>
        <a-button @click="handleAdd">Add</a-button>
        <a-button v-if="editable" @click="check">提交</a-button>
        <a-button v-if="editable" @click="cancel">取消</a-button>
        <a-button v-else @click="editable = true" type="primary"
          >批量修改</a-button
        >
        <a-button @click="buttonClick">我是按钮</a-button>
        <a-table
          bordered
          :data-source="dataSource"
          :columns="columns"
          :key="componentKey"
          :pagination="{
            pageSize: 100,
            total: total,
          }"
        >
          <div
            v-for="(col, index) in columns"
            :key="index"
            :slot="col.type"
            slot-scope="text, record"
          >
            <editable-cell
              :col="col"
              :slotInfo="{ text, record }"
              :editable="editable"
              @change="onCellChange(record, col, $event)"
            />
            <!-- 行的key  列表头名字  值-->
          </div>

          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" @click="editRow(record)">编辑</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <!-- 弹出对话框 -->
    <a-modal
      title="Title"
      :visible="showModal"
      @ok="handleOk"
      @cancel="handleOk"
    >
      <!-- <p>{{ modalText }}</p> -->
      <!--  @submit="handleSubmit" -->
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        layout="inline"
      >
        <a-form-item label="Note">
          <a-input
            v-decorator="[
              'note',
              {
                rules: [{ required: true, message: 'Please input your note!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Gender">
          <a-select
            :getPopupContainer="(trigger) => trigger.parentNode"
            v-decorator="[
              'gender',
              {
                rules: [
                  { required: true, message: 'Please select your gender!' },
                ],
              },
            ]"
          >
            <a-select-option value="male"> male </a-select-option>
            <a-select-option value="female"> female </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
        <a-form-item label="日期："
          ><a-date-picker
            :getCalendarContainer="(trigger) => trigger.parentNode"
        /></a-form-item>
      </a-form>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from "../../layouts/PageLayout";
import EditableCell from "./EditableCell.vue";

export default {
  name: "SelfTable",
  components: {
    EditableCell,
    PageLayout,
  },
  inject: ["selfRefresh"], //TabsView祖先文件provide过来的方法
  data() {
    return {
      componentKey: 0,
      showComponent: true,
      editable: false,
      dataSource: [],
      dataSource2: [],
      count: 2,
      columns: [
        {
          title: "name",
          dataIndex: "name",
          align: "center",
          type: "input",
          scopedSlots: { customRender: "input" },
        },
        {
          title: "age",
          dataIndex: "age",
          type: "multiple_select",
          scopedSlots: { customRender: "multiple_select" },
          options: {
            change_event_api: "get_data/api",
            select: ["a", "b", "c"],
          },
        },
        {
          title: "code",
          dataIndex: "code",
          width: "50",
          type: "code_editor",
          scopedSlots: { customRender: "code_editor" },
          options: {
            change_event_api: "get_data/api",
            select: ["a", "b", "c"],
          },
        },
        {
          title: "address",
          dataIndex: "address",
          width: "30",
          type: "select",
          scopedSlots: { customRender: "select" },
          options: {
            select: ["q", "w", "e"],
          },
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      showModal: false,
      modalText: "",
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      oldcolumns: [],
    };
  },
  mounted() {
    // 拷贝一份新值
    this.oldcolumns = JSON.parse(JSON.stringify(this.columns));

    for (let i = 1; i <= 300; i++) {
      this.dataSource.push({
        key: i,
        name: i + "one",
        age: "32",
        address: "Londonone",
        code: "code",
      });
    }
  },
  methods: {
    //用async定义一个异步函数
    // 定义一个异步方法很简单，在函数前边加上 async 关键字即可。
    // 接口文件里的函数
    async sayHello(num) {
      return "Hello，亚瑟王" + num;
    },
    // await 会让它后面的表达式变成同步，当该表达式执行完成后，才会继续执行下面的代码
    async buttonClick() {
      await this.sayHello("1").then((result) => {
        console.log(result);
      });
      console.log("虽然我在后边，但是我先执行");
    },

    editRow(record) {
      this.showModal = true;
      this.modalText = record;
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
      this.showModal = false;
    },
    check() {
      this.editable = false;
      //提交this.dataSource给接口再刷新

      //把组件设置显示隐藏的方式刷新
      // this.showComponent = false
      // this.$nextTick(() => {
      //   this.showComponent = true
      // })

      
      // this.componentKey += 1;
    },
    cancel() {
      this.editable = false;
      // 重新刷新接口的函数获取最新值后赋给表格dataSource

      // this.dataSource=(接口的初始值)

      // window.location.reload();//会刷新这个网页，性能不好
      // this.selfRefresh('selftable_cancel'//刷新当前组件
      // 	, {
      // 		cachedKey: "/details/selftable163",
      // 		// fullPath: "/details/selftable",
      // 		// keyPath: "/details/selftable",
      // 		loading: false,
      // 		path: "/details/selftable",
      // 		_init_: true
      // 	})
    },

    onCellChange(record, col, value) {
      console.log("999", record, col, value);

      var newName = "address";
      var previousName = "age";
      var newArray = ["aaa", "bbb", "ccc"];

      var changeValue = this.dataSource.find((item) => item.key === record.key);
      if (col.options.change_event_api) {
        //调用api得到 表头名字 newName 数组内容array
        //给组件的key增加的方式刷新,视图才可以显示最新值
        this.componentKey += 1;
        changeValue[newName] = "";
      }

      if (col.dataIndex == newName) {
        // 判断前面的值是否选到需要后面选项改变的c选项
        const isExist = record[previousName].indexOf("c") !== -1;
        const columnsItem = this.columns.find(
          (item) => item.dataIndex === newName
        );
        if (isExist) {
          columnsItem.options.select = newArray;
        } else {
          const oldColumnsItem = this.oldcolumns.find(
            (item) => item.dataIndex === newName
          );
          columnsItem.options.select = oldColumnsItem.options.select;
        }
      }

      //数据一直实时更新，就看视图怎么显示
      const dataSource2 = [...this.dataSource];
      const target = dataSource2.find((item) => item.key === record.key);

      if (target) {
        target[col.dataIndex] = value;
        this.dataSource = dataSource2;
      }

      // dataSource2一共20行 提交去接口 取消就恢复原本数据
      // console.log("bbb", dataSource2);
    },
    onDelete() {
      // const dataSource = [...this.dataSource];
      // this.dataSource = dataSource.filter(item => item.key !== key);
    },
    handleAdd() {
      // const { count, dataSource } = this;
      // const newData = {
      // 	key: count,
      // 	name: `Edward King ${count}`,
      // 	age: 32,
      // 	address: `London, Park Lane no. ${count}`,
      // };
      // this.dataSource = [...dataSource, newData];
      // this.count = count + 1;
    },
  },
};
</script>


<style>
/* .editable-cell {
  position: relative;
} */

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.ant-btn {
  margin: 0 10px 10px 0;
}
</style>
  