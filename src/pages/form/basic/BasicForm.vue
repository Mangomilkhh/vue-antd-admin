<template>
  <div>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form>
        <a-form-item
          label="文件上传"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <!-- <a-button type="primary" ghost @click="add"><a-icon type="upload" />文件上传到oss</a-button> -->
          <input ref="input" type="file" id="uploader" @change="handleFiles">
        </a-form-item>
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
  // crontab执行时间计算：https://www.iamwawa.cn/crontab.html
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
    handleFiles(event) {
      //参考： https://blog.csdn.net/qq_45634989/article/details/126855507
      var f = event.target.files[0]
      let reader = new FileReader();
      reader.readAsArrayBuffer(f);
      reader.onload = function (e) {
        let res = e.target.result;//ArrayBuffer
        let buf = Buffer.from(res);//Buffer

        //初始化minio客户端
        var Minio = require('minio')
        var minioClient = new Minio.Client({
          endPoint: 'compass-static.shopee.io',    //存放桶的服务器的URL
          port: 9000,      //TCP/IP 端口号，此输入是可选的，HTTP默认为80 ，HTTPs的默认值设置为443
          useSSL: false,     //将此值设置为“true”为HTTPS访问，false为普通http访问
          accessKey: 'lydia.li@shopee.com',     //用户 ID
          secretKey: '2B6Io0B0WcXyN4styjSiu1SU8PmTLVsp'     //用户密码
        });

        //使用客户端对象将文件上传到指定的bucket
        //putObject参数 按次序来
        //1、存储桶的名称
        //2、对象的名称（文件存到bucket中的名称）
        //3、流对象（可读的stream流、Buffer、string字符串）
        //4、将写入对象数据的本地文件系统上的路径（可为null）
        //5、文件大小（可为null）
        //6、发生错误时调用回调err
        console.log('999',f,buf);
        
        minioClient.putObject('file-merge', f.name, buf, null, f.size, function (err, data) {
          if (err)
            console.log(err,data)
          else
            console.log("Successfully uploaded data to testbucket/testobject");
        });
      }
    }
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
