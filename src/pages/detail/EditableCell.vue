<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        id="input"
        v-if="col.type == 'input'"
        :value="value"
        @change="handleChange"
        :style="changeStyle ? 'color: #ee4d2d' : 'color: #000000a6'"
      />

      <!-- 多选 -->
      <!--  :default-value="value" -->
      <a-select
        style="width: 100%"
        mode="tags"
        v-if="col.type == 'multiple_select'"
        :value="value"
        @change="selectChange"
        :style="changeStyle ? 'color: #ee4d2d' : 'color: #000000a6'"
      >
        <a-select-option v-for="item in col.options.select" :key="item">
          {{ item }}
        </a-select-option>
      </a-select>

      <!-- 单选 -->
      <a-select
        style="width: 100%"
        v-if="col.type == 'select'"
        :value="value"
        @focus="focusChange"
        @change="selectChange"
      >
        <a-select-option v-for="item in col.options.select" :key="item">
          {{ item }}
        </a-select-option>
      </a-select>

      <!-- 编辑器 -->
      <div class="codeEditBox">
        <!-- @input="codeChange" -->
        <code-editor
          v-if="col.type == 'code_editors'"
          ref="editor"
          @init="editorInit"
          v-model="value"
          lang="sql"
          :options="editorOptions"
          theme="textmate"
        ></code-editor>
      </div>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value }}
    </div>
  </div>
</template>

<script>
import CodeEditor from "vue2-ace-editor";

export default {
  name: "EditableCell",
  props: {
    //避免直接更改prop，因为每当父组件重新渲染时，该值都会被覆盖。
    //因此需要把prop的值赋给新的值

    // col为列 表头对象
    col: Object,
    editable: Boolean,

    // record为这一行的数据   text为这个空的值
    slotInfo: Object,
  },
  components: { CodeEditor },
  data() {
    return {
      value: this.slotInfo.text,
      changeStyle: false,
      InitialValue: "",
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
        maxLines: 5, // 最大行数，超过会自动出现滚动条
        readOnly: false,
        minLines: 5, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      },
    };
  },
  methods: {
    handleChange(e) {
      this.value = e.target.value;

      if (!this.changeStyle) {
        this.InitialValue = this.slotInfo.text;
      }
      if (this.InitialValue !== e.target.value) {
        this.changeStyle = true;
      } else {
        this.changeStyle = false;
      }

      this.$emit("change", e.target.value);
    },
    selectChange(value) {
      this.value = value;
      // 选项改变时把改变的项传入
      this.$emit("change", this.value);
    },
    focusChange() {
      // 聚焦时把当前值传入
      this.$emit("change", this.value);
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
      require("brace/mode/mysql");
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