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

    <a-card title="需求动态">
      monaco编辑器：
      <div id="monacoContainer" style="height: 500px"></div>

      <div style="display: flex">
        <a-timeline style="width: 400px">
          <a-timeline-item :key="index" v-for="(item, index) in actionList">
            <a-card style="margin-top: 10px">
              {{ item.value }}
              <div style="position: relative">
                <!-- :class="listIndex.indexOf (index)!=-1 ? 
              'action-detail-open' : 'action-detail'" -->
                <div ref="programDescription">
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
      </div>
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
      <detail-list title="信息组">
        <detail-list-item term="某某数据">725</detail-list-item>
        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>
        <detail-list-item>&nbsp;</detail-list-item>
        <detail-list-item term="某某数据">725</detail-list-item>
        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>
        <detail-list-item>&nbsp;</detail-list-item>
      </detail-list>
      <a-card type="inner" title="多层信息组">
        <detail-list title="组名称" size="small" :col="2">
          <detail-list-item term="学名">林东东</detail-list-item>
          <detail-list-item term="角色码">1234567</detail-list-item>
          <detail-list-item term="所属部门">XX公司-YY部</detail-list-item>
          <detail-list-item term="过期时间">2018-08-08</detail-list-item>
          <a-tooltip placement="topLeft" title="描述">
            <detail-list-item term="描述" class="longerContent">
              这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长
            </detail-list-item>
          </a-tooltip>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list
          title="内容被压缩时，不换行，而是显示省略号并悬浮气泡框tooltip："
          size="small"
          :col="4"
        >
          <div :key="item.key" :term="item.value" v-for="item in userList">
            <!-- <span
              v-if="item.value == '用户所在组' && item.content.length > 20"
              class="ignoreContent">
              <a-tooltip :title="item.content">
                {{ item.content }}
              </a-tooltip>
            </span>
            <span v-else>{{ item.content }}</span> -->

            <!-- 文本超出宽度时显示 -->
            <a-tooltip :visible="item.showTooltip" :title="item.content">
              <div class="ellipsis-item">
                <span
                  @mouseover="(e) => overName(e, item)"
                  @mouseleave="item.showTooltip = false"
                >
                  {{ item.content }}
                </span>
              </div>
            </a-tooltip>
          </div>
        </detail-list>
      </a-card>
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
// import * as monaco from "monaco-editor";
import { setLocaleData } from "monaco-editor-nls";
import zh_CN from "monaco-editor-nls/locale/zh-hans";
// 把所有的输出包裹到 actions 对象里
import * as actions from "monaco-editor/esm/vs/platform/actions/common/actions";
setLocaleData(zh_CN);
const monaco = require("monaco-editor/esm/vs/editor/editor.api");

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
    content: "wahahahahahahahaha,wahahahahahahahahawah,ahahahahahahahawahah,ahahahahahahahawahah,ahahahahahahahawahah,ahahahahahaha",
    showTooltip: false,
  },
  {
    key: "2",
    value: "用户部门",
    content: "CNCB & BI & planning,Object > Data infrastructure",
    showTooltip: false,
  },
  {
    key: "3",
    value: "用户所在组",
    content: "CNCB PnL Dashboard - Special case ：MT_Lifestyle_S&O_AutoMoto_Stationery_Hobbies",
    showTooltip: false,
  },
  {
    key: "4",
    value: "用户入职时间",
    content:
      new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString(),
    showTooltip: false,
  },
];

