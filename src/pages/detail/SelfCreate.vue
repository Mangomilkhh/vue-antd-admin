<template>
  <page-layout title="基础详情页">
    <a-card :bordered="false">
      <p>111</p>
      <v-node></v-node>
    </a-card>
  </page-layout>
</template>

<script>
import VNode from "./vnode";
export default {
  name: "SelfCreate",
  //这里VNode报错：The "VNode" component has been registered but not used.
  //原来是引入了js组件，但是没有在template使用
  components: { VNode },
};
</script>