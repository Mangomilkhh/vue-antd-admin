<template>
  <a-row style="margin: 0 -4px">
    <a-col style="padding: 0 4px" :xl="16" :lg="8" :md="24" :sm="24" :xs="24">
      <a-card :style="`height: ${pageMinHeight}px`" style="overflow:auto">
        <a-row>
          <a-col :span="16">
            <h2>文件对比工具</h2>
          </a-col>
        </a-row>
        <a-divider />

        <a-row :gutter="[16, 16]">

      <div>
        <!-- 第一部分：选择对比类型 -->
        <div class="section" id="section1">
          <div class="section-title">1. 上传文件<span>（上传CSV 或 XLSX 文件，目前只可对比文件的第一个sheet）</span></div>
          <!-- 双文件模式 -->
          <div class="form-row">
            <div class="form-col">
              <a-upload name="file"
                :file-list="uploadList1"
                :remove="handleRemove1"
                :custom-request="uploadImportFile1"
                accept=".csv,.xlsx"
              >
                <a-button class="danger" block style="margin-top: 10px;" :loading="uploadLoading">
                  请上传两个文件
                </a-button>
              </a-upload>
            </div>
            <!-- <div class="form-col">
              <a-upload name="file"
                :file-list="uploadList2"
                :remove="handleRemove2"
                :custom-request="uploadImportFile2"
                accept=".csv,.xlsx"
              >
                <a-button type="dashed" block style="margin-top: 10px;">
                  上传第二个文件
                </a-button>
              </a-upload>
            </div> -->
          </div>
        </div>

        <!-- 第二部分：维度统计  :scroll="{ x: 350 }"-->
        <div class="section" id="section2">
          <div class="section-title">2. 维度统计<span>（设置统计维度和计算方式）</span></div>
          <a-table
            :dataSource="dimensionRows"
            :columns="dimensionColumns"
            :pagination="false"
            bordered
            size="small"
            :rowKey="(record, index) => index"
            :scroll="{ x: 600 }"
          />
        </div>

        <!-- 第三部分：对比方式 -->
        <div class="section" id="section3">
          <h2 class="section-title">3. 对比方式</h2>
          <a-form :form="toolForm"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }">
            <a-form-item label="选择连接方式">
              <!-- 使用了 decorator 因此不用 v-model="joinType" -->
              <a-select v-decorator="[`joinType`, { rules: [{ required: true, message: '请选择连接方式' }] }]">
                <a-select-option value="left">左连接：只输出第一个文件的维度列</a-select-option>
                <a-select-option value="right">右连接：只输出第二个文件的维度列</a-select-option>
                <a-select-option value="full">全连接：输出第一和第二个文件的维度列</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>

          <compare-group-table />
        </div>

        <!-- 第四部分：输出设置 -->
        <div class="section" id="section4">
          <h2 class="section-title">4. 输出设置</h2>

          <!-- 字段内容筛选 -->
          <a-form layout="vertical">
            <a-form-item label="字段内容筛选">
              <div v-for="(filter, idx) in filters" :key="idx" class="filter-group">
                <a-row :gutter="8">
                  <a-col :span="6">
                    <a-select v-model="filter.field">
                      <a-select-option value="user_id(B列)">user_id(B列)</a-select-option>
                      <a-select-option value="other_field">其他字段示例</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="6">
                    <a-select v-model="filter.condition">
                      <a-select-option value="neq">不等于</a-select-option>
                      <a-select-option value="eq">等于</a-select-option>
                      <a-select-option value="gt">大于</a-select-option>
                      <a-select-option value="lt">小于</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="8">
                    <a-input v-model="filter.value" placeholder="字段满足多个筛选值其一选项即符合条件" />
                  </a-col>
                  <a-col :span="2">
                    <a-button type="danger" icon="delete" @click="removeFilter(idx)" />
                  </a-col>
                </a-row>
              </div>
              <a-space style="margin-top: 10px;">
                <!-- <a-button @click="addFilter">+ 添加</a-button>
                <a-button @click="clearFilters">清空</a-button> -->
              </a-space>
            </a-form-item>

            <!-- 输出列 -->
            <a-form-item label="输出列">
              <a-select mode="multiple" v-model="selectedColumns" style="width: 100%; height: 150px;">
                <a-select-option value="">请选择列名</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </div>

          <div class="btn-group">
            <!-- :loading="submitLoading" @click="handleReset()" -->
            <a-button type="primary">预览结果</a-button>
            <a-button class="danger" @click="handleExport()">导出结果</a-button>
            <a-button type="default">重置</a-button>
          </div>
        </div>
        </a-row>
      </a-card>
    </a-col>

    <a-col style="padding: 0 4px" :xl="8" :lg="16" :md="24" :sm="24" :xs="24">
      <a-card :style="`height: ${pageMinHeight}px`" style="overflow:auto">
        <a-row>
          <a-col :span="8">
            <a-row>
              <h1>我上传的文件数量</h1>
            </a-row>
            <a-row>
              <!--  @change="onChangeMytask" -->
              <a-checkbox default-checked>
                我的记录
                <a-tooltip>
                  <template slot="title">
                    仅展示最近50条记录，勾选后仅展示自己的记录，取消勾选展示所有人的记录
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </a-checkbox>
            </a-row>
          </a-col>
          <a-col :span="9">
            <div
              style="color: #ee4d2d; backgroundColor: #f0f2f5; width: 100px;height: 50px;padding-top: 6px; font-weight:500; font-size: 25px; text-align:center; border-radius: 8px;"
            >
              {{ myCount }}
            </div>
          </a-col>

          <a-col :span="6">
            <a-button
              type="primary"
              ghost
              @click="getHistoryTaskList()"
              :loading="refreshLoading"
              >获取最新任务状态</a-button
            >
          </a-col>
        </a-row>
        <a-divider />
        <a-row>
          <a-spin :spinning="refreshLoading">
            <a-list item-layout="horizontal" :data-source="historyTask">
              <a-list-item slot="renderItem" slot-scope="item">
                <div
                  slot="actions"
                  v-if="item.user_email != user"
                  style="cursor: default; color: rgba(0,0,0,.25)"
                >
                  <a-tooltip title="仅支持下载本人结果文件">
                    下载输出文件
                  </a-tooltip>
                </div>
                <a
                  slot="actions"
                  v-if="
                    (item.run_status == 'success') &
                      (item.download_path != '') &
                      (item.user_email == user)
                  "
                  :href="item.download_path"
                  >下载输出文件</a
                >

                <div
                  slot="actions"
                  v-if="
                    (item.run_status == 'success') &
                      (item.download_path == '') &
                      (item.user_email == user)
                  "
                  style="cursor: default; color: rgba(0,0,0,.25);margin-left: 28px"
                >
                  <a-tooltip title="当前文件没有内容，无法下载">
                    无效文件
                  </a-tooltip>
                </div>
                <div
                  slot="actions"
                  v-if="
                    (item.run_status != 'success') & (item.user_email == user)
                  "
                  style="cursor: default; color: rgba(0,0,0,.25)"
                >
                  <a-tooltip title="非success状态的任务，无法下载">
                    下载输出文件
                  </a-tooltip>
                </div>

                <a-list-item-meta :description="item.user_email">
                  <div slot="title">{{ item.task_name }}</div>
                  <a-avatar
                    slot="avatar"
                    style="backgroundColor:#fff;color:#52c41a"
                    icon="check-circle"
                    v-if="item.run_status == 'success'"
                  />
                  <a-avatar
                    slot="avatar"
                    style="backgroundColor:#fff;color:#b1b1b1"
                    icon="clock-circle"
                    v-if="item.run_status == 'waiting'"
                  />
                  <a-avatar
                    slot="avatar"
                    style="backgroundColor:#fff;color:#f5222d"
                    icon="close-circle"
                    v-if="item.run_status == 'fail'"
                  />
                  <a-avatar
                    slot="avatar"
                    style="backgroundColor:#fff;color:#1890ff"
                    icon="loading"
                    v-if="item.run_status == 'running'"
                  />
                </a-list-item-meta>
                <div>{{ item.upload_datetime }}</div>
              </a-list-item>
            </a-list>
          </a-spin>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  uploadCompareFile,
  submitDataCompare,
  getHistoryTaskCompare
} from "@/services/file_merge";
import moment from "moment";
// import FieldFilter from "./FieldFilter";
import { uploadMinioFile } from '@/utils/minio.js';
import CompareGroupTable from "./CompareGroupTable";

