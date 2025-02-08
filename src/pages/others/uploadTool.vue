<template>
    <a-row style="margin: 0 -4px">
      <a-col style="padding: 0 4px" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <a-card :style="`height: ${pageMinHeight}px`" style="overflow:auto">
          <a-row>
            <a-col :span="24">
              <h2>Cyclic Report 工具</h2>
              <div class="remind">工具异常请联系triangle.zhan@shopee.com</div>
            </a-col>
          </a-row>
  
          <a-divider />
          <a-form-model ref="form" :model="form" labelAlign="right" v-bind="formItemLayoutWithOutLabel" :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }">
            <a-form-model-item label="Billing 文件">
              <a-upload :file-list="billingList" :remove="handleBillingRemove" :before-upload="beforeBillingUpload"
                accept=".csv,.xlsx" :multiple="true" >
                <a-button block > <a-icon type="upload" /> 选择 Billing 文件 </a-button>
              </a-upload>
            </a-form-model-item>
  
            <a-form-model-item label="Payout 文件">
              <a-upload :file-list="payoutList" :remove="handlePayoutRemove" :before-upload="beforePayoutUpload"
                accept=".csv,.xlsx" :multiple="true">
                <a-button block> <a-icon type="upload" /> 选择 Payout 文件 </a-button>
              </a-upload>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 24 }">
              <a-button :loading="uploading" @click="formSubmit()" type="primary" block>提交文件至数据库</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </a-col>
      <a-col style="padding: 0 4px" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <a-card :style="`height: ${pageMinHeight}px`" style="overflow:auto">
          <div></div>
          <a-row>
            <a-col :span="6">
              <a-row>
                <h1>我上传的文件数量</h1>
              </a-row>
              <a-row>
                <a-checkbox @change="onChangeMytask" default-checked>
                  我的记录
                  <!-- <a-tooltip>
                    <template slot="title">
                      仅展示最近3天的查询记录以及结果，勾选后仅展示自己的记录，取消勾选展示所有人的记录
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip> -->
                </a-checkbox>
              </a-row>
  
            </a-col>
            <a-col :span="12">
              <div
                style="color: #ee4d2d; backgroundColor: #f0f2f5; width: 100px;height: 50px;padding-top: 6px; font-weight:500; font-size: 25px; text-align:center; border-radius: 8px;">
                {{ myCount }}</div>
            </a-col>
  
            <a-col :span="6">
              <a-button type="primary" ghost @click="getTaskList()" :loading="refreshLoading">获取最新任务状态</a-button>
            </a-col>
          </a-row>
          <a-divider />
          <a-row>
            <a-spin :spinning="refreshLoading">
              <a-list item-layout="horizontal" :data-source="taskData"
               style="height: calc(100vh - 300px); overflow-y: auto"
                @scroll="uploadListScroll">
                <a-list-item slot="renderItem" slot-scope="item">
                  <div slot="actions" v-if="item.email != user" style="cursor: default; color: rgba(0,0,0,.25)">
                    <a-tooltip title="仅支持下载本人结果文件">
                      下载输出文件
                    </a-tooltip>
                  </div>
                  <div slot="actions"
                    v-if="item.status == '处理完成' && item.output_file_oss_path && item.email == user"
                    style="color: #ee4d2d" @click="openLink(item.output_file_oss_path)">
                    <a-tooltip :title="item.upload_result_message">下载输出文件</a-tooltip>
                  </div>
                  <div slot="actions" v-if="item.status != '处理完成' && item.email == user"
                    style="cursor: default; color: rgba(0,0,0,.25)">
                    <a-tooltip title="任务处理中，请稍后下载">
                      下载输出文件
                    </a-tooltip>
                  </div>
  
                  <a-list-item-meta :description=item.email>
                    <div slot="title">{{ item.output_filename?item.output_filename:'未命名文件' }}</div>
                    <a-avatar slot="avatar" style="backgroundColor:#fff;color:#52c41a" icon="check-circle"
                      v-if="item.status == '处理完成'" />
                    <a-avatar slot="avatar" style="backgroundColor:#fff;color:#b1b1b1" icon="clock-circle"
                      v-if="item.status == '处理中'" />
                    <a-avatar slot="avatar" style="backgroundColor:#fff;color:#f5222d" icon="close-circle"
                      v-if="item.status == '处理失败'" />
                  </a-list-item-meta>
                  <div>{{ item.create_time }}</div>
                </a-list-item>
                <div v-if="loadingMore" slot="footer" style="text-align: center; margin: 10px 0;">
                  <a-spin />
                </div>
              </a-list>
            </a-spin>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </template>
  
  <script>
  import { mapState, mapGetters } from "vuex";
  import moment from "moment";
  import { runCyclicReport, getCyclicReportHistory} from "@/services/payment";
  
  export default {
    data() {
      return {
        taskData: [],
        myCount: '0',
        form: {
          file: "",
        },
        billingList: [],
        payoutList: [],
        uploading: false,
        refreshLoading: false,
        myTaskStatus: true,
        formItemLayoutWithOutLabel: {
          wrapperCol: {
            span: 18, offset: 6
          },
        },
        pageNum: 1,
        loadingMore: false,
        hasMore: true,
      };
    },
    created() {
      this.getTaskList()
    },
    computed: {
      ...mapState("setting", ["pageMinHeight"]),
      ...mapGetters('account', ['user']),
    },
    methods: {
      moment,
      handleBillingRemove(file) {
        const index = this.billingList.indexOf(file);
        const newFileList = this.billingList.slice();
        newFileList.splice(index, 1);
        this.billingList = newFileList;
      },
      beforeBillingUpload(file) {
        this.billingList = [...this.billingList, file];
        return false;
      },
      handlePayoutRemove(file) {
        const index = this.payoutList.indexOf(file);
        const newFileList = this.payoutList.slice();
        newFileList.splice(index, 1);
        this.payoutList = newFileList;
      },
      beforePayoutUpload(file) {
        this.payoutList = [...this.payoutList, file];
        return false;
      },
      formSubmit() {
        if (this.billingList.length > 0 && this.payoutList.length >0 ) {
          this.uploading = true;
          let formData = new FormData();
          this.billingList.forEach((file) => {
            formData.append("billing_files", file);
          });
          this.payoutList.forEach((file) => {
            formData.append("payout_files", file);
          });
  
          runCyclicReport(formData)
            .then((res) => {
              console.log('345',res.data.message);
              if (res.data.status) {
                this.$message.success(res.data.message, 8)
              } else {
                  this.$message.error(res.data.message, 5)
                  // this.$notification.error({
                  //   key: 'cyclicError',
                  //   message: '工具异常提醒',
                  //   description: res.data.info,
                  //   duration: 0,
                  // });
                }
              this.getTaskList()
              this.billingList = [];
              this.payoutList = [];
              this.uploading = false;
            })
          // .catch((err) => {
          //   this.$message.error(err.info || "oh，上传发生了错误！");
          //   this.billingList = [];
            // this.payoutList = [];
          //   this.uploading = false;
          // });
          } else {
          this.$message.error('每个类型的文件上传数量至少为1');
          return false
        }
      },
      getTaskList(reset = true) {
        if (reset) {
          this.pageNum = 1;
          this.hasMore = true;
        }
  
        this.refreshLoading = true
        const params = { 
          my_task: this.myTaskStatus,
          page_num: this.pageNum,
          page_size: 10,
         }
        getCyclicReportHistory(params).then((res) => {
          if (res.data.status) {
            if (reset) {
              this.taskData = res.data.data.data_list;
            }else{
              this.taskData = [...this.taskData, ...res.data.data.data_list];
            }
            this.myCount = res.data.data.total_count;
            this.hasMore = res.data.data.data_list.length === 10;
          } else {
            this.$message.error(res.data.message, 5)
          }
          this.refreshLoading = false;
          this.loadingMore = false;
        })
      },
      onChangeMytask(e) {
        this.myTaskStatus = e.target.checked;
        this.getTaskList()
      },
      openLink(link) {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = link;//直接下载，不会弹出新的页面
      },
      uploadListScroll({ target }) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        const bottomThreshold = 50;
  
        if (!this.loadingMore && this.hasMore && 
            scrollHeight - (scrollTop + clientHeight) < bottomThreshold) {
          this.loadingMore = true;
          this.pageNum += 1;
          this.getTaskList(false);
        }
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  .fold {
    width: calc(100% - 216px);
    display: inline-block;
  }
  
  .operator {
    margin-bottom: 18px;
  }
  
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
  
  .ant-tabs-ink-bar {
    width: 100% !important;
  }
  
  /deep/ .ant-tabs-nav {
    width: 100% !important;
  }
  
  /deep/ .ant-tabs-tab {
    width: 48% !important;
    text-align: center;
  }
  
  .remind{
    color: rgba(0, 0, 0, .35);
    margin-top: 15px;
    margin-bottom: -12px;
    // background: #fafafa;
    // padding: 10px;
    // border: 1px dashed #d9d9d9;
    border-radius: 4px;
  }
  
  /deep/ .ant-upload {
    width: 100% !important;
  }
  </style>
  