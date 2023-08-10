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
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value }}
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      value: this.slotInfo.text,
      changeStyle: false,
      InitialValue: "",
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
    focusChange(){
      // 聚焦时把当前值传入
      this.$emit("change", this.value);
    }
  },
};
</script>