let tokenClient;
export default {
  name: "mergeTool",
  components: { CompareGroupTable },
  data() {
    return {
      uploadList1:[],
      uploadList2:[],
      file1Columns: ['user_id11', 'order_amount22'],
      file2Columns: ['product_name', 'price'],
      toolForm: this.$form.createForm(this, { name: 'toolForm' }),
      cardId: 0,
      sheetCols: [
        {
          id: "",
          name: [],
          options: { sheetLink: "", sheetLinkState: "", sheetLinkErrorMsg: "", sheetSelect: [] },
        },
      ],
      // isFlashing: true,
      submitLoading: false,
      myTaskStatus: "Y",
      historyTask: [],
      autoAuthorize: false,
      uploadLoading: false,
      myCount: "0",
      refreshLoading: false,
      fileName: "",
      lastChangeIndex: 0,
      sheetFieldList: [], //sheet字段列表
      filterColumns: [{
        cnname: '',
        conditions: [''],
        name: undefined,
        options: {},
        type: "text"
      }],
      fieldFetching: false,
      compareType: 'single',
      joinType: 'left',

      // 统计维度
      dimensionRows: [
        {
          id: 1,
          fileName: '111',
          dimensionCol: undefined,
          statCol: undefined,
          statMethod: [],
          newColNames: {
            sum: '',
            count: '',
            unique: ''
          }
        },
        {
          id: 2,
          fileName: '222',
          dimensionCol: undefined,
          statCol: undefined,
          statMethod: [],
          newColNames: {
            sum: '',
            count: '',
            unique: ''
          }
        }
      ],
      dimensionColumns: [
        {
          title: '文件名',
          dataIndex: 'fileName',
          width: 80,
          key: 'fileName',
          customRender: (_, record) => (
            <span>{!record.parentId && record.fileName}</span>
            // <a-select vModel={record.fileName} style="width: 100%;"
            // placeholder="请选择文件" >
            //   <a-select-option value="file1">{this.file1Name}</a-select-option>
            //   <a-select-option value="file2">{this.file2Name}</a-select-option>
            // </a-select>
          ),

          // customRender: (value, record, index) => {
          //   const obj = {
          //     children: record.fileName,
          //     attrs: {},
          //   };
          //   if (record.fileName === '111') {
          //     obj.attrs.rowSpan = 0;
          //   }
          //   return obj;
          // },
        },
        {
          title: '维度',
          dataIndex: 'dimensionCol',
          width: 150,
          key: 'dimensionCol',
          customRender: (v, record, index) => {
            // console.log('维度',v, record,index);
            const columns = record.id === 1
              ? this.file1Columns
              : this.file2Columns;

            return (!record.parentId &&
              <div>
                <a-select vModel={record.dimensionCol} style={{ width: '100%' }} placeholder='请选择维度'>
                  {columns.map(col => (
                    <a-select-option key={col} value={col}>{col}</a-select-option>
                  ))}
                </a-select>
              </div>
            );
          },
          // onCell: (record) => ({ colSpan: record.parentId ?  undefined: 0 })
        },
        {
          title: '统计列',
          dataIndex: 'statCol',
          width: 150,
          key: 'statCol',
          customRender: (_, record) => {
            // console.log('统计列',record);
            const columns = record.fileName === 'file1'
              ? this.file1Columns
              : this.file2Columns;

            return (
              <a-select vModel={record.statCol} style={{ width: '100%' }}
              placeholder='请选择统计列'>
                {columns.map(col => (
                  <a-select-option key={col} value={col}>{col}</a-select-option>
                ))}
              </a-select>
            );
          }
        },
        {
          title: '统计方式',
          dataIndex: 'statMethod',
          width: 80,
          key: 'statMethod',
          customRender: (_, record) => (
            <a-select vModel={record.statMethod} mode="multiple" style={{ width: '100%' }}
            placeholder="可多选">
              <a-select-option value="sum">汇总统计</a-select-option>
              <a-select-option value="count">计数</a-select-option>
              <a-select-option value="unique">去重计数</a-select-option>
            </a-select>
          )
        },
        {
          title: '新列名称',
          dataIndex: 'newColNames',
          width: 140,
          key: 'newColNames',
          customRender: (_, record) => (
            <div>
              {['sum', 'count', 'unique'].map(method => (
                <div v-show={record.statMethod.includes(method)} key={method}
                style={{ marginBottom: '10px' }}>
                  <span>
                    {method === 'sum' ? '汇总统计' : this.methodLabels[method] + ':'}
                    {method === 'sum' && <br />} {/* 在“汇总统计”后添加换行 */}
                    {method === 'sum' && '(保留'}
                    {method === 'sum' && (
                      <a-input-number
                        size="small" min={0} max={5} default-value={2} 
                        value={record.precision}
                        onChange={(value) => {
                          this.$set(record, 'precision', value);
                        }}
                        style={{ width: '65px', margin: '0 5px'}}
                      />
                    )}
                    {method === 'sum' && '位小数):'}
                  </span>
                  <a-input vModel={record.newColNames[method]} placeholder="请输入新列名称" />
                </div>
              ))}
            </div>
          )
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 35,
          customRender: (_, record, index) => (
            <div>
            <a disabled={this.dimensionRows.length === 1} onClick={() => this.removeDimensionRow(index)}>
              <a-icon type="delete" style={{ marginRight:'8px'}}  />
            </a>
            {!record.parentId &&(<a onClick={() => this.addSubRow(record)} style="margin-top: 8px" >
            <a-icon type="plus"/></a>)}
            </div>
          )
        }
      ],
      methodLabels: {
        sum: '汇总统计',
        count: '计数',
        unique: '去重计数'
      },

      // 字段筛选
      filters: [
        {
          field: 'user_id(B列)',
          condition: 'neq',
          value: ''
        }
      ],

      selectedColumns: []
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]),
  },
  mounted() {},
  methods: {
    removeDimensionRow(index) {
      if (this.dimensionRows.length > 1) {
        this.dimensionRows.splice(index, 1);
      } else {
        alert('至少保留一个统计列');
      }
    },
    addSubRow(parentRecord) {      
      const newRow = {
        id: Date.now(), // 简单生成唯一 ID
        parentId: Date.now(),
        // fileName: parentRecord.fileName,
        // dimensionCol: parentRecord.dimensionCol,
        statCol: undefined,
        statMethod: [],
        newColNames: {
          sum: '',
          count: '',
          unique: ''
        }
      };
      const index = this.dimensionRows.findIndex(row => row.id === parentRecord.id);
      this.dimensionRows.splice(index + 1, 0, newRow);
      console.log('000',newRow);

    },
    handleRemove1(file) {
      const index = this.uploadList1.indexOf(file);
      const newFileList = this.uploadList1.slice();
      newFileList.splice(index, 1);
      this.uploadList1 = newFileList;
      if(this.uploadList1.length == 2){
        this.uploadFile()
      }
    },
    uploadImportFile1(info) {
      const { file } = info;
      this.uploadList1 = [...this.uploadList1, file];
      if(this.uploadList1.length == 2){
        this.uploadFile()
      }
    },
    uploadFile(){
      this.uploadLoading = true;
      const uploadPromises = this.uploadList1.map((file, index) => {
        const ossFilePath = `/${moment().format('YYYY-MM')}/${this.uploadList1[index].name}`
        return uploadMinioFile('file-merge', ossFilePath, file, null, file.size);
      });
      Promise.all(uploadPromises).then((locations) => {
        const [location1, location2] = locations;
        let parmasString = {
          file1: {
              bucket_name: "file_merge",
              "local_file_path": location1
          },
          file2: {
              bucket_name: "file_merge",
              "local_file_path": location2
          }
        };
        this.getSheetForm.setFieldsValue({ local_file: parmasString });
        // parmasString = JSON.stringify(parmasString);
        uploadCompareFile(parmasString).then((res) => {
          if (res.data.status) {
            this.dimensionRows[0].fileName = res.data.data.file1.sheet_list.file_name;
            this.file1Columns = res.data.data.file1.sheet_list.column_list;
            this.dimensionRows[1].fileName = res.data.data.file2.sheet_list.file_name;
            this.file2Columns = res.data.data.file2.sheet_list.column_list;
          }
          this.uploadLoading = false;
        });
      })
    },
    handleExport(){
      let parmasString = {

      }
      submitDataCompare(parmasString).then((res) => { 
      });
    }
  }
};
</script>

