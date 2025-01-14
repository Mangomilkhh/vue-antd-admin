<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <!-- multiple="true" -->
      <a-form-item
        label="TreeSelect 树型选择控件"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-tree-select
          v-model="treeVal"
          style="width: 100%"
          :tree-data="treeData"
          :tree-checkable="isCheckable"
          allow-clear
          tree-default-expand-all
          :show-checked-strategy="SHOW_ALL"
          search-placeholder="Please select"
          @change="onTreeSelectChange"
        />
      </a-form-item>

      <!-- 动态传递value值的select -->
      <a-form-item
        :label="$t('payment')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-select label-in-value @change="(item)=>selectValList(item)">
          <!-- <a-select-option value="1">ant-design@alipay.com</a-select-option> -->
          <a-select-option v-for="item in convertList(selectList)" :key="item.key">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item
        :label="$t('collection')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input-group :compact="true" style="display: inline-block; vertical-align: middle">
          <a-select defaultValue="alipay" style="width: 100px">
            <a-select-option value="alipay">{{$t('alipay')}}</a-select-option>
            <a-select-option value="wexinpay">{{$t('wechat')}}</a-select-option>
          </a-select>
          <a-input :style="{width: 'calc(100% - 100px)'}" value="test@example.com"/>
        </a-input-group>
      </a-form-item>
      <a-form-item
        :label="$t('collectionName')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input value="Alex" />
      </a-form-item>
      <a-form-item
        :label="$t('transferAmount')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input prefix="￥" value="5000" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button type="primary" @click="nextStep">{{$t('nextStep')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue';
const SHOW_ALL = TreeSelect.SHOW_ALL;

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  }]

export default {
  name: 'Step1',
  i18n: require('./i18n'),
  data() {
    return{
      selectList:['module', 'topic', 'non_topic'],
      selectVal:'',
      treeVal: [],
      treeData,
      SHOW_ALL,
      isCheckable:true,
    }
  },
  methods: {
    nextStep () {
      this.$emit('nextStep')
    },
    selectValList(val) {
      this.selectVal = val.key;
      console.log('123',val,this.selectVal);
    },
    convertList(val){
      const list = val.map(item => ({
          key: item,
          label: item.charAt(0).toUpperCase() + item.slice(1).replace('_t', ' T')
      }));
      // console.log('000',list);
      
      return list;
    },
    onTreeSelectChange(value, label, extra){
      console.log('onTreeSelectChange',value, label, extra,this.treeData);

      if(label.includes('Node2')){
        this.treeData[0].checkable = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
