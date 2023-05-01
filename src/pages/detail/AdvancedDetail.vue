<template>
  <page-layout
    title="单号：234231029431"
    logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
  >
    <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="创建人">曲丽丽</detail-list-item>
      <detail-list-item term="订购产品">XX服务</detail-list-item>
      <detail-list-item term="创建时间">2018-08-07</detail-list-item>
      <detail-list-item term="关联单据"><a>12421</a></detail-list-item>
      <detail-list-item term="生效日期"
        >2018-08-07 ~ 2018-12-11</detail-list-item
      >
      <detail-list-item term="备注">请于两个工作日内确认</detail-list-item>
    </detail-list>
    <template slot="extra">
      <head-info title="状态" content="待审批" />
      <head-info title="订单金额" content="¥ 568.08" />
    </template>
    <template slot="action">
      <a-button-group style="margin-right: 8px">
        <a-button>操作</a-button>
        <a-button>操作</a-button>
        <a-button><a-icon type="ellipsis" /></a-button>
      </a-button-group>
      <a-button type="primary">主操作</a-button>
    </template>

    <a-card style="margin-top: 24px" title="需求动态">
      <a-timeline style="width: 200px">
        <a-timeline-item :key="index" v-for="(item, index) in actionList">
          <a-card style="margin-top: 10px">
            {{ item.value }}
            <div style="position: relative">
              <!-- :class="listIndex.indexOf (index)!=-1 ? 
              'action-detail-open' : 'action-detail'" -->
              <div  ref="programDescription">
                {{ item.content }}
              </div>
              <div v-if="array111.indexOf(index) != -1" class="detailIcon">
                <a @click="toggleDetail(index)"
                  >{{ listIndex.indexOf(index) != -1 ? "收起" : "展开" }}
                  <a-icon
                    :type="listIndex.indexOf(index) != -1 ? 'up' : 'down'"
                /></a>
              </div>
            </div>
          </a-card>
        </a-timeline-item>
      </a-timeline>
    </a-card>

    <a-card :bordered="false" title="流程进度">
      <a-steps
        :current="1"
        progress-dot
        :direction="isMobile ? 'vertical' : 'horizontal'"
      >
        <a-step title="创建项目">
          <a-step-item-group
            :align="isMobile ? 'left' : 'center'"
            slot="description"
          >
            <a-step-item
              link="/dashboard/workplace"
              title="曲丽丽"
              icon="dingding-o"
            />
            <a-step-item title="2016-12-12 12:32" />
          </a-step-item-group>
        </a-step>
        <a-step title="部门初审">
          <a-step-item-group
            :align="isMobile ? 'left' : 'center'"
            slot="description"
          >
            <a-step-item link="/form/step" title="周毛毛" icon="dingding-o" />
            <a-step-item link="/result/success" title="催一下" icon="bell" />
          </a-step-item-group>
        </a-step>
        <a-step title="财务复核"> </a-step>
        <a-step title="完成"> </a-step>
      </a-steps>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false" title="用户信息">
      <detail-list>
        <detail-list-item term="用户姓名">付晓晓</detail-list-item>
        <detail-list-item term="会员卡号"
          >32943898021309809423</detail-list-item
        >
        <detail-list-item term="身份证">3321944288191034921</detail-list-item>
        <detail-list-item term="联系方式">18112345678</detail-list-item>
        <detail-list-item term="联系地址"
          >浙江省杭州市西湖区黄姑山路工专路交叉路口</detail-list-item
        >
      </detail-list>
      <detail-list title="信息组">
        <detail-list-item term="某某数据">725</detail-list-item>
        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>
        <detail-list-item>&nbsp;</detail-list-item>
        <detail-list-item term="某某数据">725</detail-list-item>
        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>
        <detail-list-item>&nbsp;</detail-list-item>
      </detail-list>
      <a-card type="inner" title="多层信息组">
        <detail-list title="组名称" size="small">
          <detail-list-item term="负责人">林东东</detail-list-item>
          <detail-list-item term="角色码">1234567</detail-list-item>
          <detail-list-item term="所属部门">XX公司-YY部</detail-list-item>
          <detail-list-item term="过期时间">2018-08-08</detail-list-item>
          <detail-list-item term="描述" class="longerContent"
            >这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长</detail-list-item
          >
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="组名称" size="small" :col="1">
          <detail-list-item term="学名">林东东</detail-list-item>
          <detail-list-item term="角色码">1234567</detail-list-item>
          <detail-list-item term="所属部门">XX公司-YY部</detail-list-item>
          <detail-list-item term="过期时间">2018-08-08</detail-list-item>
          <detail-list-item term="描述" class="longerContent"
            >这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长</detail-list-item
          >
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="组名称" size="small" :col="2">
          <detail-list-item term="学名">林东东</detail-list-item>
          <detail-list-item term="角色码">1234567</detail-list-item>
          <detail-list-item term="所属部门">XX公司-YY部</detail-list-item>
          <detail-list-item term="过期时间">2018-08-08</detail-list-item>
          <a-tooltip placement="topLeft" title="描述">
            <detail-list-item term="描述" class="longerContent"
              >这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长</detail-list-item
            >
          </a-tooltip>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="用户个人信息" size="small" :col="4">
          <detail-list-item
            :key="item.key"
            :term="item.value"
            v-for="item in userList"
          >
            <span
              v-if="item.value == '用户所在组' && item.content.length > 20"
              class="ignoreContent"
            >
              <a-tooltip :title="item.content">
                {{ item.content }}
              </a-tooltip>
            </span>
            <span v-else>{{ item.content }}</span>
          </detail-list-item>
        </detail-list>
      </a-card>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="用户近半年来电记录"
    >
      <a-list></a-list>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="
        (key) => {
          this.activeTabKey = key;
        }
      "
    >
      <a-table
        v-if="activeTabKey === '1'"
        :columns="operationColumns"
        :dataSource="operation1"
        :pagination="false"
      />
      <a-table
        v-if="activeTabKey === '2'"
        :columns="operationColumns"
        :dataSource="operation2"
        :pagination="false"
      />
      <a-table
        v-if="activeTabKey === '3'"
        :columns="operationColumns"
        :dataSource="operation3"
        :pagination="false"
      />
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import AStepItem from "@/components/tool/AStepItem";
import {
  operation1,
  operation2,
  operation3,
  operationColumns,
} from "@/mock/common/tableData";
import { mapState } from "vuex";
import HeadInfo from "@/components/tool/HeadInfo";

