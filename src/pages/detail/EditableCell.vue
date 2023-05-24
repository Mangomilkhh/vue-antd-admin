<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        id="input"
        :value="value"
        @change="handleChange"
        :style="changeStyle ? 'color: #ee4d2d' : 'color: #000000a6'"
      />
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
    text: String,
    editable: Boolean,
  },
  data() {
    return {
      value: this.text,
      changeStyle: false,
      InitialValue: "",
    };
  },
  methods: {
    handleChange(e) {
      this.value = e.target.value;

      if (!this.changeStyle) {
        this.InitialValue = this.text;
      }
      if (this.InitialValue !== e.target.value) {
        this.changeStyle = true;
      } else {
        this.changeStyle = false;
      }

      this.$emit("change", e.target.value);
    },
  },
};
</script>