<template>
  <div>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form>
        <a-form-item
          :label="$t('title')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-input :placeholder="$t('titleInput')" />
        </a-form-item>
        <a-form-item
          :label="$t('date')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-range-picker style="width: 100%" />
        </a-form-item>
        <a-form-item
          :label="$t('describe')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-textarea rows="4" :placeholder="$t('describeInput')" />
        </a-form-item>
        <a-form-item
          :label="$t('metrics')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-textarea rows="4" :placeholder="$t('metricsInput')" />
        </a-form-item>
        <a-form-item
          :label="$t('customer')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
          :required="false"
        >
          <a-input :placeholder="$t('customerInput')" />
        </a-form-item>
        <a-form-item
          :label="$t('critics')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
          :required="false"
        >
          <a-input :placeholder="$t('criticsInput')" />
        </a-form-item>
        <a-form-item
          :label="$t('weight')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
          :required="false"
        >
          <a-input-number :min="0" :max="100" />
          <span>%</span>
        </a-form-item>
        <a-form-item
          :label="$t('disclosure')"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
          :required="false"
          :help="$t('disclosureDesc')"
        >
          <a-radio-group v-model="value">
            <a-radio :value="1">{{ $t("public") }}</a-radio>
            <a-radio :value="2">{{ $t("partially") }}</a-radio>
            <a-radio :value="3">{{ $t("private") }}</a-radio>
          </a-radio-group>
          <a-select mode="multiple" v-if="value === 2">
            <a-select-option value="4">{{ $t("colleague1") }}</a-select-option>
            <a-select-option value="5">{{ $t("colleague2") }}</a-select-option>
            <a-select-option value="6">{{ $t("colleague3") }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          style="margin-top: 24px"
          :wrapperCol="{ span: 10, offset: 7 }"
        >
          <a-button type="primary">{{ $t("submit") }}</a-button>
          <a-button style="margin-left: 8px">{{ $t("save") }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :body-style="{ padding: '24px 32px',margin: '20px' }" :bordered="false">
      <a-form-model
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        v-bind="formItemLayoutWithOutLabel"
      >
        <a-form-model-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          v-bind="index === 0 ? formItemLayout : {}"
          :label="index === 0 ? 'Domains' : ''"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true,
            message: 'domain can not be null',
            trigger: 'blur',
          }"
        >
          <a-input
            v-model="domain.value"
            placeholder="please input domain"
            style="width: 60%; margin-right: 8px"
          />
          <a-icon
            v-if="dynamicValidateForm.domains.length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="dynamicValidateForm.domains.length === 1"
            @click="removeDomain(domain)"
          />
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 60%" @click="addDomain">
            <a-icon type="plus" /> Add field
          </a-button>
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayoutWithOutLabel">
          <a-button
            type="primary"
            html-type="submit"
            @click="submitForm('dynamicValidateForm')"
          >
            Submit
          </a-button>
          <a-button
            style="margin-left: 10px"
            @click="resetForm('dynamicValidateForm')"
          >
            Reset
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
var parser = require('cron-parser');

try {
  // 周一12 17 22点跑
  var interval = parser.parseExpression('0 12,17,19,22 * * 1');

  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
} catch (err) {
  console.log('Error: ' + err.message);
}


export default {
  name: "BasicForm",
  i18n: require("./i18n"),
  data() {
    return {
      value: 1,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      dynamicValidateForm: {
        domains: [],
      },
    };
  },
  computed: {
    desc() {
      return this.$t("pageDesc");
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submit!",this.$refs[formName],valid);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now(),
      });
    },
  },
};
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
