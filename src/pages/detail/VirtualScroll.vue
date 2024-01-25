<template>
  <page-layout title="自定义页面">
    参考链接：<br>
    <a href="https://blog.csdn.net/lihaogn/article/details/120497842" target="_blank" rel="noopener noreferrer">1.
      element/Antd vue 表格性能问题，表格数据多导致页面卡顿问题解决思路与方法</a><br>
    <a href="https://blog.csdn.net/lihaogn/article/details/120497842" target="_blank" rel="noopener noreferrer">2.
      如何改造antd-vue的table支持虚拟列表功能</a><br>

    <a-table :columns="columns" :data-source="sliceTable" :scroll="{ x: 1200, y: 500 }" ref="tableRef" rowKey="name">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag"
          :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
      </span>
    </a-table>
  </page-layout>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
    // fixed:"right",
    scopedSlots: { customRender: 'action' },
  },
];


import PageLayout from "../../layouts/PageLayout";
export default {
  name: "VirtualScroll",
  components: { PageLayout },
  data() {
    return {
      columns,
      tableData: [],
      // 开始索引
      startIndex: 0,
      // 选中的数据
      selectedRows: [],
      // 空元素，用于撑开table的高度
      vEle: undefined,
      // 是否全选
      isSelectedAll: false,
    }
  },
  // 计算属性
  computed: {
    // 这个是截取表格中的部分数据，放到了 table 组件中来显示
    sliceTable() {
      return this.tableData.slice(this.startIndex, this.startIndex + 9);
    },
  },
  created() {
    // 创建一个空元素，这个空元素用来撑开 table 的高度，模拟所有数据的高度
    this.vEle = document.createElement("div");
    this.loadData();
  },
  mounted() {
    // 绑定滚动事件
    this.$refs.tableRef.$el
      .querySelector(".ant-table-body")
      .addEventListener("scroll", this.tableScroll, {
        passive: true
      });
  },
  methods: {
    // 加载数据
    loadData() {
      // let start_i = this.tableData.length;
      for (let i=0; i < 200; i++) {
        this.tableData.push({
          name: i,
          tags: "zhangsan" + i,
          age: 12,
          address: "china",
        });
      }

      this.$nextTick(() => {
        // 设置成绝对定位，这个元素需要我们去控制滚动
        this.$refs.tableRef.$el.querySelector(".ant-table-body .ant-table-fixed").style.position = "absolute";
        // 计算表格所有数据所占内容的高度
        this.vEle.style.height = this.tableData.length * 58 + "px";
        // 把这个节点加到表格中去，用它来撑开表格的高度
        this.$refs.tableRef.$el.querySelector(".ant-table-body").appendChild(this.vEle);
        // 重新设置曾经被选中的数据
        this.selectedRows.forEach(row => {
          this.$refs.tableRef.toggleRowSelection(row, true);
        });
      });
    },

    //  table 滚动事件
    tableScroll() {
      let bodyWrapperEle = this.$refs.tableRef.$el.querySelector(".ant-table-body");
      // 滚动的高度
      let scrollTop = bodyWrapperEle.scrollTop;
      // 下一次开始的索引
      this.startIndex = Math.floor(scrollTop / 58);
      // console.log('111', this.sliceTable);

      // 滚动操作 使所有内容同步显示当前视图
      bodyWrapperEle.querySelector(".ant-table-body .ant-table-fixed").style.transform = `translateY(${this.startIndex * 58}px)`;
      // 滚动操作后，上面的一些 tr 没有了，所以需要重新设置曾经被选中的数据
      // this.selectedRows.forEach(row => {
      //   this.$refs.tableRef.toggleRowSelection(row, true);
      // });


      // 滚动到底，加载新数据
      // if (bodyWrapperEle.scrollHeight <= scrollTop + bodyWrapperEle.clientHeight) {
      //   if (this.tableData.length == 100) {
      //     this.$message.warning("没有更多了");
      //     return;
      //   }
      //   this.loadData();
      // }
    }


    // 清除滚动事件，以免出错
  },
}
</script>

<style></style>