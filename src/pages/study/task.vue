/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:07:39 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-21 13:17:08
 * @instructions  任务管理 
 */
<template>
  <div>
    <Row :gutter="16">
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="taskName">
      <span slot="prepend"> 任务名称 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="taskCode">
      <span slot="prepend"> 任务编号 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="projectName">
      <span slot="prepend"> 项目名称 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="5" :sm="12" :xs="24">
      <div class="s-input-wrapper">
        <label>
                            任务状态
                          </label>
        <Select v-model="taskStatus" clearable>
                            <Option v-for="item in projTaskStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                          </Select>
      </div>
      <split></split>
      </Col>
      <Col :md="4" :sm="12" :xs="24">
      <div>
        <Button type="info" @click="seach"> 查询 </Button>
        <Button @click="resetTask"> 重置 </Button>
      </div>
      <split></split>
      </Col>
    </Row>
    <div class="task-wrap">
      <div>
        <Button type="info" v-if="privilegeData.TASK_IMPT" @click="getReportTemplateTask"> 下载模板 </Button>
        <Button type="info" @click="taskFileExport" v-if="privilegeData.TASK_IMPT"> 导入 </Button>
        <Button type="info" v-if="privilegeData.TASK_EXPT" @click="getReportTaskExport"> 导出 </Button>
      </div>
      <!-- 任务的导入start -->
      <Modal title="列表导入" v-model="ImportModal">
        <Upload ref="upload" :with-credentials='true' type="drag" :show-upload-list="false" :before-upload="handleUpload" :headers="header" :format="['xls','xlsx']" :on-format-error="handleFormatError" :action="actionSrc" :on-success='uploadSuccess'>
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或者拖拽文件上传</p>
          </div>
        </Upload>
        <p> 注：只能导入和模版格式相同的Excel 文件</p>
        <div class="file-list" v-if="file != null">
          <span class="file-span"> 上传文件：</span>
          <p class="upload-list-file">
            <Icon type="document-text"></Icon>
            <span class="file-name-span"> {{ file.name }} </span>
            <span class="close" @click="delectFile">
                                <Icon type="ios-close-empty"></Icon>
                              </span>
          </p>
          <Button class="update-btn" type="ghost" icon="ios-cloud-upload-outline" @click="upload" long> 上传 </Button>
        </div>
        <div>
          <p v-show="fileTile.notExistsContractCodes"> 不存在的合同编号： {{fileData.notExistsContractCodes}} </p>
          <p v-show="fileTile.dupTask"> 任务编码或任务名称重复： {{fileData.dupTask}}</p>
          <p v-show="fileTile.errCoordinate"> 错误坐标： {{fileData.errCoordinate}}</p>
        </div>
        <div slot="footer">
        </div>
      </Modal>
      <!-- 任务的导入end -->
      <split></split>
      <Table stripe :columns="columnsTask" :data="taskData"></Table>
      <div class="page">
        <Page :total="total" size="small" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <Modal v-model="taskEditModal" title="修改项目任务" :mask-closable="false" :width="800" class="from-project">
      <Form ref="formEditProjectTask" :model="formEditProjectTask" :rules="taskInline" :label-width="100">
        <Row :gutter="24">
          <Col :xs="24" :sm="12">
          <FormItem prop="taskName" label="任务名称">
            <Input v-model.trim="formEditProjectTask.taskName"></Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="taskCode" label="任务编码">
            <Input v-model.trim="formEditProjectTask.taskCode"></Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="taskStep" label="任务序号">
            <InputNumber v-model="formEditProjectTask.taskStep" :min="1" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="taskCategory" label="任务分类">
            <Select v-model="formEditProjectTask.taskCategory">
                                <Option v-for="item in projTaskCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                              </Select>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="taskPriority" label="紧急度">
            <Select v-model="formEditProjectTask.taskPriority">
                                <Option v-for="item in priorityList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                              </Select>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="taskStatus" label="任务状态">
            <Select v-model="formEditProjectTask.taskStatus">
                                <Option v-for="item in projTaskStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                              </Select>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="startTime" label="开始日期">
            <DatePicker :editable='false' type="date" v-model="formEditProjectTask.startTime"></DatePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="finishTime" label="完成日期">
            <DatePicker :editable='false' type="date" v-model="formEditProjectTask.finishTime"></DatePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="standardHour" label="基准工时">
            <InputNumber v-model="formEditProjectTask.standardHour" :min="1" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem prop="controlHour" label="控制工时">
            <InputNumber v-model="formEditProjectTask.controlHour" :min="1" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="是否模板">
            <RadioGroup v-model="formEditProjectTask.template">
              <Radio label="true">是</Radio>
              <Radio label="false">否</Radio>
            </RadioGroup>
          </FormItem>
  
          </Col>
          <Col :xs="24" :sm="24">
          <FormItem prop="description" label="任务描述">
            <Input v-model="formEditProjectTask.description" type="textarea" :rows="2"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="putPorjTask('formEditProjectTask')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="taskViweModal" title="项目任务详情" :width="800" class="viwe-div">
      <Row :gutter="16">
        <Col :xs="8" :sm="4">
        <div>任务名称</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.taskName}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>任务编码</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.taskCode}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>任务分类</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.categoryName}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>任务序号</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{!projectTaskCon.taskStep ? "暂无" :projectTaskCon.taskStep}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>开始日期</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.startTime}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>完成日期</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.finishTime}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>基准工时</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.standardHour}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>控制工时</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{!projectTaskCon.controlHour ? "暂无" : projectTaskCon.controlHour}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>状态</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.statusName}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>是否模板</div>
        </Col>
        <Col :xs="16" :sm="8">
        <div class="font-color">{{projectTaskCon.template}}</div>
        </Col>
        <Col :xs="8" :sm="4">
        <div>任务描述</div>
        </Col>
        <Col :xs="16" :sm="20">
        <div class="font-color">{{!projectTaskCon.description ? "暂无" :projectTaskCon.description}}</div>
        </Col>
      </Row>
      <div slot="footer">
      </div>
    </Modal>
  
  </div>
