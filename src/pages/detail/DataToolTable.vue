<template>
  <div ref="table" :index="index" class="advanced-table">
    <div class="header-bar">
      <div class="title">
        <div style="width: 380px; display: inline-block; margin-right: 10px">
          <a-input-search @search="onSearchWiki" placeholder="输入搜索内容">
            <a-button type="primary" slot="enterButton" :disabled="editable">
              <a-icon type="search" />
            </a-button>
          </a-input-search>
        </div>
        <div class="header-button" style="display: inline-block">
          <filter-wiki-columns
            :columns="filterColumns"
            @change="onSearchChange"
            :iconType="'button'"
            :disabled="editable"
          >
          </filter-wiki-columns>
          <set-wiki-columns
            :columns="setUpColumn"
            @reset="onColumnsReset"
            @order="onColumnsOrder"
            :disabled="editable"
          >
          </set-wiki-columns>
          <a-button
            class="danger"
            @click="addReport()"
            :disabled="editable"
            v-if="isBI"
          >
            新增工具
          </a-button>
          <a-button
            class="danger"
            @click="totalImport()"
            :disabled="editable"
            v-if="isBI"
          >
            批量导入
          </a-button>
          <a-button class="danger" @click="downloadData()" :disabled="editable">
            批量导出
          </a-button>
        </div>
      </div>
      <div class="actions" v-if="isBI">
        <a-button class="danger" v-if="!editable" @click="totalEdit">
          批量编辑
        </a-button>
        <div v-else class="header-button">
          <a-button @click="saveTotalEdit" class="danger" :loading="saving">
            保存草稿
          </a-button>
          <a-button
            type="primary"
            @click="submitTotalEdit"
            :loading="submiting"
          >
            提交
          </a-button>
          <a-button @click="cancelTotalEdit"> 取消 </a-button>
        </div>
      </div>
    </div>

    <!-- 查看时的表格 -->
    <a-table
      v-show="!editable"
      :scroll="{
        x: `${currentWidth}px`,
        y: `calc(${pageMinHeight}px - 215px)`,
      }"
      v-bind="{
        rowKey: rowKey,
        dataSource: dataSource,
        columns: currentColumns,
        pagination: pagination,
      }"
      :size="sSize"
    >
      <span v-show="dataSource.length!== 0"
        v-for="(col, i) in currentColumns"
        :slot="col.dataIndex"
        slot-scope="text"
        :key="i"
        :title="text"
      >
        <div>
          <span v-if="col.options.link">
            <!-- link有单个或多个 -->
            <a v-if="text.indexOf('\n') == -1" :href="text" target="_blank">
              {{ text }}
            </a>
            <div v-else v-for="item in text.split(';\n')" :key="item">
              <a :href="item" target="_blank">{{ item }}</a>
            </div>
          </span>
          <span v-else>{{ text }}</span>
        </div>
      </span>

      <!-- 固定的操作列表 -->
      <span slot="action" slot-scope="text, record">
        <span v-for="(item, index) in actionColumn" :key="index">
          <a
            v-if="item.action == '查看'"
            @click="showReport(record, item)"
            style="margin-right: 10px"
            >{{ item.action }}</a
          >
          <a
            v-if="item.action == '编辑'"
            @click="editReport(record, item)"
            style="margin-right: 10px"
            :class="record.disable_edit ? 'disabled-use' : ''"
            >{{ item.action }}</a
          >
          <span v-if="item.action == '删除'">
            <a
              @click="deleteReport(record, item)"
              v-if="record.disable_delete !== undefined"
              :class="record.disable_delete ? 'disabled-use' : ''"
              >{{ item.action }}</a
            >
            <span v-else class="disabled-use">{{ item.action }}</span>
          </span>
        </span>
      </span>
    </a-table>

    <!-- 批量编辑时的表格 -->
    <a-table
      v-if="editable"
      :scroll="{
        x: `${editTableWidth}px`,
        y: `calc(${pageMinHeight}px - 215px)`,
      }"
      v-bind="{
        rowKey: rowKey,
        dataSource: editDataSource,
        columns: editDataTableHeaders,
        pagination: false,
      }"
      :size="sSize"
      :customRow="handleClickRow"
    >
      <span
        v-for="(col, i) in editDataTableHeaders"
        :slot="col.dataIndex"
        slot-scope="text, record, index"
        :key="i"
        :title="col.options.disabled || record.disable_edit ? text : ''"
      >
        <!-- record行 col列 值 -->
        <div>
          <!-- 从20个表头的数组中取第i个，在里面根据dataIndex找到对应的当前编辑组件 -->
          <div
            v-if="col.type == 'text'"
            class="edit-box"
            :title="totalData[index][col.dataIndex]"
          >
            <!--  style="justify-content: center" -->
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >
            <div v-if="col.options.link">
              <a :href="totalData[index][col.dataIndex]" target="_blank"
                >{{ totalData[index][col.dataIndex] }}
              </a>
            </div>

            <div
              v-else
              :class="
                col.options.disabled || record.disable_edit
                  ? 'disabled-text'
                  : ''
              "
            >
              {{ totalData[index][col.dataIndex] }}
            </div>
          </div>

          <div v-if="col.type == 'input'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>
            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <a-input
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                :placeholder="col.options.placeholder"
                @blur="(e) => handleInputBlur(e.target.value, col, index)"
              />
            </div>
          </div>

          <div v-if="col.type == 'textarea'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >
            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>
            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <a-textarea
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                :placeholder="col.options.placeholder"
                :rows="col.options.rows || 1"
                @blur="(e) => handleInputBlur(e.target.value, col, index)"
              />
            </div>
          </div>

          <!-- select -->
          <div v-if="col.type == 'select'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>
            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                :placeholder="col.options.placeholder"
                showSearch
                optionFilterProp="children"
                @change="(value) => onSelectChange(value, col, index)"
                @search="(value) => fetchSearch(value, col, index)"
                :filter-option="(input, option) => filterOption(input, option)"
                @focus="(value) => onSelectDropdown(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- input_select 可输入单选下拉框  -->
          <div v-if="col.type == 'input_select'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                showSearch
                showArrow
                optionFilterProp="children"
                :placeholder="col.options.placeholder"
                @change="(value) => onSelectChange(value, col, index)"
                :filter-option="false"
                @focus="(value) => onSelectDropdown(value, col, index)"
                @search="(value) => inputSelectChange(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- input_multiple_select 可输入多选下拉框 -->
          <div v-if="col.type == 'input_multiple_select'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ disabledValue(totalData[index][col.dataIndex]) }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                disabledValue(totalData[index][col.dataIndex])
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                mode="tags"
                :allowClear="true"
                showArrow
                :placeholder="col.options.placeholder"
                id="tagSelect"
                @change="(value) => onSelectChange(value, col, index)"
                @focus="(value) => onSelectDropdown(value, col, index)"
                @search="(value) => fetchSearch(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- multiple_select -->
          <div v-if="col.type == 'multiple_select'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >
            
            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ disabledValue(totalData[index][col.dataIndex]) }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                disabledValue(totalData[index][col.dataIndex])
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                mode="multiple"
                showArrow
                :allowClear="true"
                :placeholder="col.options.placeholder"
                @change="(value) => onSelectChange(value, col, index)"
                @focus="(value) => onSelectDropdown(value, col, index)"
                @search="(value) => fetchSearch(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- search_input 搜索文本输入框 -->
          <div v-if="col.type == 'search_input'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                :placeholder="col.options.placeholder"
                :allowClear="true"
                :filter-option="false"
                :defaultActiveFirstOption="false"
                :not-found-content="fetching ? undefined : null"
                @search="(value) => fetchSearch(value, col, index)"
                @change="(value) => onSelectChange(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- user_search -->
          <div v-if="col.type == 'user_search'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                showSearch
                ref="searchUser"
                :placeholder="col.options.placeholder"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                @search="(value) => fetchUser(value, col, index)"
                @change="(value) => handleUserSearch(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item.text"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- users_search -->
          <div v-if="col.type == 'users_search'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ disabledValue(totalData[index][col.dataIndex]) }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                disabledValue(totalData[index][col.dataIndex])
              }}</span>
              <a-select
                class="select"
                v-show="record.change_status"
                :value="formatValue(index, col)"
                mode="multiple"
                :allowClear="true"
                ref="searchUser"
                :placeholder="col.options.placeholder"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                @search="(value) => fetchUser(value, col, index)"
                @change="(value) => handleUserSearch(value, col, index)"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="item in totalHeaders[index].find(
                    (obj) => obj.dataIndex === col.dataIndex
                  ).options.select"
                  :key="item.text"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- date -->
          <div v-if="col.type == 'date'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                formatValue(index, col)
              }}</span>
              <a-date-picker
                class="select"
                v-show="record.change_status"
                format="YYYY-MM-DD"
                :value="formatValue(index, col)"
                @change="(value) => onCalendarChange(value, col, index)"
                @openChange="(open) => onCalendarOpenChange(open, col, index)"
                @search="(value) => fetchSearch(value, col, index)"
              />
            </div>
          </div>

          <!-- code_editor-->
          <div v-if="col.type == 'code_editor'" class="edit-box">
            <span
              class="symbol"
              v-if="
                totalHeaders[index].find(
                  (obj) => obj.dataIndex === col.dataIndex
                ).options.required
              "
              >*</span
            >

            <div
              v-if="col.options.disabled || record.disable_edit"
              class="disabled-text"
            >
              {{ totalData[index][col.dataIndex] }}
            </div>

            <div v-else class="select">
              <span v-show="!record.change_status">{{
                totalData[index][col.dataIndex]
              }}</span>
              <div class="code_box" v-show="record.change_status">
                <div class="formater_button">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>Duplicate</span>
                    </template>
                    <a
                      ><a-icon
                        type="copy"
                        class="actions"
                        id="copy-icon"
                        @click="copyEditor()"
                        data-clipboard-action="copy"
                        :data-clipboard-text="formatValue(index, col)"
                    /></a>
                  </a-tooltip>
                </div>

                <!-- <div style="height: max-content;"> -->
                <code-editor
                  @init="editorInit"
                  @input="(val) => codeChange(val, col, index)"
                  :value="formatValue(index, col)"
                  :lang="mode"
                  :options="{
                    ...editorOptions,
                  }"
                  theme="textmate"
                >
                </code-editor>
                <!-- </div> -->
              </div>
            </div>
          </div>
        </div>
      </span>

      <span slot="action" slot-scope="text, record">
        <span v-for="(item, index) in editActionColumn" :key="index">
          <a
            v-if="item.action == '查看'"
            @click="showReport(record, item)"
            style="margin-right: 10px"
            >{{ item.action }}</a
          >
          <a
            v-if="item.action == '编辑'"
            @click="editReport(record, item)"
            style="margin-right: 10px"
            :class="record.disable_edit ? 'disabled-use' : ''"
            >{{ item.action }}</a
          >
          <span v-if="item.action == '删除'">
            <a
              @click="deleteReport(record, item)"
              v-if="record.disable_delete !== undefined"
              :class="record.disable_delete ? 'disabled-use' : ''"
              >{{ item.action }}</a
            >
            <span v-else class="disabled-use">{{ item.action }}</span>
          </span>
        </span>
      </span>
    </a-table>

    <a-modal
      title="新增工具"
      @cancel="closeModal"
      :visible="addReportModal"
      :maskClosable="false"
      width="50%"
    >
      <wiki-edit-form
        :key="reloadKey"
        @change="onFromChange"
        :columns="wikiRowInfo"
        :appType="appType"
      >
      </wiki-edit-form>
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          :loading="submitLoading"
          @click="handleOk"
        >
          提交
        </a-button>
        <a-button key="back" @click="closeModal"> 取消 </a-button>
      </template>
    </a-modal>

    <a-modal
      title="批量导入"
      @cancel="closeTotalImport"
      :visible="totalImportModal"
      :maskClosable="false"
      width="50%"
      class="all-import"
    >
      <a-upload
        name="file"
        :multiple="true"
        action="上传的地址"
        :file-list="shopIdList"
        :remove="handleRemoveShopId"
        :before-upload="beforeUploadShopId"
        :custom-request="uploadImportFile"
      >
        <a-button type="primary" :loading="dataUploading" style="width: 100%">
          <a-icon type="upload" />导入数据</a-button
        >
      </a-upload>
      <br />

      <template slot="footer">
        <a-button class="danger" @click="downloadTemplate()">下载模版</a-button>
        <a-button key="back" @click="closeTotalImport"> 返回 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import WikiEditForm from "@/components/form/WikiEditForm";
