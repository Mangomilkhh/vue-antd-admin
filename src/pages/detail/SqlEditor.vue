<template>
  <div>
    <textarea ref="mycode" class="codesql" v-model="value"> </textarea>
  </div>
</template>
<script>
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
// yarn serve codemirror-case-fold --save命令来安装codemirror-case-fold插件，它是一个用于修改关键字大小写的插件
// import "codemirror/addon/fold/case-fold.js"; //导入修改关键字大小写的插件

let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");
export default {
  data() {
    return {
      editor: null,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    readOnly: {
      type: [Boolean, String],
    },
  },
  watch: {
    // 监听newVal值的变化，通过getValue方法获取到值并传递给父组件
    newVal() {
      if (this.editor) {
        this.$emit("changeTextarea", this.editor.getValue());
      }
    },
  },
  computed: {
    // 将编辑器中的值赋给newVal变量
    newVal() {
      if (this.editor) {
        return this.editor.getValue();
      } else {
        return "";
      }
    },
  },

  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      value: this.value,
      height: "350px", //设置初始化高度
      mode: "text/x-sql", //选择对应代码编辑器的语言
      caseFold: true, //设置关键字大小写为小写
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      cursorHeight: 1,
      lineWrapping: true,
      readOnly: this.readOnly, //'nocursor'
      // theme: 'ambiance',//设置主题，不设置的会使用默认主题
      autofocus: true,
      extraKeys: { Ctrl: "autocomplete" }, //自定义快捷键
      hintOptions: {
        //自定义提示选项
        // 当匹配只有一项的时候是否自动补全
        completeSingle: false,
        // tables: {
        //     users: ['name', 'score', 'birthDate'],
        //     countries: ['name', 'population', 'size']
        // }
      },
    });
    //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
    this.editor.on("inputRead", () => {
      this.editor.showHint();
    });
  },
  methods: {
    setVal() {
      if (this.editor) {
        if (this.value === "") {
          this.editor.setValue("");
        } else {
          this.editor.setValue(this.value);
        }
      }
    },
  },
};
</script>
<style lang="less">
.CodeMirror {
  color: black;
  direction: ltr;
  line-height: 22px;
}
// 这句为了解决匹配框显示有问题而加
.CodeMirror-hints {
  z-index: 9999 !important;
}
</style>
