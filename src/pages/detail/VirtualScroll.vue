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
    // fixed: "left",
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
    fixed: "right",
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
      // selectedRows: [],
      // 空元素，用于撑开table的高度
      vEle: undefined,
      // 是否全选
      // isSelectedAll: false,
    }
  },
  // 计算属性
  computed: {
    // 这个是截取表格中的部分数据，放到了 table 组件中来显示
    sliceTable() {
      return this.tableData.slice(this.startIndex, this.startIndex + 9);
    },
  },
  created() { },
  mounted() {
    // 创建一个空元素，这个空元素用来撑开 table 的高度，模拟所有数据的高度
    this.vEle = document.createElement("div");
    this.loadData();

    // 绑定滚动事件 this.debounce(this.tableScroll, 1000)
    this.$refs.tableRef.$el
      .querySelector(".ant-table-body")
      .addEventListener("scroll", this.tableScroll, {
        // capture:true,
        passive: true
      });
  },
  methods: {
    // 防抖：在一定时间内，事件被触发n次，只执行最后一次。
    debounce(func, delay) {
      let timeoutID;
      return function (...args) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => func.apply(this, args), delay);
      }
    },
    // 加载数据
    loadData() {
      // let start_i = this.tableData.length;
      for (let i = 0; i < 200; i++) {
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
        // this.$refs.tableRef.$el.querySelector(".ant-table-body-inner .ant-table-fixed").style.position = "absolute";
        // 计算表格所有数据所占内容的高度
        this.vEle.style.height = this.tableData.length * 58 + "px";
        // 把这个节点加到表格中去，用它来撑开表格的高度
        this.$refs.tableRef.$el.querySelector(".ant-table-body").appendChild(this.vEle);
        // this.$refs.tableRef.$el.querySelector(".ant-table-body-inner").appendChild(this.vEle);

        // 重新设置曾经被选中的数据
        // this.selectedRows.forEach(row => {
        //   this.$refs.tableRef.toggleRowSelection(row, true);
        // });
      });
    },

    //  table 滚动事件
    tableScroll() {
      // setTimeout(() => {
        // let leftWrapperEle = this.$refs.tableRef.$el.querySelector(".ant-table-fixed-left .ant-table-body-inner");
        // leftWrapperEle.querySelector(".ant-table-fixed-left .ant-table-body-inner .ant-table-fixed").style.transform = `translateY(${this.startIndex * 58}px)`;
      // }, 100);

      let bodyWrapperEle = this.$refs.tableRef.$el.querySelector(".ant-table-body");
      bodyWrapperEle.querySelector(".ant-table-body .ant-table-fixed").style.transform = `translateY(${this.startIndex * 58}px)`;

      // 滚动的高度
      let scrollTop = bodyWrapperEle.scrollTop;
      // 下一次开始的索引
      this.startIndex = Math.floor(scrollTop / 58);
      console.log('111', this.startIndex, this.sliceTable);
      
      let rightWrapperEle = this.$refs.tableRef.$el.querySelector(".ant-table-fixed-right .ant-table-body-inner");
      rightWrapperEle.querySelector(".ant-table-fixed-right .ant-table-body-inner .ant-table-fixed").style.transform = `translateY(${this.startIndex * 58}px)`;
      // 固定列总会不对齐内容列
      rightWrapperEle.scrollTop = scrollTop;

      // 滚动操作 使所有内容同步显示当前视图
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

<style scoped lang="less">
//表格滚动条
/deep/ .ant-table-body {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面的滑块*/
    border-radius: 5px;
    background: #c0c0c0;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道背景*/
    // border-radius: 5px;
    background: #fafafa;
  }
}

// 解决固定列滚动条
/deep/ .ant-table-fixed-right {
  margin-right: 8px;
  height: 99.5%;
  box-shadow: -10px -3px 8px -7px rgba(0, 0, 0, 0.15);
  // max-height: calc(v-bind(pageMinHeight) - 100);
  z-index: 9;
}

/deep/ .ant-table-body-inner {
  // overflow-x: hidden !important;
  overflow-y: hidden !important;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面的滑块*/
    // border-radius: 5px;
    background: rgba(255, 255, 255, 0);
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道背景*/
    // border-radius: 5px;
    background: rgba(255, 255, 255, 0);
  }
}
</style>