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
      <a-select
      style="width: 100%;"
        v-if="col.type == 'select'"
        :default-value="value"
        @change="selectChange(col)"
        :style="changeStyle ? 'color: #ee4d2d' : 'color: #000000a6'"
      >
        <a-select-option value="jack"> Jack </a-select-option>
        <a-select-option value="lucy"> Lucy </a-select-option>
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
    col:Object,
    editable: Boolean,

    // record为这一行的数据   text为这个空的值
    slotInfo:Object,
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


      // console.log('444',col,e);
      this.$emit("change", e.target.value);
    },
    selectChange(col){
      // col为哪一列的表头数据   
      console.log('333',col,this.slotInfo);
      // if(col.option.change_event_api){

      // }
    }
  },
};
</script>