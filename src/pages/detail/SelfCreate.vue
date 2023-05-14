<template>
  <page-layout title="自定义页面">
    <a-card :bordered="false">
      <div class="wrapper">
        <div class="typing-demo">
          <!-- 有趣且实用的 CSS 小且实用的 CSS 小且实用的 CSS 小且实用的 CSS 小技巧 -->
        </div>
      </div>

      <h2>文字提示工具:</h2>
      <a-row>
        <a-col :span="9">
          <!-- 使用h函数的组件 -->
          <v-node></v-node>
          <p>
            Hover
            <span class="tooltip" data-tooltip="Tooltip Content">Here</span>
            to see the tooltip.
            <br />
            You can also hover
            <span class="tooltip" data-tooltip="This is another Tooltip Content"
              >here</span
            >
            to see another example.
            <br />
            <span class="tooltip" data-tooltip="Tooltip Content">Here</span>
            to see the tooltip.
          </p>
        </a-col>
        <a-col :span="15">
          <ol>
            <li>
              不受限制：自定义外观和行为，使工具提示与网站或应用程序的设计完全匹配
            </li>
            <li>提升网页性能：不依赖任何第三方库或框架，加载速度更快</li>
            <li>attr()函数是CSS中的内置函数,它返回所选元素的属性值</li>
            <li>
              参考链接：<a
                style="margin-right: 15px"
                href="https://www.runoob.com/css/css-tooltip.html"
                target="_blank"
                >CSS 提示工具(Tooltip)</a
              >
              <a
                href="https://www.runoob.com/cssref/func-attr.html"
                target="_blank"
                >CSS attr() 函数</a
              >
            </li>
          </ol>
        </a-col>
      </a-row>

      <a-divider dashed />

      <a-row>
        <a-col :span="9">
          <h3>antd框架的Tooltip组件</h3>

          <a-tooltip overlayClassName="tooltipStyle">
            <template slot="title"> prompt text </template>
            Tooltip show when mouse enter. </a-tooltip
          ><br />
          <!--  overlayStyle={background-color:red}无效 -->
          <a-tooltip placement="bottomRight">
            <template slot="title"> prompt text </template>
            Tooltip will show when mouse enter2.
          </a-tooltip>
        </a-col>
        <a-col :span="15">
          <ol>
            <li>
              易使用：提供了预设的样式，使用方法简单、直观，不用编写大量代码
            </li>
            <li>丰富的选项：自定义触发方式、位置、箭头等</li>
            <li>受限制：依赖不同版本ui框架，难以非常定制</li>
            <li>overlayClassName类名全局污染</li>
            <li>
              参考链接：<a
                href="https://1x.antdv.com/components/tooltip-cn/#Tooltip-"
                target="_blank"
                >antd Tooltip 文字提示</a
              >
            </li>
          </ol>
        </a-col>
      </a-row>
    </a-card>

    <a-card class="typeWriter">
      <div v-for="(item, index) in chatLists" :key="index">
        <div v-html="item"></div>
      </div>

      <!-- prevent -->
      <a-input
        class="textareaInput"
        type="textarea"
        v-model="inputMsg"
        rows="2"
        auto-focus
        placeholder="请输入内容"
        @keyup.enter.exact="sendMsg"
        @keyup.ctrl.enter="
          () => {
            inputMsg = inputMsg + '\n';
          }
        "
      />
      <a-button type="primary" @click="sendMsg">发送</a-button>

      <div><br />
        <span>清除字符串两端的空格：</span>
        <a
          href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trim"
          target="_blank"
          >trim()</a
        ><br />
        <span>监听输入法打字：</span>
        <a
          href="https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionstart_event"
          target="_blank"
          >compositionstart、compositionupdate、compositionend</a
        >
        <br />
        <textarea
          readonly
          class="event-log-contents"
          rows="5"
          cols="50"
        ></textarea><br />
        <button class="clear-log">Clear</button>
      </div>
    </a-card>
  </page-layout>
</template>

<script>
import VNode from "./vnode";
//使用page-layout自定义组件忘记引入
//报错：Unknown custom element: <page-layout> - did you register the component correctly?
//For recursive components, make sure to provide the "name" option.
//翻译：未知的自定义元素：＜页面布局＞-您是否正确注册了组件？对于递归组件，请确保提供“name”选项。
import PageLayout from "../../layouts/PageLayout";

export default {
  name: "SelfCreate",
  //这里VNode报错：The "VNode" component has been registered but not used.
  //原来是引入了VNode.js组件，但是没有在template使用
  components: { VNode, PageLayout },
  data() {
    return {
      inputMsg: "",
      chatLists: [],
    };
  },
  mounted() {
    const inputElement = document.querySelector(".textareaInput");
    inputElement.addEventListener("compositionstart", this.handleEvent);
    inputElement.addEventListener("compositionupdate", this.handleEvent);
    inputElement.addEventListener("compositionend", this.handleEvent);
  },
  methods: {
    sendMsg() {
      this.chatLists.push(this.inputMsg);
      this.inputMsg = "";
      // const typeContainer = document.querySelector(".typeWriter");
      // typeContainer.scrollTop += 9999;
    },

    handleEvent(event) {
      const log = document.querySelector(".event-log-contents");
      log.textContent = log.textContent + `${event.type}: ${event.data}\n`;

      const clearLog = document.querySelector(".clear-log");
      clearLog.addEventListener("click", () => {
        log.textContent = "";
      });
    },
  },
};
</script>

<style scoped lang="less">
.ant-card {
  margin-bottom: 24px;
}
/* css实现打字特效 */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.typing-demo {
  /*  1ch = 1个英文 = 1个数字 2ch = 1个中文 ch 是一个相对单位 */
  width: 22ch;
  animation: typing 2s steps(22), blink 0.5s step-end infinite alternate;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid;
  /* font-family: monospace; */
  font-size: 14px;
}

@keyframes typing {
  from {
    width: 1px;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

/* CSS函数 attr()创建动态的纯 CSS 工具提示 */
.tooltip {
  position: relative;
  border-bottom: 1px dotted black;
}

.tooltip:before {
  content: attr(data-tooltip);
  position: absolute;
  width: 100px;
  background-color: #13c2c2;
  color: #fff;
  text-align: center;
  padding: 10px;
  line-height: 1.2;
  border-radius: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 1s;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  font-size: 0.75em;
  visibility: hidden;
}

.tooltip:after {
  content: "";
  position: absolute;
  bottom: 75%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  opacity: 0;
  transition: opacity 1s;
  border-color: #13c2c2 transparent transparent transparent;
  visibility: hidden;
}

.tooltip:hover:before,
.tooltip:hover:after {
  opacity: 1;
  visibility: visible;
}
</style>

<style lang="less">
// antd框架的Tooltip组件修改样式
// style标签不能加scoped局限在当前模块 得为全局的
.tooltipStyle .ant-tooltip-inner,
.tooltipStyle .ant-tooltip-arrow::before {
  background-color: #13c2c2;
}
</style>