const DetailListItem = DetailList.Item;
const AStepItemGroup = AStepItem.Group;

const tabList = [
  {
    key: "1",
    tab: "操作日志一",
  },
  {
    key: "2",
    tab: "操作日志二",
  },
  {
    key: "3",
    tab: "操作日志三",
  },
];

const userList = [
  {
    key: "1",
    value: "用户名称",
    content: "wahaha",
  },
  {
    key: "2",
    value: "用户部门",
    content: "BI & planning",
  },
  {
    key: "3",
    value: "用户所在组",
    content: "Object > Data infrastructure",
  },
  {
    key: "4",
    value: "用户入职时间",
    content: new Date().toLocaleDateString(),
  },
];

const actionList = [
  {
    key: "1",
    value: "csdn1",
    content: "Vue完成数据请求后内容超出显示省略号+显示查看全文按钮",
  },
  {
    key: "2",
    value: "csdn2",
    content: "【已解决】Failed to connect to github.com port 443 : Timed out",
  },
  {
    key: "3",
    value: "csdn3",
    content: "Vue监听路由变化的几种方法(亲测有效)",
  },
  {
    key: "4",
    value: "csdn4",
    content: "require.ensure简单理解、如何实现chatgpt的打字机效果",
  },
  {
    key: "5",
    value: "csdn5",
    content: "细致讲解slot插槽的使用",
  },
];

export default {
  name: "AdvancedDetail",
  components: {
    HeadInfo,
    AStepItemGroup,
    AStepItem,
    DetailListItem,
    DetailList,
    PageLayout,
  },
  data() {
    return {
      tabList,
      userList,
      operationColumns,
      operation1,
      operation2,
      operation3,
      activeTabKey: "2",
      array111: [],
      listIndex: [],
      actionList,
    };
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
  },
  mounted() {
    this.getRequireAction();
  },
  methods: {
    getRequireAction() {
      this.$nextTick(() => {
        console.log("999", this.$refs.programDescription);

        this.$refs.programDescription.forEach((item, index) => {
          //原本长度达到三行的情况
          if (item.clientHeight > 60) {
            this.array111.push(index);
          }
        });
        console.log("55", this.array111);
      });
    },
    aaa(index) {
      if (this.array111.length !== 0) {
        return this.array111.indexOf(index) != -1
          ? "action-detail-open"
          : "action-detail";
      }
    },
    // toggleDetailStyle(index){
    // },
    toggleDetail(index) {
      if (this.listIndex.indexOf(index) == -1) {
        this.listIndex.push(index);
      } else {
        this.listIndex = this.listIndex.filter((item) => item != index);
      }
    },
    onTabChange(key) {
      console.log(key);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .detail-list .longerContent .content {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
}
.ignoreContent {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 50%;
  display: block;
}
.action-detail {
  width: 85%; // (一定要加宽度）
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; // 溢出用省略号
  // // white-space: nowrap; // 溢出不换行 文本不换行
  word-break: break-all;
  -webkit-line-clamp: 3; //控制显示的行数
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式)
  display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示
}

.action-detail-open {
  width: 85%; // (一定要加宽度）
  overflow: hidden; //超出的文本隐藏
}
</style>
