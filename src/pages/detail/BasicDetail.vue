<template>
  <page-layout title="基础详情页" sa>
    <a-card style="margin-bottom: 20px">
      <!-- <span>{{ str }}</span
      ><br /><br />
     
      <a-textarea
        v-model="sql"
        style="width: 100%"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      ></a-textarea> -->
      <!-- <code></code> -->
      查看：
      <pre>{{ str }}</pre>
      <br />
      编辑：<br />
      <SqlEditor
        ref="sqleditor"
        :value="code"
        @changeTextarea="changeTextarea($event)"
      />
      <a-button size="small" class="sql-btn" @click="formaterSql(code)"
        >格式化sql
      </a-button>
      <br /><br /><br />

      <a-form-model-item label="代码编辑器">
        <div class="codeEditBox">
          <!-- @input="codeChange" -->
          <code-editor
            ref="editor"
            @init="editorInit"
            v-model="code"
            lang="sqlserver"
            :options="editorOptions"
            theme="textmate"
          ></code-editor>
        </div>
      </a-form-model-item>
      <a-button
        type="primary"
        size="small"
        class="sql-btn"
        @click="formaterEditor()"
        >格式化sql
      </a-button>
    </a-card>

    <a-card title="实--例" class="demo">
      <h2>文本超长溢出头部打点的情况:</h2>

      <div class="first">
        <!-- 参考：https://juejin.cn/post/7226540105698197563 -->

        <div contenteditable="true">
          Make CSS Ellipsis Beginning of String and number
        </div>
        <!-- direction 在处理非纯数字文本上的规则与其他不一致 -->
        <div>13993199751 > 18037893546 > 4477656</div>
        <div><span>13993199751 > 18037893546 > 4477656</span></div>
      </div>
      <br /><br />

      <h4>增加伪元素：</h4>
      <div class="add-content">
        <span>13993199751 > 18037893546 > 4477656</span>
      </div>
      <br />

      <h4>用bdi标签：</h4>
      <div class="use-bdi">
        <!--  dir="ltr" -->
        <bdi>13993199751 > 18037893546 > 4477656</bdi>
      </div>

      <!-- csv、xls、xlsx -->
      <button @click="beforeUploadShopId('1111.csv')">8888</button>
    </a-card>

    <a-card>
      <div style="width: 100%; height: 80px" id="base-echart"></div>
    </a-card>

    <a-card :bordered="false">
      <detail-list title="退款详情">
        <detail-list-item term="取货单号">1000000000</detail-list-item>
        <detail-list-item term="状态">已取货</detail-list-item>
        <detail-list-item term="销售单号">987654321</detail-list-item>
        <detail-list-item term="子订单">1234567890</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px" />
      <detail-list title="用户信息">
        <detail-list-item term="用户姓名">付小小</detail-list-item>
        <detail-list-item term="联系电话">18100000001</detail-list-item>
        <detail-list-item term="常用快递">菜鸟仓储</detail-list-item>
        <detail-list-item term="取货地址"
          >浙江省杭州市西湖区万塘路19号</detail-list-item
        >
        <detail-list-item term="备注">无</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px" />
      <div class="title">退货商品</div>
      <a-table
        row-key="id"
        style="margin-bottom: 24px"
        :columns="goodsColumns"
        :dataSource="goodsData"
        :pagination="false"
      >
      </a-table>
      <div class="title">退货进度</div>
      <a-table
        :columns="scheduleColumns"
        :dataSource="scheduleData"
        :pagination="false"
      >
      </a-table>
    </a-card>
  </page-layout>
</template>

<script>
import sqlFormatter from "sql-formatter";
import SqlEditor from "./SqlEditor";
import CodeEditor from "vue2-ace-editor";
import DetailList from "../../components/tool/DetailList";
import PageLayout from "../../layouts/PageLayout";
import * as echarts from "echarts";

let str =
  "with return as ( select distinct order_id,from_unixtime(return_created_timestamp) return_created_time,from_unixtime(return_accepted_timestamp) return_accepted_time,return_reason from( select distinct a.order_id,return_created_timestamp,return_accepted_timestamp,return_reason  ,ROW_NUMBER()over(PARTITION by a.order_id order by return_created_timestamp desc) rn from mp_order.dwd_return_item_all_ent_df__reg_s0_live a where  a.is_cb_shop=1 and date(from_unixtime(return_created_timestamp))>=date('2022-01-01')) where rn=1 )";
