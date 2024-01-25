<template>
  <page-layout title="123">
    <three-item></three-item>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import ThreeItem from "./ThreeItem.vue";

export default {
  name: "Three",
  components: {
    PageLayout,
    ThreeItem,
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>