<style scoped lang="less">
.closeIcon {
  position: absolute;
  right: 2px;
  top: -15px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
}
.closeIcon:hover {
  color: rgba(0, 0, 0, 0.75);
}
.ant-divider-horizontal {
  margin: 10px 0px;
}
/deep/.ant-card-small > .ant-card-body {
  padding: 0px;
}
/deep/.ant-list-sm .ant-list-item {
  padding-bottom: 2px;
  padding-top: 4px;
}
.sheet-remind {
  font-size: 12px;
  line-height: 12px;
  color: #747474;
  position: relative;
  left: 17%;
  top: -5px;
}
.upload-list{
  line-height: 22px;
  color: rgba(0, 0, 0, .65);
  margin: 7px 0 -5px;
  i.anticon{
    color: rgba(0, 0, 0, .45);
    margin-right: 7px
  }
  a{
    float: right;
    opacity: 0;
  }
}
.upload-list:hover{
  background-color: #fff5f0;
  a{
    opacity: 1;
  }
}

.header {
  background: #4a6cf7;
  color: white;
  padding: 20px;
  text-align: center;
}

.section {
  padding: 8px;
  overflow: auto;
}

.section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ee4d2de3;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #bdb9b842;
  span{
    font-size: 13px;
    font-weight: 400;
    color: #000000a6;
    display: inline-block;
  }
}

.file-info {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-col {
  flex: 1;
}

/deep/.ant-upload.ant-upload-select {
  width: 100%;
}
</style>