let sql = sqlFormatter.format(str);

const DetailListItem = DetailList.Item;

const goodsColumns = [
  {
    title: "商品编号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "商品名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "商品条码",
    dataIndex: "barcode",
    key: "barcode",
  },
  {
    title: "单价",
    dataIndex: "price",
    key: "price",
    align: "right",
  },
  {
    title: "数量（件）",
    dataIndex: "num",
    key: "num",
    align: "right",
  },
  {
    title: "金额",
    dataIndex: "amount",
    key: "amount",
    align: "right",
  },
];

const goodsData = [
  {
    id: "1234561",
    name: "矿泉水 550ml",
    barcode: "12421432143214321",
    price: "2.00",
    num: "1",
    amount: "2.00",
  },
  {
    id: "1234562",
    name: "凉茶 300ml",
    barcode: "12421432143214322",
    price: "3.00",
    num: "2",
    amount: "6.00",
  },
  {
    id: "1234563",
    name: "好吃的薯片",
    barcode: "12421432143214323",
    price: "7.00",
    num: "4",
    amount: "28.00",
  },
  {
    id: "1234564",
    name: "特别好吃的蛋卷",
    barcode: "12421432143214324",
    price: "8.50",
    num: "3",
    amount: "25.50",
  },
];

const scheduleColumns = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "当前进度",
    dataIndex: "rate",
    key: "rate",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "操作员ID",
    dataIndex: "operator",
    key: "operator",
  },
  {
    title: "耗时",
    dataIndex: "cost",
    key: "cost",
  },
];

const scheduleData = [
  {
    key: "1",
    time: "2017-10-01 14:10",
    rate: "联系客户",
    status: "processing",
    operator: "取货员 ID1234",
    cost: "5mins",
  },
  {
    key: "2",
    time: "2017-10-01 14:05",
    rate: "取货员出发",
    status: "success",
    operator: "取货员 ID1234",
    cost: "1h",
  },
  {
    key: "3",
    time: "2017-10-01 13:05",
    rate: "取货员接单",
    status: "success",
    operator: "取货员 ID1234",
    cost: "5mins",
  },
  {
    key: "4",
    time: "2017-10-01 13:00",
    rate: "申请审批通过",
    status: "success",
    operator: "系统",
    cost: "1h",
  },
  {
    key: "5",
    time: "2017-10-01 12:00",
    rate: "发起退货申请",
    status: "success",
    operator: "用户",
    cost: "5mins",
  },
];