</template>

<script>
  import axios from "axios";
  // 删除按钮
  const deleteButton = (vm, h, params) => {
    return h(
      "Poptip", {
        props: {
          confirm: true,
          title: "您确定要删除这条数据吗?",
          transfer: true
        },
        on: {
          "on-ok": () => {
            vm.deletProjTask(params.row.projTaskId);
          }
        }
      }, [
        h(
          "Button", {
            style: {
              marginRight: "5px"
            },
            props: {
              type: "error",
              placement: "top",
              size: "small"
            }
          },
          "删除"
        )
      ]
    );
  };
  // 编辑按钮
  const editButton = (vm, h, params) => {
    return h(
      "Button", {
        props: {
          type: "primary",
          size: "small"
        },
        style: {
          marginRight: "5px"
        },
        on: {
          click: () => {
            vm.editProjTask(params.row);
          }
        }
      },
      "编辑"
    );
  };
  // 查看按钮
  const viewButton = (vm, h, params) => {
    return h(
      "Button", {
        props: {
          type: "success",
          size: "small"
        },
        style: {
          marginRight: "5px"
        },
        on: {
          click: () => {
            vm.getProjTaskCon(params.row.projTaskId);
          }
        }
      },
      "查看"
    );
  };
  // 任务序号
  const taskStaffInput = (vm, h, params) => {
    return h("InputNumber", {
      props: {
        min: 0,
        step: 1,
        value: params.row.taskStep
      },
      on: {
        "on-blur": value => {
          vm.onBlurInputNumber(
            params.row.projTaskId,
            params.row.taskStep,
            event.target.value
          );
        }
      }
    });
  };
  import split from "components/unit/split";
  import {
    ApiGetDict
  } from "@/api/api";
  import {
    ApiGetProjTaskList,
    ApiDeletProjTask,
    ApiGetProjTaskTemplateCon,
    ApiPutPorjTask,
    ApiGetReportTemplateTask,
    ApiGetReportTaskExport
  } from "@/api/study/task-api";
  
  import moment from "moment";
  import {
    privilege
  } from "common/js/privilege";
  import qs from "qs";
  import {
    resCode
  } from "@/api/code";
  export default {
    components: {
      split
    },
    data() {
      const validateenglish = (rule, value, callback) => {
        var reg = /^[0-9]\d*$/;
        if (!reg.test(value)) {
          callback(new Error("工时必须是正整数！"));
        } else {
          callback();
        }
      };
      return {
        // uploadData:"", // 上传参数
        fileData: {
          notExistsContractCodes: "",
          dupTask: "",
          errCoordinate: ""
        },
        fileTile: {
          notExistsContractCodes: false,
          dupTask: false,
          errCoordinate: false
        },
        file: null,
        header: {
          Authorization: sessionStorage.getItem("token")
        },
        ImportModal: false,
        privilegeData: {
          //三级权限
          TASK_ADD: false,
          TASK_IMPT: false,
          TASK_EXPT: false,
          TASK_VIEW_SUPER: false,
          TASK_EDIT_SUPER: false,
          TASK_DEL_SUPER: false,
          TASK_VIEW_MD: false,
          TASK_EDIT_MD: false,
          TASK_DEL_MD: false,
          TASK_VIEW_GEN: false,
          TASK_EDIT_GEN: false,
          TASK_DEL_GEN: false
        },
        projCategoryCode: '',
        total: 0,
        pageNum: 1,
        pageSize: 10,
        projectName: "",
        taskName: "",
        taskCode: "",
        taskStatus: "",
        projTaskCategoryList: [],
        projTaskStatusList: [],
        priorityList: [],
        columnsTask: [{
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code = (vm.pageNum - 1) * vm.pageSize + params.index + 1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "项目名称",
            key: "projectName",
            className: "description-column",
            align: "center",
            width: 200,
            render: (h, params) => {
              return h("div", [
                h(
                  "Tooltip", {
                    props: {
                      type: "text",
                      content: params.row.projectName,
                      className: "tooltip-hover"
                    }
                  },
                  params.row.projectName
                )
              ]);
            }
          },
          {
            title: "任务编号",
            key: "taskCode"
          },
          {
            title: "任务名称",
            key: "taskName"
          },
  
          {
            title: "状态",
            key: "statusName"
          },
          {
            title: "紧急度",
            key: "priorityName"
          },
          {
            title: "基准工时",
            key: "standardHour"
          },
          {
            title: "任务序号",
            key: "taskStep",
            align: "center",
            render: (h, params) => {
              return h("div", [
                (function(vm) {
                  if (params.row.allowEdit) {
                    return taskStaffInput(vm, h, params);
                  } else {
                    return params.row.taskStep;
                  }
                })(this)
              ]);
            }
          },
          {
            title: "操作",
            key: "action",
            width: 180,
            align: "center",
            render: (h, params) => {
              return h("div", [
                (function(vm) {
                  if (params.row.allowView) {
                    return viewButton(vm, h, params);
                  }
                })(this),
                (function(vm) {
                  if (params.row.allowEdit) {
                    return editButton(vm, h, params);
                  }
                })(this),
                (function(vm) {
                  if (params.row.allowDel) {
                    return deleteButton(vm, h, params);
                  }
                })(this)
              ]);
            }
          }
        ],
        taskData: [],
        taskEditModal: false,
        taskViweModal: false,
        projectTaskCon: {},
        formEditProjectTask: {
          taskStep: 1,
          taskCode: "",
          taskName: "",
          startTime: "",
          finishTime: "",
          taskCategory: "",
          taskStatus: "",
          taskPriority: "",
          template: "true",
          standardHour: 0,
          controlHour: 0,
          description: ""
        },
        taskInline: {
          taskName: [{
              required: true,
              message: " ",
              trigger: "blur"
            },
            {
              type: "string",
              max: 64,
              message: "任务名称不能超过64位",
              trigger: "blur"
            }
          ],
          taskCode: [{
            required: true,
            message: " ",
            trigger: "blur"
          }],
  
          taskCategory: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          taskStatus: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          taskPriority: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          standardHour: [{
              required: true,
              message: " ",
              type: "number",
              trigger: "blur"
            },
            {
              validator: validateenglish,
              trigger: "blur"
            }
          ],
          controlHour: [{
            validator: validateenglish,
            trigger: "blur"
          }],
          description: [{
            type: "string",
            max: 180,
            message: "任务名称不能超过180位",
            trigger: "blur"
          }]
        }
      };
    },
    methods: {
      /** 用户管理的导入成功之后的回调
       * @param  {Object} res 上传成功返回的data
       * @param  { file } file 文件实体
       * */
      uploadSuccess(res, file) {
        if (res.data.notExistsContractCodes) {
          if (res.data.notExistsContractCodes.length > 0) {
            this.fileTile.notExistsContractCodes = true;
            this.fileData.notExistsContractCodes = res.data.notExistsContractCodes.toString();
          }
        }
        if (res.data.dupTask) {
          if (res.data.dupTask.length > 0) {
            this.fileTile.dupTask = true;
            this.fileData.dupTask = res.data.dupTask.toString();
          }
        }
        if (res.data.errCoordinate) {
          if (res.data.errCoordinate.length > 0) {
            this.fileTile.errCoordinate = true;
            this.fileData.errCoordinate = res.data.errCoordinate.toString();
          }
        }
        if (res.code == "success") {
          this.ImportModal = false;
          if (res.data.successCount) {
            this.$Message.success("导入成功" + res.data.successCount + "条");
          }
          this.getTask();
        } else if (res.code == "fail") {
          this.$Message.error(res.msg);
        }
      },
      // 上传文件的格式验证
      handleFormatError(file) {
        this.$Message.warning(file.name + "的文件格式不正确，请选择xls或xlsx!");
      },
      //文件导入操作
      taskFileExport() {
        this.ImportModal = true;
        this.file = null;
        this.fileTile.notExistsContractCodes = false;
        this.fileTile.dupTask = false;
        this.fileTile.errCoordinate = false;
      },
      init() {
        let me = this;
        this.getTask();
        this.getDictTaskStatus();
        //获取三级菜单权限
        privilege(me.privilegeData).then(function(result) {
          me.privilegeData = result;
        });
      },
      // 分页
      handlePage(value) {
        this.pageNum = value;
        this.getTask();
      },
      handlePageSize(value) {
        this.pageSize = value;
        this.getTask();
      },
      seach() {
        this.pageNum = 1;
        this.getTask();
      },
      //请求项目任务分类
      getDictTaskCategory() {
        let dictCode = '';
        if (this.projCategoryCode == 'TASK_CATEGORY') {
          dictCode = 'TASK_CATEGORY';
        } else if (this.projCategoryCode == 'NON_TASK_CATEGORY') {
          dictCode = 'NON_TASK_CATEGORY';
        }
        ApiGetDict(dictCode).then(res => {
          if (res.code == "success") {
            this.projTaskCategoryList = res.data;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 获取 项目任务状态
      getDictTaskStatus() {
        let dictCode = "TASK_STATUS";
        let _this = this;
        ApiGetDict(dictCode).then(function(res) {
          if (res.code == "success") {
            _this.projTaskStatusList = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      //获取 项目任务 紧急度
      getDictPriority() {
        let dictCode = "PROJ_PRIORITY";
        let _this = this;
        ApiGetDict(dictCode).then(function(res) {
          if (res.code == "success") {
            _this.priorityList = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 获取 项目任务 列表
      getTask() {
        let _this = this;
        ApiGetProjTaskList({
          pageNum: _this.pageNum,
          pageSize: _this.pageSize,
          roleName: _this.roleName,
          projectName: _this.projectName,
          taskName: _this.taskName,
          taskCode: _this.taskCode,
          taskStatus: _this.taskStatus
        }).then(function(res) {
          if (res.code == "success") {
            _this.taskData = res.data;
            _this.total = res.total;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      //点击编辑按钮，请求任务详情
      editProjTask(data) {
        this.projCategoryCode = data.projCategoryCode;
        let _this = this;
        _this.getDictPriority();
        _this.getDictTaskCategory();
        ApiGetProjTaskTemplateCon(data.projTaskId).then(function(res) {
          if (res.code == "success") {
            _this.formEditProjectTask = res.data;
            _this.taskEditModal = true;
  
            if (_this.formEditProjectTask.startTime != null) {
              _this.formEditProjectTask.startTime = moment(
                _this.formEditProjectTask.startTime
              ).format("YYYY-MM-DD");
            }
            if (_this.formEditProjectTask.finishTime != null) {
              _this.formEditProjectTask.finishTime = moment(
                _this.formEditProjectTask.finishTime
              ).format("YYYY-MM-DD");
            }
            if (_this.formEditProjectTask.template) {
              _this.formEditProjectTask.template = "true";
            } else {
              _this.formEditProjectTask.template = "false";
            }
  
            let arr = [];
            for (let i = 0; i < _this.projTaskCategoryList.length; i++) {
              arr.push(_this.projTaskCategoryList[i].dictionaryId);
            }
            if (arr.indexOf(res.data.taskCategory) < -1) {
              res.data.taskCategory = '';
            } else {
              res.data.taskCategory = _this.formEditProjectTask.taskCategory;
            }
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 修改完成项目任务信息，点击保存
      putPorjTask(name) {
        let _this = this;
        _this.$refs[name].validate(valid => {
          if (valid) {
            if (
              _this.formEditProjectTask.finishTime != null &&
              (_this.formEditProjectTask.startTime = moment(
                _this.formEditProjectTask.startTime
              ).format("YYYY-MM-DD")) >
              (_this.formEditProjectTask.finishTime = moment(
                _this.formEditProjectTask.finishTime
              ).format("YYYY-MM-DD"))
            ) {
              _this.$Message.warning("完成日期必须大于开始日期!");
              return false;
            }
  
            if (_this.formEditProjectTask.startTime) {
              _this.formEditProjectTask.startTime = moment(
                _this.formEditProjectTask.startTime
              ).format("YYYY-MM-DD");
            } else {
              delete _this.formEditProjectTask.startTime;
            }
            if (_this.formEditProjectTask.finishTime) {
              _this.formEditProjectTask.finishTime = moment(
                _this.formEditProjectTask.finishTime
              ).format("YYYY-MM-DD");
            } else {
              delete _this.formEditProjectTask.finishTime;
            }
  
            delete _this.formEditProjectTask.createdby;
            delete _this.formEditProjectTask.createdtime;
            delete _this.formEditProjectTask.updatedby;
            delete _this.formEditProjectTask.updatedtime;
            ApiPutPorjTask(qs.stringify(_this.formEditProjectTask)).then(function(
              res
            ) {
              if (res.code == "success") {
                _this.$Message.success("修改成功!");
                _this.taskEditModal = false;
                _this.getTask();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      },
      // 获取 项目任务的详情
      getProjTaskCon(projTaskId) {
        let _this = this;
        ApiGetProjTaskTemplateCon(projTaskId).then(function(res) {
          if (res.code == "success") {
            _this.taskViweModal = true;
            _this.projectTaskCon = res.data;
            if (_this.projectTaskCon.startTime != null) {
              _this.projectTaskCon.startTime = moment(
                _this.projectTaskCon.startTime
              ).format("YYYY-MM-DD");
            } else {
              _this.projectTaskCon.startTime = "暂无";
            }
            if (_this.projectTaskCon.finishTime != null) {
              _this.projectTaskCon.finishTime = moment(
                _this.projectTaskCon.finishTime
              ).format("YYYY-MM-DD");
            } else {
              _this.projectTaskCon.finishTime = "暂无";
            }
  
            if (res.data.template) {
              res.data.template = "是";
            } else {
              res.data.template = "否";
            }
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 删除 项目任务
      deletProjTask(projTaskId) {
        let _this = this;
        ApiDeletProjTask(projTaskId).then(function(res) {
          if (res.code == "success") {
            //如果当前表格数据只有一条，则请求上一页
            if (_this.taskData.length == 1) {
              _this.pageNum = _this.pageNum > 1 ? --_this.pageNum : 1;
            }
            _this.getTask();
            _this.$Message.success("删除成功!");
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      /**
       * 修改  项目任务序号
       * @param  {Number} projTaskId 当前项目任务 ID
       * @param  {Number} taskStep 当前 旧数据
       * @param  {String} value 修改后的项目任务序号
       */
      onBlurInputNumber(projTaskId, taskStep, value) {
        let _this = this;
        let data = {
          projTaskId: projTaskId,
          taskStep: value
        };
        if (taskStep == value) {
          return false;
        } else if (value < 0) {
          _this.$Message.warning("序号只能输入正整数!");
          _this.getTask();
        } else {
          ApiPutPorjTask(qs.stringify(data)).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功!");
              _this.getTask();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      },
      // 重置
      resetTask() {
        this.projectName = "";
        this.taskName = "";
        this.taskCode = "";
        this.taskStatus = "";
        this.getTask();
      },
      // 上传文件之前
      handleUpload(file) {
        this.file = file;
        return false;
      },
      // 上传文件
      upload() {
        this.$refs.upload.post(this.file);
      },
      // 删除文件
      delectFile() {
        this.file = null;
      },
      // 下载模版
      getReportTemplateTask() {
        ApiGetReportTemplateTask().then(data => {
          if (!data) {
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `任务模版.xlsx`);
          document.body.appendChild(link);
          link.click();
        });
      },
      // 导出
      getReportTaskExport() {
        let _data = {
          taskName: this.taskName,
          taskCode: this.taskCode,
          projectName: this.projectName,
          taskStatus: this.taskStatus
        };
        ApiGetReportTaskExport(_data).then(data => {
          if (!data) {
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `任务报表.xlsx`);
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    watch: {
      $route(to, from) {
        this.init();
      }
    },
    computed: {
      //导入
      actionSrc() {
        return axios.defaults.baseURL + "/report/task/import";
      }
    },
    mounted() {
      this.init();
    }
  };
</script>

<style lang="scss">
  @import "../../common/css/mixin";
  @import "../../common/css/base";
  @import "../../common/css/variable.scss";
  .s-input-wrapper {
    @include select-label();
    @include clear-both();
  }
  
  .from-project {
    .ivu-date-picker {
      display: initial;
    }
    .ivu-input-number {
      width: 100%;
    }
  }
  
  .viwe-div {
    .ivu-col {
      margin-bottom: 10px;
    }
  }
  
  .font-color {
    color: $font-dark-color;
  }
  
  .description-column {
    .ivu-tooltip-rel {
      width: 180px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .ivu-tooltip-inner {
      white-space: inherit;
    }
  }
</style>
