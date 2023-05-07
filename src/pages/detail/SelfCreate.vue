<template>
  <page-layout title="自定义页面">
    <a-card :bordered="false">
      <p>111</p>
      <v-node></v-node>
    </a-card>
  </page-layout>
</template>

<script>
import VNode from "./vnode";
//使用page-layout自定义组件忘记引入
//报错：Unknown custom element: <page-layout> - did you register the component correctly?
//For recursive components, make sure to provide the "name" option.
//翻译：未知的自定义元素：＜页面布局＞-您是否正确注册了组件？对于递归组件，请确保提供“name”选项。
import PageLayout from '../../layouts/PageLayout'

export default {
  name: "SelfCreate",
  //这里VNode报错：The "VNode" component has been registered but not used.
  //原来是引入了VNode.js组件，但是没有在template使用
  components: { VNode,PageLayout },
};
</script>