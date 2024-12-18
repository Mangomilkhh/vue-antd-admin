<template>
    <a-card :style="`min-height: ${pageMinHeight}px`">
      <a-row type="flex">
        <a-col flex="143px">
          <a-menu
            :style="`min-height: ${pageMinHeight - 50}px; width:137px`"
            mode="inline"
            :default-selected-keys="['All']"
            @click="handleMenuClick"
          >
            <!--  :key="Object.entries(item[i])[0][0]" Object.entries(item[i])[0][1].cnname-->
            <!-- key为Todo、My、All -->
            <a-menu-item
              v-for="item in filterBar"
              :key="Object.keys(item)[0]"
              :disabled="editable"
              >{{ Object.values(item)[0].cnname }}
              <a-badge
                v-if="Object.values(item)[0].badge.api"
                :count="dataBadge"
                :overflow-count="100"
                :number-style="{
                  background: Object.values(item)[0].badge.color,
                  borderRadius: '90px',
                  minWidth: '15px',
                  height: '15px',
                  fontSize: '12px',
                  padding: '0px 3px',
                  margin: '0 0 5px -1px',
                  lineHeight: '15px',
                }"
              ></a-badge>
            </a-menu-item>
          </a-menu>
        </a-col>
  
        <a-col flex="1">
          <span v-if="showGsheet">
            <span v-for="(item,i) in gsheet" :key="i" style="width: 100%;height: 100%;">
              <iframe :src="item.url" :width="item.width" :height="item.height" :style="`padding: ${item.padding}`" 
              frameBorder="0"></iframe>
            </span>
          </span>
          <tables-table
            v-if="!showGsheet"
            :dataSource="dataSource"
            :dataStatus="dataStatus"
            :keyword="keyword"
            :dataTableHeaders="dataTableHeaders"
            :filterColumns="filterColumns"
            :actionColumn="actionColumn"
            :tableWidth="tableWidth"
            :rowKey="(record, index) => index"
            :pagination="{
              current: table.pageNumber,
              total: table.total,
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '200'],
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条数据`,
              onShowSizeChange: onSizeChange,
              onChange: onPageChange,
            }"
            @searchInput="searchInput"
            @search="onSearch"
            :totalHeaders="totalHeaders"
            :editDataSource="editDataSource"
            :editDataTableHeaders="editDataTableHeaders"
            :editActionColumn="editActionColumn"
            :editTableWidth="editTableWidth"
            :appType="appType"
            :systemName="systemName"
            :systemRoute="systemRoute"
          >
            <!-- @change -->
            <!-- 查看和编辑按钮 -->
            <!-- <div slot="action" slot-scope="{ record }">
              <a @click="showReport(record)">{{
                Object.keys(actionColumn)[0]
              }}</a>
              <a style="margin-left: 10px" @click="editReport(record)">{{
                Object.keys(actionColumn)[1]
              }}</a>
            </div> -->
          </tables-table>
        </a-col>
      </a-row>
  
      <!-- 编辑表单 -->
      <a-modal
        :title="'编辑'+ systemName"
        :visible="editReportModal"
        :confirm-loading="confirmLoading"
        :maskClosable="false"
        @cancel="() => closeModal()"
        width="50%"
      >
        <wiki-edit-form
          :key="reloadKey"
          @change="onFromChange"
          :columns="wikiRowInfo"
          :appType="appType"
        >
        </wiki-edit-form>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="submitLoading"
            @click="handleOk"
          >
            提交
          </a-button>
          <a-button @click="closeModal"> 取消 </a-button>
        </template>
      </a-modal>
    </a-card>
  </template>
  
  <script>
  import { mapState } from "vuex";
  import TablesTable from "./TablesTable";
  import { request, METHOD } from "@/utils/request";
  import {
    getTableList,
    getTodoCount,
    updateTableInfo,
    getFilterInfo,
    getBatchEditInfo,
  } from "@/services/biwiki";
  import WikiEditForm from "@/components/form/WikiEditForm";
  const BASE_URL = process.env.VUE_APP_API_BASE_URL;
  
  export default {
    name: "TableManage",
    components: {
      TablesTable,
      WikiEditForm,
    },
    data() {
      return {
        loading: false,
        dataSource: [],
        dataTableHeaders: [],
        actionColumn: [],
        editActionColumn: [],
        dataStatus: "All",
        table: {
          pageNumber: 1,
          pageSize: 20,
          total: 0,
        },
        editReportModal: false,
        confirmLoading: false,
        reportDetail: [],
        reportForm: {
          name: "",
          region: undefined,
        },
        unTakeBadge: "",
        dataBadge: "",
        submitLoading: false,
        wikiRowInfo: [],
        filterBar: [],
        filterColumns: [],
        conditions: {},
        tableWidth: 0,
        reloadKey: +new Date(),
        tablenameEllipsis: false,
        editDataSource: [],
        totalHeaders: [],
        editDataTableHeaders: [],
        editTableWidth: 0,
        keyword: "",
        editable: false,
        orinKey: {},
        clickParmas: {},
        showApi: "",
        gsheet:"",
        showGsheet:false,
        appType: "",
        systemName:'',
        systemRoute:'',
      };
    },
    created() {
      this.getEditTableData();
      this.getTableData();
      this.getTodoData();
      this.getFilterData();
    },
    watch: {
      "$route": {
        handler(newVal, oldVal) {
            if(newVal.matched[1]?.name === "BI WIKI"){
            const systemNames = {
              "/report-manage":{name:"报表",appType:"Report"},
              "/metric-manage":{name:"指标",appType:"Metric"},
              "/table-manage":{name:"底表",appType:"Table"},
              "/data-tool":{name:"工具",appType:"Tool"},
              "/analysis":{name:"分析",appType:"Analysis"},
              "/knowledge":{name:"知识",appType:"Knowledge"},
            }
            this.systemName = systemNames[newVal.path].name;
            this.appType = systemNames[newVal.path].appType;
            this.systemRoute = newVal.path;
          }
        },
        immediate: true,
      },
    },
    computed: {
      ...mapState("setting", ["pageMinHeight"]),
    },
    methods: {
      getApiData(api, parmas) {
        return request(`${BASE_URL}/${api}`, METHOD.POST, parmas, {
          headers: { "content-type": "application/json" },
        });
      },
      editReport(record, actionItem) {
        this.editReportModal = true;
        let click_parmas = {};
        actionItem.para.map((e) => (click_parmas[e] = record[e]));
        click_parmas["app_type"] = this.appType;
        click_parmas = JSON.stringify(click_parmas);
  
        this.getApiData(actionItem.api, click_parmas).then((res) => {
          if (res.data.status) {
            this.wikiRowInfo = res.data.data;
  
            // 将唯一标识保存，后面需要提交给接口
            this.wikiRowInfo.forEach((item) => {
              actionItem.para.map((e) => {
                if (e == item.name) {
                  this.orinKey[e] = item.options.orin_value;
                }
              });
            });
          }
        });
      },
      deleteReport(record, actionItem) {
        this.$confirm({
          title: "确定删除此条数据吗？",
          onOk: () => {
            let click_parmas = {};
            actionItem.para.map((e) => {
              click_parmas[e] = record[e];
            });
            click_parmas["app_type"] = this.appType;
            click_parmas = JSON.stringify(click_parmas);
  
            this.getApiData(actionItem.api, click_parmas).then((res) => {
              if (res.data.status) {
                // 刷新页面
                this.onSearch();
              }
            });
          },
          cancelText: "取消",
          okText: "确定",
        });
      },
      onSearch(conditions, searchOptions) {
        this.conditions = conditions;
        this.keyword = "";
        this.table.pageNumber = 1;
        this.getTodoData();
        this.getEditTableData();
        this.getTableData();
      },
      handleMenuClick(e) {
        if(e.key!=='Iframe'){
          this.showGsheet=false;
          switch (e.key) {
            case e.key:
              this.dataStatus = e.key;
              break;
          }
          this.conditions = {};
          this.keyword = "";
          this.table.pageNumber = 1;
          this.getEditTableData();
          this.getTableData();
          this.getFilterData();
        }else{
          this.showGsheet=true;
        }
      },
      getTableData() {
        const { conditions } = this;
        // this.loading = true;
        let parmasString = { data: conditions };
        parmasString["page_size"] = this.table.pageSize;
        parmasString["page_num"] = this.table.pageNumber;
        parmasString["data_status"] = this.dataStatus;
        parmasString["app_type"] = this.appType;
        if (this.keyword) {
          parmasString["keyword"] = this.keyword;
        }
        parmasString = JSON.stringify(parmasString);
  
        getTableList(parmasString).then((res) => {
          if (res.data.status) {
            let headers = res.data.data.table_headers; //表头
            this.actionColumn = res.data.data.action_column; //表头操作列
            let actionWidth = 0;
            this.actionColumn.map((item) => {
              actionWidth += +item.width;
            });
  
            let tableWidth = 0;
            let keyMap = { cnname: "title", name: "dataIndex" };
            this.dataTableHeaders = headers.map((item) => {
              // 表格总宽
              tableWidth += item.width;
  
              if (item.options.fixed) {
                item.fixed = item.options.fixed;
              }
  
              //template 风格的 API组件不用插槽也可以
              item.scopedSlots = { customRender: item.name };
              var objs = Object.keys(item).reduce((newData, key) => {
                let newKey = keyMap[key] || key;
                newData[newKey] = item[key];
                return newData;
              }, {});
              return objs;
            });
  
            // 增加操作列
            let action_column = {
              title: "操作",
              scopedSlots: { customRender: "action" },
              fixed: this.actionColumn[0].fixed,
              width: actionWidth,
              dataIndex: "action",
              appType: this.appType,//表头存储在localstorage时，作为区分
            };
            this.dataTableHeaders.push(action_column);
  
            this.tableWidth = tableWidth += action_column.width;
            this.dataSource = res.data.data.data; //表格内容
            this.table.total = res.data.data.total;
            this.filterBar = res.data.data.filter_bar; //表格左侧菜单
            this.filterBar.filter((item)=>{
              if(Object.keys(item)[0]==="Iframe"){
                this.gsheet =Object.values(item)[0].link;
              }
            })
          }
        });
      },
      getEditTableData() {
        const { conditions } = this;
        // this.loading = true;
        let parmasString = { data: conditions };
        parmasString["page_size"] = this.table.pageSize;
        parmasString["page_num"] = this.table.pageNumber;
        parmasString["data_status"] = this.dataStatus;
        parmasString["app_type"] = this.appType;
        if (this.keyword) {
          parmasString["keyword"] = this.keyword;
        }
        parmasString = JSON.stringify(parmasString);
  
        getBatchEditInfo(parmasString).then((res) => {
          if (res.data.status) {
            let headers = res.data.data.table_headers; //表头
            this.editActionColumn = res.data.data.action_column; //表头操作列
            let actionWidth = 0;
            this.editActionColumn.map((item) => {
              actionWidth += +item.width;
            });
  
            let tableWidth = 0;
            let keyMap = { cnname: "title", name: "dataIndex" };
            this.editDataTableHeaders = headers.map((item) => {
              // 表格总宽
              tableWidth += item.width;
              // if (item.options.class_style) {
              //   if (item.options.class_style.align) {
              //     item.customCell = () => {
              //       return {
              //         style: {
              //           textAlign: item.options.class_style.align,
              //         },
              //       };
              //     };
              //   }
              // }
  
              //template 风格的 API组件不用插槽也可以
              item.scopedSlots = { customRender: item.name };
              var objs = Object.keys(item).reduce((newData, key) => {
                let newKey = keyMap[key] || key;
                newData[newKey] = item[key];
                return newData;
              }, {});
              return objs;
            });
  
            // 增加操作列
            let action_column = {
              title: "操作",
              scopedSlots: { customRender: "action" },
              fixed: this.editActionColumn[0].fixed,
              width: actionWidth,
              dataIndex: "action",
            };
            this.editDataTableHeaders.push(action_column);
  
            this.editTableWidth = tableWidth += action_column.width;
            this.editDataSource = res.data.data.data; //表格内容
            this.table.total = res.data.data.total;
  
            this.editDataSource.map((item) => {
              // 每一行增加切换编辑状态的字段,提交接口时去掉
              item.change_status = false;
            });
  
            this.totalHeaders = [];
            for (let i = 0; i < this.editDataSource.length; i++) {
              // 深拷贝编辑表格的20条表头，用于存储每一行对应表头设置的变化
              this.totalHeaders.push(
                JSON.parse(JSON.stringify(this.editDataTableHeaders))
              );
            }
          }
        });
      },
      getFilterData() {
        getFilterInfo(JSON.stringify({ app_type: this.appType })).then((res) => {
          if (res.data.status) {
            this.filterColumns = res.data.data;
          }
        });
      },
      getTodoData() {
        getTodoCount({ app_type: this.appType }).then((res) => {
          if (res.data.status) {
            this.dataBadge = res.data.data.data_count;
          }
        });
      },
      onSizeChange(current, size) {
        this.table.pageNumber = 1;
        this.table.pageSize = size;
        this.getEditTableData();
        this.getTableData();
      },
      onPageChange(page, pageSize) {
        this.table.pageNumber = page;
        this.table.pageSize = pageSize;
        this.getEditTableData();
        this.getTableData();
      },
      onFromChange(data) {
        this.formData = data[0];
      },
      handleOk() {
        this.submitLoading = true;
        for (let key in this.formData) {
          if (!this.formData[key]) {
            this.formData[key] = null;
          }
        }
        this.formData.orin_key = this.orinKey;
  
        let parmasString = { data: [this.formData] };
        parmasString["app_type"] = this.appType;
        parmasString = JSON.stringify(parmasString);
  
        updateTableInfo(parmasString).then((res) => {
          this.submitLoading = false;
  
          if (res.data.status) {
            this.editReportModal = false;
            this.reloadKey = +new Date();
            this.getTodoData();
            this.getEditTableData();
            this.getTableData();
          }
          for (let key in this.formData) {
            if (!this.formData[key]) {
              this.formData[key] = undefined;
            }
          }
        });
      },
      closeModal() {
        this.reloadKey = +new Date();
        this.editReportModal = false;
      },
      isTablename(item) {
        if (item.cnname == "表名" && item.value.length > 52) {
          this.tablenameEllipsis = true;
          return true;
        } else {
          return false;
        }
      },
      searchInput(keyword) {
        this.keyword = keyword;
        this.table.pageNumber = 1;
        this.getEditTableData();
        this.getTableData();
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  /deep/ .ant-card-body{
    padding: 0 7px 0 0;
  }
  //为防止下拉选项内容过长被省略
  /deep/ .ant-select-dropdown-menu-item {
    white-space: normal;
  }
  </style>