import {
  getAddColumn,
  addTableInfo,
  addTableBatch,
  downloadTemplate,
  updateTableInfoBatch,
  downloadData,
  saveDraftBatch,
} from "@/services/biwiki";
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
import { request, METHOD } from "@/utils/request";
import FilterWikiColumns from "@/components/table/advance/FilterWikiColumns";
import { sleep } from "@/utils/util";
import CodeEditor from "vue2-ace-editor";
import sqlFormatter from "sql-formatter";
import Clipboard from "clipboard";
import SetWikiColumns from "@/components/table/advance/SetWikiColumns";

export default {
  name: "DataToolTable",
  components: { WikiEditForm, FilterWikiColumns, CodeEditor, SetWikiColumns },
  props: {
    dataStatus: String,
    dataSource: Array,
    rowKey: [String, Function],
    dataTableHeaders: Array,
    pagination: [Object, Boolean],
    actionColumn: Array,
    filterColumns: Array,
    tableWidth: Number,
    keyword: String,

    editDataSource: Array,
    editDataTableHeaders: Array,
    editActionColumn: Array,
    editTableWidth: Number,
  },
  data() {
    return {
      index: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      sSize: this.size || "default",
      editable: false,
      addReportModal: false,
      totalImportModal: false,
      reportForm: {
        name: "",
        region: undefined,
      },
      submitLoading: false,
      wikiRowInfo: [],
      shopIdList: [],
      dataUploading: false,
      downloading: false,
      totalHeaders: [],
      fetching: false,
      submiting: false,
      saving: false,
      reloadKey: +new Date(),
      refreshPage: false,
      mode: "sqlserver",
      modes: ["sqlserver", "python", "json", "yaml"],
      editorOptions: {
        // 设置代码编辑器的样式
        enableLiveAutocompletion: true, // 启用实时自动完成
        enableBasicAutocompletion: true, // 启用基本自动完成
        behavioursEnabled: true,
        autoScrollEditorIntoView: true,
        enableSnippets: true, // 启用代码段
        tabSize: 4, // 标签大小
        fontSize: 12, // 设置字号
        showPrintMargin: false, // 去除编辑器里的竖线
        showLineNumbers: true, // 显示行号
        wrap: true,
        scrollPastEnd: true, // 滚动位置
        highlightActiveLine: true, // 高亮当前行
        highlightSelectedWord: false, //高亮选中文本
        maxLines: 8, // 最大行数，超过会自动出现滚动条
        minLines: 1, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      },
      isBI: JSON.parse(window.localStorage.getItem("userinfo")).is_bi,
      edit_index: -1,
      edit_record: {},
      localColumns:
        JSON.parse(window.localStorage.getItem("wiki_datatool_settings")) || [],
      setUpColumns:
        JSON.parse(window.localStorage.getItem("wiki_datatool_settings")) || [],
       appType: "Tool"
      };
  },
  watch: {
    //关闭compass或者关闭这个tab页也要提醒
    $route: {
      handler(val) {
        if (this.refreshPage) {
          this.$emit("search");
        }

        // 还在编辑且当前页不为工具系统时
        if (this.editable == true && val.path !== "/data-tool") {
          this.$confirm({
            title: "您批量编辑的内容还未保存，离开将不保存，确定离开吗？",
            onOk: () => {
              this.cancelTotalEdit();
              this.refreshPage = true;
            },
            onCancel: () => {
              this.$router.push("/data-tool");
            },
          });
        }
        this.refreshPage = false;
      },
      // 深度观察监听
      deep: true,
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    currentColumns() {
      return this.getColumns(
        this.localColumns.length == 0
          ? this.dataTableHeaders
          : this.localColumns
      );
    },
    setUpColumn() {
      return this.setUpColumns.length == 0
        ? this.dataTableHeaders
        : this.setUpColumns;
    },
    currentWidth() {
      let width = 0;
      this.localColumns
        .filter((col) => col.visible)
        .map((item) => (width += item.width));
      return this.localColumns.length == 0 ? this.tableWidth : width;
    },
  },
  methods: {
    getColumns(val) {
      let newArr = JSON.parse(JSON.stringify(this.dataTableHeaders));
      let localArr = this.localColumns;

      // 对比存储的表头数据
      if (localArr.length !== 0 && newArr.length !== 0) {
        // dataIndex为唯一标识
        // local有的  新数组无的 storageList为local即将删除的对象
        const storageList = localArr.filter((obj1) => {
          return !newArr.some((obj2) => obj1.dataIndex === obj2.dataIndex);
        });

        // 新数组有的 local无的 newList为新增的对象
        const newList = newArr.filter((obj2) => {
          return !localArr.some((obj1) => obj1.dataIndex === obj2.dataIndex);
        });

        // 在local新增列
        for (let i = 0; i < newList.length; i++) {
          if (newList[i].title == "操作") continue;
          // 找到新增对象在新数组newArr中的index
          let originIndex = newArr.findIndex((item) => item == newList[i]);
          // 找到新增对象在新数组newArr前一个的index的属性dataIndex
          let originName = newArr[originIndex - 1].dataIndex;
          // 找到local数组对应index属性的游标+1
          let insertIndex =
            localArr.findIndex(
              (item) =>
                item == localArr.find((item) => item.dataIndex == originName)
            ) + 1;
          localArr.splice(insertIndex, 0, newList[i]);
        }

        // 在local删除多余列
        for (let i = 0; i < storageList.length; i++) {
          const index = localArr.findIndex(
            (obj) => obj.dataIndex === storageList[i].dataIndex
          );
          localArr.splice(index, 1);
        }

        // 给local数组的对象换上新的对象
        localArr = localArr.map((item) => {
          const replacement = newArr.find(
            (i) => i.dataIndex === item.dataIndex
          );
          // 保留控制显示隐藏的字段
          replacement.visible = item.visible;
          return replacement ? replacement : item;
        });

        window.localStorage.setItem(
          "wiki_datatool_settings",
          JSON.stringify(localArr)
        );
        val = localArr.filter((col) => col.visible);
      }

      val = val.map((item) => {
        if (item.options?.totag) {
          item.customRender = (text, record, index) => {
            let toTag = Object.entries(item.options.totag);
            switch (text) {
              case toTag[0][0]:
                return <a-tag color={toTag[0][1]}>{text}</a-tag>;
              case toTag[1][0]:
                return <a-tag color={toTag[1][1]}>{text}</a-tag>;
            }
          };
        }

        if (item.options?.split) {
          item.customRender = (text) => {
            if (text) {
              if (text.indexOf("\r\n") >= 1) {
                const list = text.split("\r\n");
                return list.map((item) => {
                  return <li>{item}</li>;
                });
              } else if (text.indexOf("\n") >= 1) {
                const list = text.split("\n");
                return list.map((item) => {
                  return <li>{item}</li>;
                });
              } else {
                return text;
              }
            }
          };
        }

        if (item.options?.sorter) {
          let dataIndex = item.dataIndex;
          if (item.value_type == "int") {
            item.sorter = (a, b) => a[dataIndex] - b[dataIndex];
          } else {
            item.sorter = (a, b) => {
              a[dataIndex] = a[dataIndex] == null ? "" : a[dataIndex];
              b[dataIndex] = b[dataIndex] == null ? "" : b[dataIndex];
              return a[dataIndex].localeCompare(b[dataIndex]);
            };
          }
        }

        if (item.options?.class_style) {
          if (item.options.class_style.align) {
            item.customCell = () => {
              return {
                style: {
                  textAlign: item.options.class_style.align,
                },
              };
            };
          }
        }
        return item;
      });
      return val;
    },
    addReport() {
      getAddColumn({ app_type: "Tool" }).then((res) => {
        if (res.data.status) {
          this.wikiRowInfo = res.data.data;
        }
      });
      this.addReportModal = true;
    },
    onFromChange(data) {
      this.formData = data[0];
    },
    handleOk() {
      this.submitLoading = true;
      for (let key in this.formData) {
        if (!this.formData[key]) {
          this.formData[key] = null;
        }
      }
      let parmasString = { data: this.formData };
      parmasString["app_type"] = "Tool";
      parmasString = JSON.stringify(parmasString);

      addTableInfo(parmasString).then((res) => {
        this.submitLoading = false;
        if (res.data.status) {
          this.addReportModal = false;
          this.reloadKey = +new Date();
          this.$parent.$parent.$parent.$parent.getTodoData();
          this.$parent.$parent.$parent.$parent.getEditTableData();
          this.$parent.$parent.$parent.$parent.getTableData();
        }
        for (let key in this.formData) {
          if (!this.formData[key]) {
            this.formData[key] = undefined;
          }
        }
      });
    },
    closeModal() {
      this.reloadKey = +new Date();
      this.addReportModal = false;
    },
    totalImport() {
      this.totalImportModal = true;
    },
    closeTotalImport() {
      this.totalImportModal = false;
      //清空文件列表
      this.shopIdList = [];
    },
    handleRemoveShopId(file) {
      const index = this.shopIdList.indexOf(file);
      const newFileList = this.shopIdList.slice();
      newFileList.splice(index, 1);
      this.shopIdList = newFileList;
    },
    beforeUploadShopId(file) {
      if (this.shopIdList.length > 0) {
        this.$notification.warning({
          placement: "topCenter",
          message: "消息提示",
          description: "只允许上传一个文件哦",
          duration: 3,
        });
        return false;
      }
      if (
        file.name.indexOf(".csv") == -1 &&
        file.name.indexOf(".xls") == -1 &&
        file.name.indexOf(".xlsx") == -1
      ) {
        this.$notification.warning({
          placement: "topCenter",
          message: "消息提示",
          description: "只允许上传csv、xls、xlsx格式文件",
          duration: 3,
        });
        return false;
      }
    },
    uploadImportFile(info) {
      const { file } = info;
      let form = new FormData();
      form.append("file", file);
      form.append("app_type", "Tool");
      this.dataUploading = true;

      addTableBatch(form).then((res) => {
        if (res.data.status) {
          this.shopIdList = [...this.shopIdList, file];
          info.onSuccess(res.data, file);
        }
        this.dataUploading = false;
      });
    },
    downloadTemplate() {
      let parma = {
        app_type: "Tool",
      };
      downloadTemplate(parma).then((res) => {
        if (res.status == 200) {
          if (res.headers["content-disposition"]) {
            const fileName = decodeURIComponent(
              res.headers["content-disposition"]
                .split(";")[1]
                .split("filename=")[1]
            );
            let blob = new Blob([res.data], {
              type: res.headers["content-type"],
            });
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          }
        }
      });
    },
    downloadData() {
      let parma = {
        data_status: this.dataStatus,
        app_type: "Tool",
        data: this.conditions,
      };
      if (this.keyword) {
        parma["keyword"] = this.keyword;
      }
      downloadData(parma).then((res) => {
        if (res.status == 200) {
          if (res.headers["content-disposition"]) {
            const fileName = decodeURIComponent(
              res.headers["content-disposition"]
                .split(";")[1]
                .split("filename=")[1]
            );
            let blob = new Blob([res.data], {
              type: res.headers["content-type"],
            });
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          }
        }
      });
    },
    onSearchWiki(value) {
      this.$emit("searchInput", value);
    },
    onSearchChange(conditions, searchOptions) {
      this.conditions = conditions;
      this.$emit("search", conditions, searchOptions);
    },
    onChange(pagination, filters, sorter, options) {
      this.$emit("change", pagination, filters, sorter, options);
    },
    getApiData(api, parmas, index) {
      let parmasString = {};
      parmas.forEach((item) => {
        parmasString[item] = this.totalData[index][item];
      });
      if(parmas.indexOf('app_type') !== -1){
        parmasString['app_type'] = this.appType;
      }
      parmasString = JSON.stringify(parmasString);
      return request(`${BASE_URL}/${api}`, METHOD.POST, parmasString, {
        headers: { "content-type": "application/json" },
      });
    },
    showReport(record, item) {
      this.$parent.$parent.$parent.$parent.showReport(record, item);
    },
    editReport(record, item) {
      this.$parent.$parent.$parent.$parent.editReport(record, item);
    },
    deleteReport(record, item) {
      this.$parent.$parent.$parent.$parent.deleteReport(record, item);
    },
    onColumnsReset() {
      //重置 恢复表头初始值
      this.localColumns = this.setUpColumns = [];
      window.localStorage.setItem(
        "wiki_datatool_settings",
        JSON.stringify(this.setUpColumns)
      );
    },
    onColumnsOrder(column) {
      // 调整完表头顺序后，另外添加上固定列
      let leftFix = this.dataTableHeaders.filter((i) => i.fixed == "left");
      let a = leftFix.length > 0 ? [] : "",
        b;
      this.dataTableHeaders.forEach((item) => {
        if (item.fixed == "left") {
          item.visible = true;
          a.push(item);
        }

        if (item.fixed == "right") {
          item.visible = true;
          b = item;
        }
      });

      this.setUpColumns = this.localColumns =
        a && a.length > 1
          ? [...a, ...column, b]
          : [a ? a[0] : "", ...column, b];
      //每次调换顺序 保存一次记录
      window.localStorage.setItem(
        "wiki_datatool_settings",
        JSON.stringify(this.setUpColumns)
      );
    },

    // 批量编辑
    totalEdit() {
      this.editable = true;
      this.$parent.$parent.$parent.$parent.editable = true;
      // 深拷贝编辑表格的初始data，用于修改提交
      this.totalData = JSON.parse(JSON.stringify(this.editDataSource));

      for (let i = 0; i < this.editDataSource.length; i++) {
        // 深拷贝编辑表格的20条表头，用于存储每一行对应表头设置的变化
        this.totalHeaders.push(
          JSON.parse(JSON.stringify(this.editDataTableHeaders))
        );
      }

      this.totalData.map((item) => {
        // 每一行增加切换编辑状态的字段,提交接口时去掉
        item.change_status = false;
      });

      // 点击批量编辑时，根据初始值自动修改每一行的必填项
      var requiredObj = [],
        requiredVal = "";
      this.editDataTableHeaders.forEach((item) => {
        if (item.options && item.options.required_fields) {
          requiredVal = item.dataIndex;
          requiredObj = item.options.required_fields;
        }
      });

      Object.keys(requiredObj).forEach((item) => {
        let requiredFields = requiredObj[item];

        this.totalData.forEach((i, index) => {
          let nowOptions = this.totalHeaders[index].find(
            (obj) => obj.dataIndex === requiredVal
          ).options;

          requiredFields.forEach((field) => {
            //value值为i[requiredVal]
            if (i[requiredVal].indexOf(item) > -1) {
              // 在当前index的单独表头中value取反
              let requireObj = this.totalHeaders[index].find(
                (obj) => obj.dataIndex === field
              );
              if (requireObj) {
                requireObj.options.required = !this.totalHeaders[index].find(
                  (obj) => obj.dataIndex === field
                ).options.required;
              }
              // 这一次的requiredFields存下来
              nowOptions.prevRequiredFields = requiredFields;
            }
          });
        });
      });
    },
    // 表格批量编辑时，value 和 default 赋值
    formatValue(index, col) {
      let value = this.totalData[index][col.dataIndex];

      this.totalData[index][col.dataIndex] = (value?.length)
          ? value
          : this.totalHeaders[index].find(
            (obj) => obj.dataIndex === col.dataIndex).options.default;

        // 赋值完初始默认值后，清空单元格的默认值，避免为空时再次被赋值
        this.totalHeaders[index].find(
        (obj) => obj.dataIndex === col.dataIndex).options.default=""

      if (!this.totalData[index][col.dataIndex]) {
        this.totalData[index][col.dataIndex] = undefined;
      }
      return this.totalData[index][col.dataIndex];
    },
    disabledValue(val) {
      return Array.isArray(val) ? val.join("; ") : val;
    },
    handleClickRow(record, index) {
      return {
        on: {
          click: () => {
            //切换行时，index不同就把上一个change_status切换
            if (index !== this.edit_index) {
              record.change_status = !record.change_status;
              this.edit_record.change_status = !this.edit_record.change_status;
            }
            this.edit_index = index;
            this.edit_record = record;
            this.$forceUpdate();
          },
        },
      };
    },
    handleInputBlur(value, col, index) {
      this.totalData[index][col.dataIndex] = value;
    },
    onSelectChange(value, col, index) {
      if (col.options.relate_fields) {
        // 相关字段，当本控件值change后，将对应的字段值清空。
        // 目的是1个字段可以影响多个字段的可选范围，清空的字段一般带有click_event_api
      }
      if (col.options.required_fields) {
        // 根据表单值匹配，如果有的话更新对应字段为必填项，没有的话回到原始必填值
        // 当前配置
        let nowOptions = this.totalHeaders[index].find(
          (obj) => obj.dataIndex === col.dataIndex
        ).options;

        // 假如切换选项（上一个required_fields与这一个不同），把上一个必填项恢复原始
        if (nowOptions.prevRequiredFields) {
          nowOptions.prevRequiredFields.forEach((prevField) => {
            // find()方法会返回undefined，所以增加判断
            let requireObj = this.totalHeaders[index].find(
              (obj) => obj.dataIndex === prevField
            );

            if (requireObj) {
              requireObj.options.required = this.editDataTableHeaders.find(
                (obj) => obj.dataIndex === prevField
              ).options.required;
            }
          });
          nowOptions.prevRequiredFields = [];
        }

        Object.keys(col.options.required_fields).forEach((item) => {
          // item 为当前列required_fields循环到的值
          // requiredFields 为该值对应需要设置必填的字段数组列表
          let requiredFields = col.options.required_fields[item];

          requiredFields.forEach((field) => {
            // 如果选中required_fields的key
            if (value.indexOf(item) > -1) {
              // 在当前index的单独表头中value取反
              let requireObj = this.totalHeaders[index].find(
                (obj) => obj.dataIndex === field
              );

              if (requireObj) {
                requireObj.options.required = !this.totalHeaders[index].find(
                  (obj) => obj.dataIndex === field
                ).options.required;
              }

              // 这一次的requiredFields存下来
              nowOptions.prevRequiredFields = requiredFields;
            }
          });
        });
      }
      if (col.options.change_event_api) {
        // 本控件change后，将change_para的值请求api后更新其他控件值。
        this.getApiData(
          col.options.change_event_api,
          col.options.change_para,
          index
        ).then((res) => {
          if (res.data.data) {
            Object.keys(res.data.data).forEach((item) => {
              this.totalData[index][item] = res.data.data[item];
            });
          }
        });
      }
      this.totalData[index][col.dataIndex] = value;
      //强制刷新
      this.$forceUpdate();
    },
    onSelectDropdown(value, col, index) {
      if (col.options.click_event_api) {
        this.getApiData(
          col.options.click_event_api,
          col.options.click_para,
          index
        ).then((result) => {
          if (result.data.data) {
            this.totalHeaders[index].find(
              (obj) => obj.dataIndex === col.dataIndex
            ).options.select = result.data.data;
          }
        });
        this.$forceUpdate();
      }
    },
    inputSelectChange(value, col, index) {
      if (value === "") {
        return;
      } else {
        col.options.originSelect = col.options.select || [];
        this.totalHeaders[index].find(
          (obj) => obj.dataIndex === col.dataIndex
        ).options.select = [value].concat(col.options.originSelect);
        this.$forceUpdate();
      }
      // 适配有search_event_api的情况
      this.fetchSearch(value, col, index);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    fetchSearch(value, col, index) {
      if(col.options.search_event_api){
        if (value === "") {
          return;
        } else {
          this.fetching = true;
          let parmasString = {};
          col.options.search_para.forEach((item) => {
            if(item === 'app_type'){
              parmasString[item] = this.appType;
            }else{
              parmasString[item] = value;
            }
          });

          sleep(500).then(() => {
            request(
              `${BASE_URL}/${col.options.search_event_api}`,
              METHOD.POST,
              JSON.stringify(parmasString),
              {
                headers: { "content-type": "application/json" },
              }
            ).then((result) => {
              const data = result.data.data;
              this.totalHeaders[index].find(
                (obj) => obj.dataIndex === col.dataIndex
              ).options.select = data;

              if(col.options.change_event_api){
                if (data.length == 1 && value == data[0].text) {
                  this.getApiData(
                    col.options.change_event_api,
                    col.options.change_para,
                    index
                  ).then((res) => {
                    if (res.data.data) {
                      Object.keys(res.data.data).forEach((item) => {
                        this.totalData[index][item] = res.data.data[item];
                      });
                    }
                  });
                }
              }
              this.$forceUpdate();
              this.fetching = false;
            });
          });
        }
      }
    },
    fetchUser(value, col, index) {
      if (value === "") {
        return;
      }
      var reg = /^[A-Za-z0-9.+_-]+@[A-Za-z0-9]+.[a-zA-Z]+$/g;
      let name_list = value.split(/[、 ，,;]/);

      // 先去空值再去掉首尾空格
      // name_list = name_list.filter(d => d).map(d => d.replace(/(^\s*)|(\s*$)/g, ""))
      name_list = name_list
        .filter((d) => d)
        .map((d) => d.replace(/(^\s*)|(\s*$)/g, ""))
        .map((d) => (d.match(reg) ? d.match(reg)[0] : d.match(reg)));
      if (name_list && name_list[0] != null) {
        if (
          this.totalData[index][col.dataIndex] &&
          this.totalData[index][col.dataIndex].length > 0
        ) {
          this.totalData[index][col.dataIndex] = [
            ...new Set(this.totalData[index][col.dataIndex].concat(name_list)),
          ];
        } else {
          this.totalData[index][col.dataIndex] = name_list;
        }
        this.$forceUpdate();
        return;
      } else {
        this.fetching = true;
        request(
          `${BASE_URL}/${col.options.search_event_api}`,
          METHOD.POST,
          JSON.stringify({ keyword: value }),
          {
            headers: { "content-type": "application/json" },
          }
        ).then((result) => {
          const data = result.data.data.map((user) => ({
            text: user,
            value: user,
          }));
          this.totalHeaders[index].find(
            (obj) => obj.dataIndex === col.dataIndex
          ).options.select = data;
          this.$forceUpdate();
          this.fetching = false;
        });
      }
    },
    handleUserSearch(value, col, index) {
      this.totalData[index][col.dataIndex] = value;
      this.$forceUpdate();
      this.fetching = false;
    },
    onCalendarChange(value, col, index) {
      // 捞出名字以及对应的moment
      const format = this.getFormat(col);
      if (value && value instanceof Array) {
        // let formatString = "";
        // if (formItem.value[0]) {
        //   formItem.value[0].second(0);
        //   formatString = formItem.value[0].format(format) + ",";
        // }
        // if (formItem.value[1]) {
        //   formItem.value[1].second(0);
        //   formatString += formItem.value[1].format(format);
        // }
        // this.formCol[name] = formatString;
      } else {
        if (value) {
          // 单个时间值 强制把秒刷为0
          value.second(0);
          this.totalData[index][col.dataIndex] = value.format(format);
        } else {
          this.totalData[index][col.dataIndex] = value;
        }
        this.$forceUpdate();
      }
    },
    onCalendarOpenChange(open, col, index) {
      if (open) {
        if (col.options.click_event_api) {
          this.getApiData(
            col.options.click_event_api,
            col.options.click_para,
            index
          ).then((result) => {
            if (result.data.data.start) {
              this.totalHeaders[index].find(
                (obj) => obj.dataIndex === col.dataIndex
              ).options.start = result.data.data.start;
            }
            if (result.data.data.end) {
              this.totalHeaders[index].find(
                (obj) => obj.dataIndex === col.dataIndex
              ).options.start = result.data.data.end;
            }
          });
        }
      }
    },
    getFormat(col) {
      const type = col.type;
      switch (type) {
        case "time":
          return "HH:mm:ss";
        case "date":
          return "YYYY-MM-DD";
        case "date_range":
          return "YYYY-MM-DD";
        case "datetime":
          return "YYYY-MM-DD HH:mm:ss";
        case "datetime_range":
          return "YYYY-MM-DD HH:mm:ss";
        default:
          return undefined;
      }
    },
    saveTotalEdit() {
      this.saving = true;
      this.totalData = this.totalData.map((item) => {
        for (let key in item) {
          if (!item[key]) {
            item[key] = null;
          }
        }
        delete item.change_status;
        return item;
      });
      let parmasString = { data: this.totalData };
      parmasString["app_type"] = "Tool";
      parmasString = JSON.stringify(parmasString);

      saveDraftBatch(parmasString).then((res) => {
        this.saving = false;

        if (res.data.status) {
          this.editable = false;
          this.$parent.$parent.$parent.$parent.editable = false;
          this.totalData = [];
          this.totalHeaders = [];
          this.edit_record.change_status = !this.edit_record.change_status;
          this.edit_index = -1;
          this.edit_record = {};
          // 重新刷新父组件接口获取最新值
          this.$emit("search");
        }
      });
    },
    submitTotalEdit() {
      this.submiting = true;
      this.totalData = this.totalData.map((item) => {
        for (let key in item) {
          if (!item[key]) {
            item[key] = null;
          }
        }
        delete item.change_status;
        return item;
      });
      let parmasString = { data: this.totalData };
      parmasString["app_type"] = "Tool";
      parmasString = JSON.stringify(parmasString);

      updateTableInfoBatch(parmasString).then((res) => {
        this.submiting = false;

        if (res.data.status) {
          this.editable = false;
          this.$parent.$parent.$parent.$parent.editable = false;
          this.totalData = [];
          this.totalHeaders = [];
          this.edit_record.change_status = !this.edit_record.change_status;
          this.edit_index = -1;
          this.edit_record = {};
          // 重新刷新父组件接口获取最新值
          this.$emit("search");
        }
      });
    },
    cancelTotalEdit() {
      this.editable = false;
      this.$parent.$parent.$parent.$parent.editable = false;
      this.totalData = [];
      this.totalHeaders = [];
      this.edit_record.change_status = !this.edit_record.change_status;
      this.edit_index = -1;
      this.edit_record = {};
    },
    editorInit() {
      require("brace/theme/textmate"); //主题
      require("brace/ext/language_tools"); //启用提示菜单
      require("brace/ext/searchbox"); //启用提示菜单
      require("brace/mode/yaml"); //语言模式
      require("brace/mode/json");
      require("brace/mode/python");
      require("brace/mode/sqlserver");
      require("brace/snippets/sqlserver");
      require("brace/snippets/json");
      require("brace/snippets/python");
      require("brace/snippets/yaml");
    },
    copyEditor() {
      let clipboard = new Clipboard("#copy-icon");
      clipboard.on("success", () => {
        this.$message.success(`复制成功`);
        clipboard.destroy();
      });
    },
    // 代码块语言切换
    handleLangChange(val) {
      this.mode = val;
      this.editorInit();
    },
    formaterEditor(col, index) {
      if (this.totalData[index][col.dataIndex]) {
        this.totalData[index][col.dataIndex] = sqlFormatter.format(
          this.totalData[index][col.dataIndex],
          {
            language: "sql",
            tabWidth: 2,
            keywordCase: "preserve",
            linesBetweenQueries: 2,
          }
        );

        this.$forceUpdate();
      }
    },
    codeChange(val, col, index) {
      this.totalData[index][col.dataIndex] = val;
    },
  },
};
</script>

<style scoped lang="less">
.advanced-table {
  // overflow-y: auto;
  background-color: @component-background;
  position: absolute;
  width: 100%;

  .header-bar {
    padding: 18px 0px 18px 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-radius: 4px;
    transition: all 0.3s;
    min-width: 0;
    flex: auto;

    // width: calc(80vw - 280px);
    &.middle {
      padding: 12px 16px;
    }

    &.small {
      padding: 8px 12px;
      border: 1px solid @border-color;
      border-bottom: 0;

      .title {
        font-size: 16px;
      }
    }

    .title {
      transition: all 0.3s;
      font-size: 18px;
      color: @title-color;
      font-weight: 700;
    }
    .header-button .ant-btn {
      margin-left: 10px;
    }
    .actions {
      text-align: right;
      font-size: 17px;
      color: @text-color;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  // 更改表头、表格间隔
  /deep/ .ant-table-thead > tr > th,
  /deep/ .ant-table-tbody > tr > td {
    padding: 16px 10px;
  }

  // 表头居中
  /deep/ .ant-table-thead > tr > th {
    text-align: center;
  }

  /deep/ th.ant-table-row-cell-break-word:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

/deep/ .ant-table-row td {
  white-space: nowrap;
}

//表格滚动条
/deep/ .ant-table-body {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面的滑块*/
    border-radius: 5px;
    background: #c0c0c0;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道背景*/
    // border-radius: 5px;
    background: #fafafa;
  }
}

// 解决固定列滚动条
/deep/ .ant-table-fixed-right {
  margin-right: 8px;
  height: 99.5%;
  box-shadow: -10px -3px 8px -7px rgba(0, 0, 0, 0.15);
  // max-height: calc(v-bind(pageMinHeight) - 100);
  z-index: 9;
}

/deep/ .ant-table-body-inner {
  // overflow-x: hidden !important;
  overflow-y: hidden !important;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面的滑块*/
    // border-radius: 5px;
    background: rgba(255, 255, 255, 0);
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道背景*/
    // border-radius: 5px;
    background: rgba(255, 255, 255, 0);
  }
}

//去除操作列背后的悬浮效果
/deep/
  th.ant-table-fixed-columns-in-body.ant-table-row-cell-break-word.ant-table-row-cell-last:hover {
  background: rgb(250 250 250);
}

// 内容固定的列居中对齐
/deep/ .sensitive-request,
/deep/ .priority,
/deep/ .request-status,
/deep/ .secret-level,
/deep/ .post-status,
/deep/ .expected-ddl,
/deep/ .end-time {
  text-align: center;
}

/deep/ .ant-tag {
  margin-right: 0;
}

//遮盖无数据时操作列竖条的显示
/deep/ .ant-table-placeholder {
  z-index: 2;
}

//有子需求的折叠符号的情况
.ant-table-row-expand-icon + span {
  margin-right: 25px;
  display: inline-block;
}

// 使用插槽要在多的一层div里加省略号
.ant-table-row-cell-ellipsis {
  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.select {
  width: 100%;
  .ant-select {
    margin-top: 5px;
  }
}

.edit-box {
  display: flex;
  align-items: center;
  .symbol {
    display: inline-block;
    // height: 23px;
    font-size: 15px;
    margin-right: 4px;
    color: #f5222d;
  }
  .disabled-text {
    color: #acacac;
  }
}

// 修改批量导入footer样式
.all-import {
  /deep/ .ant-modal-footer {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
  /deep/ .ant-modal-body {
    .ant-upload {
      width: 100%;
    }
  }
}

.disabled-use {
  pointer-events: none;
  color: rgba(0, 0, 0, 0.25);
}

.code_box {
  border: 1px solid #dcdee2;
  width: 100%;
}
.code_read_box {
  border: 1px solid #dcdee2;
  width: 100%;
  .ace_editor.ace-tm {
    // color: rgba(0, 0, 0, 0.4);
  }
}

.formater_button {
  display: flex;
  padding: 0px 10px;
  border-bottom: 1px solid #dcdee2;
  background-color: #fff;
}
.actions {
  color: #6f6f6f;
}

.actions:hover {
  color: #ee4d2d;
}
 
</style>