//CSS 实现超过固定高度后出现展开折叠按钮
//https://juejin.cn/post/7202030221793165368#heading-0
const actionList = [
  {
    key: "1",
    value: "csdn1",
    content:
      "Vue完成数据请求后内容超出显示省略号+显示查看全文按钮，Vue完成数据请求后内容超出显示省略号+显示查看全文按钮，Vue完成数据请求后内容超出显示省略号+显示查看全文按钮",
  },
  {
    key: "2",
    value: "csdn2",
    content:
      "【已解决】Failed to connect to github.com port 443 : Timed out，【已解决】Failed to connect to github.com port 443 : Timed out，【已解决】Failed to connect to github.com port 443 : Timed out，【已解决】Failed to connect to github.com port 443 : Timed out",
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
      monacoEditor: null,
      monacoOptions: {
        value: "var aaa='1321'", // 编辑器的值
        language: "javascript", //语言
        theme: "CodeSampleTheme", // 编辑器主题：vs, hc-black, or vs-dark
        themeColor: "red",
        autoIndent: true, // 自动缩进
        readOnly: false, // 是否只读
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: "indentation", // 折叠方式  auto | indentation
        showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        codeLens: false, // 代码镜头
        scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
        lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 5, // 行号最小字符   number
        enableSplitViewResizing: false,
        minimap: {
          // 关闭代码缩略图
          enabled: false, // 是否启用预览图
        },
      },
    };
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
  },
  mounted() {
    this.getRequireAction();
    this.createMonacoEditor();
    // this.$refs.codeEditor.setEditorValue(data)
  },
  methods: {
    createMonacoEditor() {
      const container = document.getElementById("monacoContainer");
      this.monacoEditor = monaco.editor.create(container, this.monacoOptions);

      // 自定义主题背景色
      monaco.editor.defineTheme("CodeSampleTheme", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "", foreground: "#d71717", background: "#12d494" },
          { token: "comments", foreground: "#c0c0c0" },
          { token: "string", foreground: "#dc0a0a" },
          { token: "keyword", foreground: "#0000FF", fontStyle: "bold" },
          { token: "key", foreground: "#863B00" },
        ],
        colors: {
          // 相关颜色属性配置
          ["editor.background"]: "#fff5fd", // 背景色
          "editorWidget.background": "#fdeefa", //查找/搜索编辑器部件
          "menu.background": "#fdeefa", //右键菜单项
        },
      });

      monaco.editor.setTheme("CodeSampleTheme");

      // this.monacoEditor.addAction({
      //   id: "translate", // 菜单项 id
      //   label: "汉化", // 菜单项名称
      //   keybindings: [], // 绑定快捷键
      //   // keybindings: [this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_J], // 绑定快捷键
      //   contextMenuGroupId: "navigation", // 所属菜单的分组
      //   run: () => {}, // 点击后执行的操作
      // });

      // const contextmenu = this.monacoEditor.getContribution(
      //   "editor.contrib.contextmenu"
      // );
      let menus = actions.MenuRegistry._menuItems;
      let contextMenuEntry = [...menus].find(
        (entry) => entry[0]._debugName == "EditorContext"
      );
      let contextMenuLinks = contextMenuEntry[1];
      let allCommandIds = [...contextMenuLinks].map(el => el)
      let removableIds = [
      "editor.action.goToTypeDefinition",
      "editor.action.goToReferences",

        // "editor.action.clipboardCutAction",
        // "editor.action.clipboardCopyAction",
        // "editor.action.clipboardPasteAction",
        // "editor.action.refactor",
        // "editor.action.sourceAction",
        // "editor.action.revealDefinition",
        // "editor.action.revealDeclaration",
        // "editor.action.goToImplementation",
        // "editor.action.formatDocument",
        // "editor.action.formatSelection",
        // "editor.action.changeAll",
        // "editor.action.rename",
        // "editor.action.quickOutline",
        // "editor.action.quickCommand",
        // "Peek",
      ];
      let removeById = (list, ids) => {
        let node = list._first;
        do {
          let shouldRemove =
            ids.includes(node.element?.command?.id) ||
            ids.includes(node.element?.title);
          if (shouldRemove) {
            list._remove(node);
          }
        } while ((node = node.next));
      };
      removeById(contextMenuLinks, removableIds);
      console.log("111", allCommandIds);
    },
    getRequireAction() {
      this.$nextTick(() => {
        this.$refs.programDescription.forEach((item, index) => {
          //原本长度达到三行的情况
          if (item.clientHeight > 60) {
            this.array111.push(index);
          }
        });
      });
    },
    toggleDetail(index) {
      console.log("2323", index);
      if (this.listIndex.indexOf(index) == -1) {
        this.listIndex.push(index);
      } else {
        this.listIndex = this.listIndex.filter((item) => item != index);
      }
    },
    onTabChange(key) {
      console.log(key);
    },

    overName(e, item) {
      //div父元素
      const parentWidth = e.currentTarget.parentNode.offsetWidth;
      //span子元素
      const contentWidth = e.currentTarget.offsetWidth;
      // 子元素>父元素，文字内容超出当前宽度时手动控制气泡框显示
      if (contentWidth > parentWidth) {
        item.showTooltip = true;
      }
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

//用input输入框被选中做内容超出一定高度时隐藏
.content {
  width: 400px;
  max-height: 200px;
  overflow: hidden;
}
.content2 {
  width: 400px;
  max-height: 200px;
  overflow: hidden;
}
.section {
  display: flex;
}
pre {
  white-space: pre-wrap;
}
.content::before {
  content: "";
  width: 100px;
  height: 100%;
  float: left;
}
.content2::before {
  content: "";
  width: 100px;
  height: 100%;
  float: left;
}
.btn {
  float: right;
  width: 100px;
  text-align: center;
  position: relative;
  left: calc(50% - 50px);
  transform: translateY(-100%);
  cursor: pointer;
}
.btn::after {
  content: "";
  display: block;
  height: 34px;
  background-color: #666;
  transition: 0.2s background-color;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E %3Cpath d='M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z'%3E%3C/path%3E %3C/svg%3E")
    center/ 24px 24px no-repeat;
}
.btn:hover::after {
  background-color: royalblue;
}
.btn::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 34px;
}
.text {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 15px;
  float: right;
  line-height: 1.5;
  margin: 0;
  margin-left: -100px;
  font-size: 18px;
  color: #232323;
  -webkit-mask: linear-gradient(red 150px, transparent 200px);
}
.content-check:checked + .content {
  max-height: fit-content;
}
.content-check:checked + .content .btn {
  left: auto;
  right: calc(50% - 50px);
}
.content-check:checked + .content .btn::after {
  transform: scaleY(-1);
}
.content-check:checked + .content .text {
  -webkit-mask: none;
}

.ellipsis-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