export default {
  name: "BasicDetail",
  components: { PageLayout, DetailListItem, DetailList, SqlEditor, CodeEditor },
  data() {
    return {
      sqlFormatter,
      str,
      sql,
      goodsColumns,
      goodsData,
      scheduleColumns,
      scheduleData,
      basicInfoForm: {
        sqlMain: "",
      },
      code: `
      
  with wh_pff_pool as (
  select a.shop_id 
  ,max_by(warehouse_type,pff_tag) warehouse_type
    ,max(a.pff_tag) as pff_tag
  from cncbbi_general.wh_and_pff_shop_list_v4 a 
  where grass_date = (select max(grass_date) as max_time from cncbbi_general.wh_and_pff_shop_list_v4) 
  group by 1
)

      `,
      editorOptions: {
        // 设置代码编辑器的样式
        enableLiveAutocompletion: true, // 启用实时自动完成
        enableBasicAutocompletion: true, // 启用基本自动完成
        behavioursEnabled: true,
        autoScrollEditorIntoView: true,
        enableSnippets: true, // 启用代码段
        tabSize: 4, // 标签大小
        fontSize: 12, // 设置字号
        showPrintMargin: false, // 去除编辑器里的竖线
        showLineNumbers: true, // 显示行号
        wrap: true,
        scrollPastEnd: true, // 滚动位置
        highlightActiveLine: true, // 高亮当前行
        highlightSelectedWord: false, //高亮选中文本
        maxLines: 18, // 最大行数，超过会自动出现滚动条
        readOnly: false,
        minLines: 5, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      },
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(document.getElementById("base-echart"));
      this.chart.setOption({
        grid: {
          // left: "18%",
          // right: "15%",
          // bottom: "30%",
          // containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: ["数据看板", "查询数据", "下载数据"],
        },
        series: [
          {
            data: [
              {
                value: 23,
                itemStyle: {
                  color: "#ff8a6e",
                },
              },
              {
                value: 55,
                itemStyle: {
                  color: "#a7ea80",
                },
              },
              {
                value: 97,
                itemStyle: {
                  color: "#6fa9f9",
                },
              },
            ],
            type: "bar",
          },
        ],
      });
    },
    beforeUploadShopId(file) {
      // if (this.shopIdList.length > 0) {
      //   this.$message.warning("只允许上传一个文件哦", 3);
      //   return false;
      // }
      // if (file.indexOf(".csv") == -1) {
      //   this.$message.warning("只允许上传csv、xls、xlsx格式文件", 3);
      // } else if (file.indexOf(".xls") == -1) {
      //   this.$message.warning("只允许上传csv、xls、xlsx格式文件", 3);
      // } else if (file.indexOf(".xlsx") == -1) {
      //   this.$message.warning("只允许上传csv、xls、xlsx格式文件", 3);
      //   return false;
      // }
      // this.shopIdList = [...this.shopIdList, file];

      // 正确做法
      // != -1为包含   ==-1为不包含
      // if (
      //   file.indexOf(".csv") == -1 &&
      //   file.indexOf(".xls") == -1 &&
      //   file.indexOf(".xlsx") == -1
      // ) {
      //   this.$message.warning("只允许上传csv、xls、xlsx格式文件");
      //   return false;
      // }

      // 原本做法   包含.csv时会报错
      if (file.indexOf(".csv") != -1) {
        this.$message.warning("只允许上传csv、xls、xlsx格式文件");
        return false;
      }
      return false;
    },
    changeTextarea(val) {
      this.$set(this.basicInfoForm, "sqlMain", val);
    },
    formaterSql() {
      let dom = this.$refs.sqleditor;
      dom.editor.setValue(
        sqlFormatter.format(dom.editor.getValue(), {
          language: "sql",
          tabWidth: 4,
          commaPosition: "before",
          keywordCase: "preserve",
          linesBetweenQueries: 2,
        })
      );
    },
    // codeChange(val) {
    //   console.log("222", val);
    // },
    formaterEditor() {
      this.code = sqlFormatter.format(this.code, {
        language: "sql",
        tabWidth: 4,
        commaPosition: "before",
        keywordCase: "preserve",
        linesBetweenQueries: 2,
      });
    },
    editorInit() {
      require("brace/theme/textmate"); //主题
      require("brace/ext/language_tools"); //启用提示菜单
      require("brace/ext/searchbox"); //启用提示菜单
      require("brace/mode/yaml"); //语言模式
      require("brace/mode/json");
      require("brace/mode/less");
      require("brace/mode/lua");
      require("brace/mode/javascript");
      require("brace/mode/sql");
      require("brace/mode/sqlserver");
      require("brace/snippets/sqlserver");
      require("brace/snippets/sql");
      require("brace/snippets/json");
      require("brace/snippets/python");
      require("brace/snippets/yaml");
      require("brace/snippets/lua");
      require("brace/snippets/javascript");
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  color: @title-color;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.demo {
  margin-bottom: 24px;
  width: 270px;

  .first {
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      //设置文本排列的方向  rtl表示从右到左 ltr相反
      direction: rtl;

      span {
        direction: ltr;
        //unicode-bidi：处理双向文字的算法是Unicode双向算法
        //用于覆盖默认的 Unicode 双向算法以控制文本的显示方向。
        unicode-bidi: bidi-override;
      }
    }
  }

  .add-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: rtl;

    span::before {
      // content: "q"; //通过伪元素破坏其纯数字的性质 不优雅
      content: "\200e"; // Unicode字符方向控制工具  强制控制文本排序
      opacity: 0;
      font-size: 0;
    }
  }

  .use-bdi {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: rtl;
  }
}

.codeEditBox {
  width: 44%;
  // height: 90px;
  border: 1px solid #dcdee2;
}

/deep/ .ace_scroller {
  overflow-x: auto;
}
</style>
