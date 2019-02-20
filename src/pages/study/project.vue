/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:02:51 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-31 14:47:10
 * @instructions  项目管理
 */
<template>
  <div>
    <Row :gutter="16">
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="projectName">
      <span slot="prepend"> 项目名称 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="contractCode">
      <span slot="prepend"> 合同编号 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="projManagerName">
      <span slot="prepend"> 项目经理 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="5" :sm="12" :xs="24">
      <Input v-model.trim="projInspectorName">
      <span slot="prepend"> 项目总监 </span>
      </Input>
      <split></split>
      </Col>
      <Col :md="4" :sm="12" :xs="24">
      <div>
        <Button type="info" @click="seach"> 查询 </Button>
        <Button @click="resetProject"> 重置 </Button>
      </div>
      <split></split>
      </Col>
    </Row>
    <div class="project-wrap">
      <div>
        <Button type="info" @click="newProject" class="add-btn" v-if="privilegeData.STD_ADD"> 新增 </Button>
        <Button type="info" v-if="privilegeData.STD_EXPT" @click="getReportProjectExport"> 导出 </Button>
      </div>
      <split></split>
      <Table stripe :columns="columnsProject" :data="projectData"></Table>
      <div class="page">
        <Page :total="total" size="small" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <Modal v-model="projectModal" title="添加项目信息" :mask-closable="false" :width="800" class="from-project">
      <Form :label-width="100">
        <Row :gutter="24">
          <Col :sm="24" :xs="24">
          <FormItem label="选择项目模板">
            <Select v-model="template" @on-change="getProjCon">
                          <Option v-for="item in templateList" :value="item.projectId" :key="item.projectId">{{ item.contractCode }} -- {{ item.projectName}} </Option>
                        </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <Form ref="formNewProject" :model="formNewProject" :rules="projectInline" :label-width="100">
        <Row :gutter="24">
          <Col :sm="12" :xs="24">
          <FormItem prop="contractCode" label="合同编号">
            <Input v-model.trim="formNewProject.contractCode"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="projectName" label="项目名称">
            <Input v-model.trim="formNewProject.projectName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="priority" label="项目级别">
            <Select v-model="formNewProject.priority">
                          <Option v-for="item in priorityList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="projCategory" label="项目分类">
            <Select v-model="formNewProject.projCategory">
                          <Option v-for="item in projCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="planStart" label="计划开始日期">
            <DatePicker :editable='false' type="date" v-model.sync="formNewProject.planStart"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="planFinish" label="计划完成日期">
            <DatePicker :editable='false' type="date" v-model.sync="formNewProject.planFinish"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="actualStart" label="实际开始日期">
            <DatePicker :editable='false' type="date" v-model.sync="formNewProject.actualStart"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="actualFinish" label="实际完成日期">
            <DatePicker :editable='false' type="date" v-model.sync="formNewProject.actualFinish"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="standardHour" label="基准工时">
            <InputNumber v-model.trim="formNewProject.standardHour" :min="0" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="controlHour" label="控制工时">
            <InputNumber v-model.trim="formNewProject.controlHour" :min="0" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="establishDate" label="立项时间">
            <DatePicker :editable='false' type="date" v-model.sync="formNewProject.establishDate"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="closeDate" label="关闭时间">
            <DatePicker :editable='false' type="date" v-model.sync="formNewProject.closeDate"></DatePicker>
          </FormItem>
          </Col>
  
          <Col :sm="12" :xs="24">
          <FormItem prop="projStatus" label="项目状态">
            <Select v-model="formNewProject.projStatus">
                          <Option v-for="item in projStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="是否模板">
            <RadioGroup v-model="formNewProject.template">
              <Radio label="true">是</Radio>
              <Radio label="false">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="项目经理" class="manager-staff">
            <span>{{managerStaffName}}</span>
            <a class="manager-a" @click="getProjManageModalShow">选择项目经理</a>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="项目总监" class="manager-staff">
            <span>{{managerprojInspectorName}}</span>
            <a class="manager-a" @click="projInspectorModalShow">选择项目总监</a>
          </FormItem>
          </Col>
          <Col :md="24" :xs="24">
          <FormItem prop="description" label="项目描述">
            <Input v-model="formNewProject.description" type="textarea" :rows="2"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="postProj('formNewProject')">保存</Button>
      </div>
    </Modal>
    <!-- 修改项目信息 -->
    <Modal v-model="projectEditModal" title="修改项目信息" :mask-closable="false" :width="800" class="from-project">
      <Tabs type="card" @on-click="onClickTabs" v-model="tabsVal">
        <TabPane label="基本信息" name="tabsVal1">
          <Form ref="formEditProject" :model="formEditProject" :rules="projectEditInline" :label-width="100">
            <Row :gutter="24">
              <Col :sm="12" :xs="24">
              <FormItem prop="contractCode" label="合同编号">
                <Input v-model.trim="formEditProject.contractCode">
                </Input>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="projectName" label="项目名称">
                <Input v-model.trim="formEditProject.projectName"></Input>
              </FormItem>
              </Col>
  
              <Col :sm="12" :xs="24">
              <FormItem label="项目级别" prop="priority">
                <Select v-model="formEditProject.priority">
                              <Option v-for="item in priorityList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                            </Select>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem label="项目分类" prop="projCategory">
                <Select v-model="formEditProject.projCategory" @on-change="projChange">
                              <Option v-for="item in projCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                            </Select>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="planStart" label="计划开始日期">
                <DatePicker :editable='false' type="date" v-model="formEditProject.planStart"></DatePicker>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="planFinish" label="计划完成日期">
                <DatePicker :editable='false' type="date" v-model="formEditProject.planFinish"></DatePicker>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="actualStart" label="实际开始日期">
                <DatePicker :editable='false' type="date" v-model="formEditProject.actualStart"></DatePicker>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="actualFinish" label="实际完成日期">
                <DatePicker :editable='false' type="date" v-model="formEditProject.actualFinish"></DatePicker>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="standardHour" label="基准工时">
                <InputNumber v-model="formEditProject.standardHour" :min="0" :max="10000000"></InputNumber>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="controlHour" label="控制工时">
                <InputNumber v-model="formEditProject.controlHour" :min="0" :max="10000000"></InputNumber>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="establishDate" label="立项时间">
                <DatePicker :editable='false' type="date" v-model="formEditProject.establishDate"></DatePicker>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem prop="closeDate" label="关闭时间">
                <DatePicker :editable='false' type="date" v-model="formEditProject.closeDate"></DatePicker>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem label="项目状态" prop="projStatus">
                <Select v-model="formEditProject.projStatus">
                              <Option v-for="item in projStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                            </Select>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem label="是否模板">
                <RadioGroup v-model="formEditProject.template">
                  <Radio label="true">是</Radio>
                  <Radio label="false">否</Radio>
                </RadioGroup>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem label="项目经理" class="manager-staff">
                <span>{{formEditProject.projManagerName}}</span>
                <a class="manager-a" @click="getProjManageModalShow">选择项目经理</a>
              </FormItem>
              </Col>
              <Col :sm="12" :xs="24">
              <FormItem label="项目总监" class="manager-staff">
                <span>{{formEditProject.projInspectorName}}</span>
                <a class="manager-a" @click="projInspectorModalShow">选择项目总监</a>
              </FormItem>
              </Col>
              <Col :sm="24" :xs="24">
              <FormItem prop="description" label="项目描述">
                <Input v-model="formEditProject.description" type="textarea" :rows="2"></Input>
              </FormItem>
              </Col>
              <Col :sm="24" :xs="24">
              <Button type="primary" long @click="putProj('formEditProject')">保存</Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="项目客户">
          <Row :gutter="10" class="client-div">
            <Col :md="8" :xs="24">
            <Input v-model.trim="client.clientName">
            <span slot="prepend"> 客户名称 </span>
            </Input>
            </Col>
            <Col :md="8" :xs="24">
            <div>
              <Button type="primary" @click="getProjCli"> 查询 </Button>
              <Button @click="resetClient"> 重置 </Button>
              <Button type="info" class="add-btn" @click="addprojCli"> 新增 </Button>
            </div>
            </Col>
          </Row>
          <split></split>
          <div class="gorj-data-div">
            <Table stripe :columns="columnsClient" :data="clientData" :disabled-hover="true"></Table>
            <div class="page">
              <Page :total="client.total" size="small" :current="client.pageNum" :page-size="client.pageSize" show-elevator show-sizer show-total @on-change="handleClientPage" @on-page-size-change='handleClientPageSize'>
              </Page>
            </div>
          </div>
        </TabPane>
        <TabPane label="项目部门">
          <Row :gutter="16" class="client-div">
            <Col :md="8" :xs="24">
            <Input v-model.trim="deptment.deptName">
            <span slot="prepend"> 部门名称 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="8" :xs="24">
            <Input v-model.trim="deptment.deptCode">
            <span slot="prepend"> 部门编号 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="8" :xs="24">
            <div>
              <Button type="primary" @click="getProjDept"> 查询 </Button>
              <Button @click="resetDeptment"> 重置 </Button>
              <Button type="info" class="add-btn" @click="addPorjDep"> 新增 </Button>
            </div>
            </Col>
          </Row>
          <split></split>
          <div class="gorj-data-div">
            <Table stripe :columns="columnsProjDep" :data="projDepData" :disabled-hover="true"></Table>
            <div class="page">
              <Page :total="deptment.total" size="small" :current="deptment.pageNum" :page-size="deptment.pageSize" show-elevator show-sizer show-total @on-change="handleDeptmentPage" @on-page-size-change='handledDptmentPageSize'>
              </Page>
            </div>
          </div>
  
        </TabPane>
        <TabPane label="项目员工">
          <Row :gutter="16" class="client-div">
            <Col :md="8" :xs="24">
            <Input v-model.trim="staffPor.name">
            <span slot="prepend"> 姓名 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="8" :xs="24">
            <Input v-model.trim="staffPor.staffNumber">
            <span slot="prepend"> 工号 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="8" :xs="24">
            <div>
              <Button type="primary" @click="getProjStaff"> 查询 </Button>
              <Button @click="resetStaff"> 重置 </Button>
              <Button type="info" class="add-btn" @click="addprojStaffShow"> 新增 </Button>
            </div>
            </Col>
          </Row>
          <div class="gorj-data-div">
            <Table stripe :columns="columnsStaff" :data="staffData" :disabled-hover="true"></Table>
            <div class="page">
              <Page :total="staffPor.total" size="small" :current="staffPor.pageNum" :page-size="staffPor.pageSize" show-elevator show-sizer show-total @on-change="handleStaffPorPage" @on-page-size-change='handleStaffPorPageSize'>
              </Page>
            </div>
          </div>
        </TabPane>
        <TabPane label="项目任务">
          <Row :gutter="16" class="client-div">
            <Col :md="8" :xs="24">
            <Input v-model.trim="task.taskName">
            <span slot="prepend"> 任务名称 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="8" :xs="24">
            <Input v-model.trim="task.taskCode">
            <span slot="prepend"> 任务编号 </span>
            </Input>
            <split></split>
            </Col>
            <Col :md="8" :xs="24">
            <div>
              <Button type="primary" @click="getProjTaskList"> 查询 </Button>
              <Button @click="resetTask"> 重置 </Button>
              <Button type="info" class="add-btn" @click="addProjTask"> 新增 </Button>
            </div>
            <split></split>
            </Col>
          </Row>
          <split></split>
          <div class="gorj-data-div">
            <Table stripe :columns="columnsTask" :data="taskData" :disabled-hover="true"></Table>
            <div class="page">
              <Page :total="task.total" size="small" :current="task.pageNum" :page-size="task.pageSize" show-elevator show-sizer show-total @on-change="handleTaskPage" @on-page-size-change='handleTaskPageSize'>
              </Page>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="departmentModal" title="添加项目责任部门" :mask-closable="false" :width="800">
      <p class="dep-p">是否主要责任部门</p>
      <Tree :data="departmentTree" show-checkbox :render="renderContent" ref="tree"></Tree>
      <div slot="footer">
        <Button type="primary" long @click="postProjDept">保存</Button>
      </div>
    </Modal>
    <Modal v-model="clientModal" title="添加项目客户" :mask-closable="false" :width="800">
      <Row :gutter="10" class="client-div">
        <Col :md="8" :xs="24">
        <Input v-model.trim="clientAll.clientName">
        <span slot="prepend"> 客户名称 </span>
        </Input>
        </Col>
        <Col :md="8" :xs="24">
        <div>
          <Button type="primary" @click="addApiGetClient"> 查询 </Button>
          <Button @click="resetAddClient"> 重置 </Button>
        </div>
        </Col>
      </Row>
      <split></split>
      <Table stripe :columns="columnsAddClient" :data="addClientData" @on-select="onSelectProjCli" @on-select-all="onSelectProjCli" @on-select-cancel="onSelectProjCli"></Table>
      <div class="page">
        <Page :total="clientAll.total" size="small" :current="clientAll.pageNum" :page-size="clientAll.pageSize" show-elevator show-sizer show-total @on-change="handleClientAllPage" @on-page-size-change='handleClientAllPageSize'>
        </Page>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="postProjCli">保存</Button>
      </div>
    </Modal>
    <Modal v-model="staffModal" title="添加项目员工" :mask-closable="false" :width="800">
      <Row :gutter="10">
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="staff.name">
        <span slot="prepend"> 姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="staff.staffNumber">
        <span slot="prepend"> 工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model.trim="staff.deptName">
        <span slot="prepend"> 部门 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <div>
          <Button type="info" @click="addprojStaff"> 查询 </Button>
          <Button @click="resetProjStaff"> 重置 </Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <div>
        <Table stripe :columns="columnsAddStaff" :data="addStaffData" @on-select="onSelectProjCli" @on-select-all="onSelectProjCli" @on-select-cancel="onSelectProjCli"></Table>
        <div class="page">
          <Page :total="staff.total" size="small" :current="staff.pageNum" :page-size="staff.pageSize" show-elevator show-sizer show-total @on-change="handlePageStaff" @on-page-size-change='handlePageSizeStaff'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="postProjStaff">保存</Button>
      </div>
    </Modal>
    <Modal v-model="taskModal" title="添加项目任务" :mask-closable="false" :width="800" class="from-project">
      <Form :label-width="110">
        <Row :gutter="24">
          <Col :sm="24" :xs="24">
          <FormItem label="选择项目任务模板 ">
            <Select v-model="projTaskId" @on-change="getProjTaskTemplateCon">
                          <Option v-for="item in taskTemplateList" :value="item.projTaskId" :key="item.projTaskId">{{ item.taskName }}</Option>
                        </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <Form ref="formProjectTask" :model="formProjectTask" :rules="taskInline" :label-width="110">
        <Row :gutter="24">
          <Col :sm="12" :xs="24">
          <FormItem prop="taskName" label="任务名称">
            <Input v-model.trim="formProjectTask.taskName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskCode" label="任务编码">
            <Input v-model.trim="formProjectTask.taskCode"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskStep" label="任务序号">
            <InputNumber v-model="formProjectTask.taskStep" :min="1" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskCategory" label="任务分类">
            <Select v-model="formProjectTask.taskCategory">
                          <Option v-for="item in projTaskCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskPriority" label="紧急度">
            <Select v-model="formProjectTask.taskPriority">
                          <Option v-for="item in priorityList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskStatus" label="任务状态">
            <Select v-model="formProjectTask.taskStatus">
                          <Option v-for="item in projTaskStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="startTime" label="开始日期">
            <DatePicker :editable='false' type="date" v-model.sync="formProjectTask.startTime"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="finishTime" label="完成日期">
            <DatePicker :editable='false' type="date" v-model.sync="formProjectTask.finishTime"></DatePicker>
          </FormItem>
          </Col>
  
          <Col :sm="12" :xs="24">
          <FormItem prop="standardHour" label="基准工时">
            <InputNumber v-model="formProjectTask.standardHour" :min="0" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="controlHour" label="控制工时">
            <InputNumber v-model="formProjectTask.controlHour" :min="0" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="是否模板">
            <RadioGroup v-model="formProjectTask.template">
              <Radio label="true">是</Radio>
              <Radio label="false">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :sm="24" :xs="24">
          <FormItem prop="description" label="任务描述">
            <Input v-model="formProjectTask.description" type="textarea" :rows="2"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="postProjTask('formProjectTask')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="taskEditModal" title="修改项目任务" :mask-closable="false" :width="800" class="from-project">
      <Form ref="formEditProjectTask" :model="formEditProjectTask" :rules="taskInline" :label-width="100">
        <Row :gutter="24">
          <Col :sm="12" :xs="24">
          <FormItem prop="taskName" label="任务名称">
            <Input v-model.trim="formEditProjectTask.taskName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskCode" label="任务编码">
            <Input v-model.trim="formEditProjectTask.taskCode"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskStep" label="任务序号">
            <InputNumber v-model="formEditProjectTask.taskStep" :min="1" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskCategory" label="任务分类">
            <Select v-model="formEditProjectTask.taskCategory">
                          <Option v-for="item in projTaskCategoryList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskPriority" label="紧急度">
            <Select v-model="formEditProjectTask.taskPriority">
                          <Option v-for="item in priorityList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="taskStatus" label="任务状态">
            <Select v-model.sync="formEditProjectTask.taskStatus">
                          <Option v-for="item in projTaskStatusList" :value="item.dictionaryId" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
                        </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="startTime" label="开始日期">
            <DatePicker :editable='false' type="date" v-model="formEditProjectTask.startTime"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="finishTime" label="完成日期">
            <DatePicker :editable='false' type="date" v-model="formEditProjectTask.finishTime"></DatePicker>
          </FormItem>
          </Col>
  
          <Col :sm="12" :xs="24">
          <FormItem prop="standardHour" label="基准工时">
            <InputNumber v-model="formEditProjectTask.standardHour" :min="0" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem prop="controlHour" label="控制工时">
            <InputNumber v-model="formEditProjectTask.controlHour" :min="0" :max="10000000"></InputNumber>
          </FormItem>
          </Col>
          <Col :sm="24" :xs="24">
          <FormItem label="是否模板">
            <RadioGroup v-model="formEditProjectTask.template">
              <Radio label="true">是</Radio>
              <Radio label="false">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :sm="24" :xs="24">
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
    <Modal v-model="projectConModal" title="项目详情" :mask-closable="false" :width="800" class="pro-info">
      <div class="proj-content">
        <Row :gutter="16">
          <Col :xs="8" :sm="4">
          <div>合同编号</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div class="font-color">{{formViewProject.contractCode}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>项目名称</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div class="font-color">{{formViewProject.projectName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>项目经理</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.projManagerName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>项目总监</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.projInspectorName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>级别</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.priorityName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>分类</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.projCategoryName == null ? "暂无" :formViewProject.projCategoryName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>计划开始日期</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.planStart | moment}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>计划完成日期</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.planFinish | moment }}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>实际开始日期</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.actualStart | moment }}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>实际完成日期</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.actualFinish | moment }}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>基准工时</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.standardHour}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>控制工时</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.controlHour == null ? "暂无" :formViewProject.controlHour}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>立项时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.establishDate | moment}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>关闭时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.closeDate | moment}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>是否模板</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.template}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>状态</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div class="font-color">{{formViewProject.projStatusName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>项目描述</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div class="font-color">{{formViewProject.description == "" ? "暂无" :formViewProject.description}}</div>
          </Col>
        </Row>
        <Alert> 项目客户 </Alert>
        <Table stripe :columns="columnsClientCon" :data="clientData" :disabled-hover="true"></Table>
        <div class="page">
          <Page :total="client.total" size="small" :current="client.pageNum" :page-size="client.pageSize" show-elevator show-sizer show-total @on-change="handleClientPage" @on-page-size-change='handleClientPageSize'>
          </Page>
        </div>
        <Alert type="success"> 项目部门 </Alert>
        <Table stripe :columns="columnsProjDepCon" :data="projDepData" :disabled-hover="true"></Table>
        <Alert type="warning"> 项目员工 </Alert>
        <Table stripe :columns="columnsStaffCon" :data="staffData" :disabled-hover="true"></Table>
        <div class="page">
          <Page :total="staffPor.total" size="small" :current="staffPor.pageNum" :page-size="staffPor.pageSize" show-elevator show-sizer show-total @on-change="handleStaffPorPage" @on-page-size-change='handleStaffPorPageSize'>
          </Page>
        </div>
        <Alert type="error"> 项目任务 </Alert>
        <Table stripe :columns="columnsTaskCon" :data="taskData" :disabled-hover="true"></Table>
        <div class="page">
          <Page :total="task.total" size="small" :current="task.pageNum" :page-size="task.pageSize" show-elevator show-sizer show-total @on-change="handleTaskPage" @on-page-size-change='handleTaskPageSize'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="projectConModal=false">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="editProjStaffModal" title="修改员工信息" :mask-closable="false" :width="800" class="from-project">
      <Form ref="editStaffForm" :model="editStaffForm" :label-width="100" label-position="right" :rules="editStaffInline">
        <FormItem label="基准工时" prop="workHour">
          <InputNumber v-model.trim="editStaffForm.workHour" :min="1" :max="10000000"></InputNumber>
        </FormItem>
        <FormItem prop="roleId" label="项目角色">
          <Select v-model="editStaffForm.roleId">
                        <Option v-for="item in roleCategoryData" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                      </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="putPorjStaff">保存</Button>
      </div>
    </Modal>
    <Modal v-model="managerModal" title="添加项目经理" :mask-closable="false" :width="800">
      <Row :gutter="10">
        <Col :sm="8" :xs="24">
        <Input v-model.trim="managers.name">
        <span slot="prepend"> 姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :sm="8" :xs="24">
        <Input v-model.trim="managers.staffNumber">
        <span slot="prepend"> 工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :sm="8" :xs="24">
        <div>
          <Button type="info" @click="getProjManagers"> 查询 </Button>
          <Button @click="resetProjManagers"> 重置 </Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <div class="staff-table">
        <Table :columns="columnsProjManager" :data="projManagerData" highlight-row @on-current-change="currentProjManager"></Table>
        <div class="page">
          <Page :total="managers.total" size="small" :current="managers.pageNum" :page-size="managers.pageSize" show-elevator show-sizer show-total @on-change="handlePageManagers" @on-page-size-change='handlePageSizeManagers'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="managerSave">保存</Button>
      </div>
    </Modal>
    <!--  添加项目总监  -->
    <Modal v-model="projInspectorModal" title="添加项目总监" :mask-closable="false" :width="800">
      <Row :gutter="10">
        <Col :sm="8" :xs="24">
        <Input v-model.trim="projInspector.name">
        <span slot="prepend"> 姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :sm="8" :xs="24">
        <Input v-model.trim="projInspector.staffNumber">
        <span slot="prepend"> 工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :sm="8" :xs="24">
        <div>
          <Button type="info" @click="getProjInspector"> 查询 </Button>
          <Button @click="resetProjInspector"> 重置 </Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <div class="staff-table">
        <Table :columns="columnsProjInspector" :data="projInspectorData" highlight-row @on-current-change="currentProjInspector"></Table>
        <div class="page">
          <Page :total="projInspector.total" size="small" :current="projInspector.pageNum" :page-size="projInspector.pageSize" show-elevator show-sizer show-total @on-change="handlePageprojInspector" @on-page-size-change='handlePageSizeprojInspector'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="projInspectorSave">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  // 项目 编辑按钮
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
            vm.getProjectCon(params.row.projectId);
          }
        }
      },
      "编辑"
    );
  };
  // 项目 删除按钮
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
            vm.deletProj(params.row.projectId);
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
  // 项目 查看按钮
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
            vm.getProjectContent(params.row.projectId);
          }
        }
      },
      "查看"
    );
  };
  // 项目任务 编辑按钮
  const editTaskButton = (vm, h, params) => {
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
            vm.editProjTask(params.row.projTaskId);
          }
        }
      },
      "编辑"
    );
  };
  // 项目客户 是否主要
  const cliSwitch = (vm, h, params) => {
    return h(
      "i-switch", {
        props: {
          value: false
        },
        on: {
          "on-change": value => {
            vm.switch(params.index, value);
          }
        }
      }, [
        h(
          "span", {
            props: {
              slot: "open"
            }
          },
          "ON"
        ),
        h(
          "span", {
            props: {
              slot: "close"
            }
          },
          "OFF"
        )
      ]
    );
  };
  // 项目部门 删除按钮
  const deleteDeptButton = (vm, h, params) => {
    return h(
      "Poptip", {
        props: {
          confirm: true,
          title: "您确定要删除这条数据吗?",
          transfer: true
        },
        on: {
          "on-ok": () => {
            vm.deletProjDept(params.row.deptId);
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
  // 项目客户 删除按钮
  const deleteCliButton = (vm, h, params) => {
    return h(
      "Poptip", {
        props: {
          confirm: true,
          title: "您确定要删除这条数据吗?",
          transfer: true
        },
        on: {
          "on-ok": () => {
            vm.deletProjCli(params.row.clientId);
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
  // 项目员工 删除按钮
  const deleteStaffButton = (vm, h, params) => {
    return h(
      "Poptip", {
        props: {
          confirm: true,
          title: "您确定要删除这条数据吗?",
          transfer: true
        },
        on: {
          "on-ok": () => {
            vm.deletProjStaff(params.row.projStaffId);
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
  // 项目员工 编辑按钮
  const editStaffButton = (vm, h, params) => {
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
            vm.editProjStaff(params.row);
          }
        }
      },
      "编辑"
    );
  };
  // 项目任务 删除按钮
  const deleteTaskButton = (vm, h, params) => {
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
  // 项目员工 选择类型
  const staffSelect = (vm, h, params) => {
    return h(
      "Select", {
        props: {},
        on: {
          "on-change": value => {
            vm.onChangeStaff(params.index, value);
          }
        }
      }, [
        (function(vm) {
          let _arrH = [];
          let roleH;
          for (let i = 0; i < vm.roleCategoryData.length; i++) {
            roleH = h(
              "Option", {
                props: {
                  value: vm.roleCategoryData[i].roleId
                }
              },
              vm.roleCategoryData[i].roleName
            );
            _arrH.push(roleH);
          }
          return _arrH;
        })(vm)
      ]
    );
  };
  // 项目任务 任务序号
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
  // 项目员工 工时
  const StaffInput = (vm, h, params) => {
    return h("InputNumber", {
      props: {
        min: 0,
        step: 1,
        value: 0
      },
      on: {
        "on-blur": value => {
          vm.onBlurStaff(params.index, event.target.value);
        }
      }
    });
  };
  
  import axios from "axios";
  import moment from "moment";
  import split from "components/unit/split";
  import {
    ApiGetDict
  } from "@/api/api";
  import {
    ApiGetProj,
    ApiPostProj,
    ApiPutProj,
    ApiDeletProj,
    ApiGetProjTemplate,
    ApiGetProjCon,
    ApiGetProjDept,
    ApiGetProjCli,
    ApiGetProjStaff,
    ApiPostProjDept,
    ApiDeletProjDept,
    ApiPostProjCli,
    ApiDeletProjCli,
    ApiPostProjStaff,
    ApiPutPorjStaff,
    ApiDeletProjStaff,
    ApiGetProjStaffUnallocated,
    ApiPostProjTask,
    ApiGetRoleCategory,
    ApiGetProjManagers,
    ApiGetReportProjectExport
  } from "@/api/study/project-api";
  import {
    ApiDeletProjTask,
    ApiGetProjTaskTemplateCon,
    ApiGetProjTaskTemplate,
    ApiPutPorjTask,
    ApiGetProjTaskList
  } from "@/api/study/task-api";
  import {
    ApiGetClient
  } from "@/api/study/client-api";
  import {
    ApiGetDepartmentTree
  } from "@/api/competence/department-api";
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
        privilegeData: {
          STD_ADD: false,
          STD_IMPT: false,
          STD_EXPT: false,
          TASK_VIEW_SUPER: false,
          TASK_EDIT_SUPER: false,
          TASK_DEL_SUPER: false,
          TASK_VIEW_MD: false,
          TASK_EDIT_MD: false,
          TASK_DEL_MD: false
        },
        projCategoryCode: '', // 项目分类
        tabsVal: "",
        projectId: "",
        projectName: "",
        contractCode: "",
        projManagerName: "",
        projInspectorName: "",
        total: 0,
        pageNum: 1,
        pageSize: 10,
        template: "",
        projTaskId: "",
        templateList: [], // 模板
        projectConModal: false,
        columnsProject: [{
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
            title: "合同编号",
            key: "contractCode"
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
            title: "项目经理",
            key: "projManagerName"
          },
          {
            title: "项目总监",
            key: "projInspectorName"
          },
          {
            title: "分类",
            key: "projCategoryName"
          },
          {
            title: "状态",
            key: "projStatusName"
          },
          {
            title: "级别",
            key: "priorityName"
          },
          {
            title: "基准工时",
            key: "standardHour"
          },
          {
            title: "操作",
            key: "action",
            width: 200,
            render: (h, params) => {
              return h("div", [
                (function(vm, params) {
                  if (params.row.allowView) {
                    return viewButton(vm, h, params);
                  }
                })(this, params),
                (function(vm, params) {
                  if (params.row.allowEdit) {
                    return editButton(vm, h, params);
                  }
                })(this, params),
  
                (function(vm, params) {
                  if (params.row.allowDel) {
                    return deleteButton(vm, h, params);
                  }
                })(this, params)
              ]);
            }
          }
        ],
        projectData: [],
        projectModal: false,
        priorityList: [],
        projCategoryList: [],
        projStatusList: [],
        projTaskCategoryList: [],
        projTaskStatusList: [],
        managers: {
          name: "",
          staffNumber: "",
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        managerStaffName: "", //项目经理名字
        managerprojInspectorName: "", // 项目总监名字
        // projInspectorName: "", // 项目总监名字
        projManagerData: [], //  项目经理data
        managerModal: false,
        managerCon: {}, // 保存项目经理信息
        projInspectorCon: {}, // 保存项目总监信息
        columnsProjManager: [{
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code =
                    (vm.managers.pageNum - 1) * vm.managers.pageSize +
                    params.index +
                    1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "工号",
            key: "staffNumber"
          },
          {
            title: "姓名",
            key: "name"
          },
          {
            title: "部门",
            key: "deptName"
          },
          {
            title: "性别",
            key: "genderCode"
          }
        ],
        formNewProject: {
          projectName: "",
          contractCode: "",
          planStart: "",
          planFinish: "",
          actualStart: "",
          actualFinish: "",
          establishDate: "",
          closeDate: "",
          priority: "",
          projCategory: "",
          projStatus: "",
          apvCategory: "",
          template: "false",
          standardHour: 0,
          controlHour: 0,
          description: "",
          projInspector: "", // 项目总监 id
          projManager: "", // 项目经理id
          deptIdManager: ""
  
        },
        formViewProject: {}, //查看项目信息
        projectInline: {
          projectName: [{
              required: true,
              message: " ",
              trigger: "blur"
            },
            {
              type: "string",
              max: 64,
              message: "项目名称不能超过64位",
              trigger: "blur"
            }
          ],
          contractCode: [{
              required: true,
              message: " ",
              trigger: "blur"
            },
            {
              type: "string",
              max: 64,
              message: "合同编号不能超过64位",
              trigger: "blur"
            }
          ],
          priority: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          projCategory: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          projStatus: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          apvCategory: [{
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
          projManager: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          description: [{
            type: "string",
            max: 512,
            message: "项目描述不能超过512位",
            trigger: "blur"
          }]
        },
        projectEditInline: {
          projectName: [{
              required: true,
              message: " ",
              trigger: "blur"
            },
            {
              type: "string",
              max: 64,
              message: "项目名称不能超过64位",
              trigger: "blur"
            }
          ],
          contractCode: [{
              required: true,
              message: " ",
              trigger: "blur"
            },
            {
              type: "string",
              max: 64,
              message: "合同编号不能超过64位",
              trigger: "blur"
            }
          ],
          priority: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          projCategory: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          projStatus: [{
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }],
          apvCategory: [{
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
            max: 512,
            message: "项目描述不能超过512位",
            trigger: "blur"
          }]
        },
        projectEditModal: false,
        formEditProject: {
          projectName: "",
          contractCode: "",
          planStart: "",
          planFinish: "",
          actualStart: "",
          actualFinish: "",
          establishDate: "",
          closeDate: "",
          priority: "",
          projCategory: "",
          projStatus: "",
          apvCategory: "",
          template: "true",
          standardHour: 0,
          controlHour: 0,
          description: "",
          projInspectorName: ""
        },
        departmentModal: false,
        columnsProjDep: [{
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code =
                    (vm.deptment.pageNum - 1) * vm.deptment.pageSize +
                    params.index +
                    1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "部门编号",
            key: "deptCode",
            width: 160
          },
          {
            title: "部门名称",
            key: "deptName"
          },
          {
            title: "是否主要部门",
            key: "main",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.main ? "是" : "否";
                })(this)
              );
            }
          },
          {
            title: "添加时间",
            key: "createdtime",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.createdtime ?
                    moment(params.row.createdtime).format("YYYY-MM-DD") :
                    "";
                })(this)
              );
            }
          },
          {
            title: "操作",
            key: "action",
            width: 80,
            align: "center",
            render: (h, params) => {
              return h("div", [deleteDeptButton(this, h, params)]);
            }
          }
        ],
        projDepData: [],
        departmentTree: [],
        clientAll: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          clientName: ""
        },
        client: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          clientName: "",
          clientCode: ""
        },
        clientModal: false,
        columnsClient: [{
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code =
                    (vm.client.pageNum - 1) * vm.client.pageSize +
                    params.index +
                    1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "客户编号",
            key: "clientCode",
            width: 160
          },
          {
            title: "客户名称",
            key: "clientName"
          },
          {
            title: "是否主要",
            key: "main",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.main ? "是" : "否";
                })(this)
              );
            }
          },
          {
            title: "客户类型",
            key: "clientCategoryName"
          },
          {
            title: "添加时间",
            key: "createdtime",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.createdtime ?
                    moment(params.row.createdtime).format("YYYY-MM-DD") :
                    "";
                })(this)
              );
            }
          },
          {
            title: "操作",
            key: "action",
            width: 80,
            align: "center",
            render: (h, params) => {
              return h("div", [deleteCliButton(this, h, params)]);
            }
          }
        ],
        clientData: [],
        addClientData: [],
        selectionProjCli: [], // 所有选择的值
        columnsAddClient: [{
            title: " ",
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code =
                    (vm.clientAll.pageNum - 1) * vm.clientAll.pageSize +
                    params.index +
                    1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "客户编号",
            key: "clientCode"
          },
          {
            title: "客户名称",
            key: "clientName"
          },
          {
            title: "客户分类",
            key: "clientCategoryName"
          },
          {
            title: "是否主要客户",
            key: "action",
            width: 140,
            align: "center",
            render: (h, params) => {
              return h("div", [cliSwitch(this, h, params)]);
            }
          }
        ],
        columnsStaff: [{
            title: " ",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code =
                    (vm.staffPor.pageNum - 1) * vm.staffPor.pageSize +
                    params.index +
                    1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "工号",
            key: "staffNumber",
            width: 160
          },
          {
            title: "员工名称",
            key: "staffName"
          },
          {
            title: "工时",
            key: "workHour"
          },
          {
            title: "项目角色",
            key: "roleName"
          },
  
          {
            title: "操作",
            key: "action",
            width: 140,
            align: "center",
            render: (h, params) => {
              return h("div", [
                editStaffButton(this, h, params),
                deleteStaffButton(this, h, params)
              ]);
            }
          }
        ],
        staffData: [],
        staffModal: false,
        studyData: [],
        roleCategoryData: [], // 项目角色列表
        columnsAddStaff: [{
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "工号",
            key: "staffNumber"
          },
          {
            title: "姓名",
            key: "name"
          },
          {
            title: "部门",
            key: "deptName"
          },
          {
            title: "性别",
            key: "genderCode"
          },
          {
            title: "工时",
            key: "workHour",
            align: "center",
            render: (h, params) => {
              return h("div", [StaffInput(this, h, params)]);
            }
          },
  
          {
            title: "项目角色",
            key: "action",
            width: 140,
            align: "center",
            render: (h, params) => {
              return h("div", [staffSelect(this, h, params)]);
            }
          }
        ],
        addStaffData: [],
        staffPor: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          name: "",
          staffNumber: ""
        },
        deptment: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          deptName: "",
          deptCode: ""
        },
        staff: {
          name: "",
          staffNumber: "",
          deptName: "",
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        editProjStaffModal: false, // 修改员工信息的模态框
        editStaffInline: {},
        editStaffForm: {
          // 编辑员工信息
          workHour: 0,
          projStaffId: "",
          roleId: ""
        },
        task: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          taskName: "",
          taskCode: ""
        },
        columnsTask: [{
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
              return h("div", [taskStaffInput(this, h, params)]);
            }
          },
          {
            title: "操作",
            key: "action",
            width: 140,
            align: "center",
            render: (h, params) => {
              return h("div", [
                editTaskButton(this, h, params),
                deleteTaskButton(this, h, params)
              ]);
            }
          }
        ],
        taskData: [],
        taskModal: false,
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
            },
            {
              type: "string",
              max: 64,
              message: "任务编码不能超过64位",
              trigger: "blur"
            }
          ],
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
            message: "任务描述不能超过180位",
            trigger: "blur"
          }]
        },
        formProjectTask: {
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
        taskEditModal: false,
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
        taskTemplateList: [],
        columnsClientCon: [{
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "客户编号",
            key: "clientCode"
          },
          {
            title: "客户名称",
            key: "clientName"
          },
          {
            title: "是否主要",
            key: "main",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.main ? "是" : "否";
                })(this)
              );
            }
          },
          {
            title: "客户类型",
            key: "clientCategoryName"
          },
          {
            title: "添加时间",
            key: "createdtime",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.createdtime ?
                    moment(params.row.createdtime).format("YYYY-MM-DD") :
                    "";
                })(this)
              );
            }
          }
        ],
        columnsProjDepCon: [{
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "部门编号",
            key: "deptCode"
          },
          {
            title: "部门名称",
            key: "deptName"
          },
          {
            title: "是否主要部门",
            key: "main",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.main ? "是" : "否";
                })(this)
              );
            }
          },
          {
            title: "添加时间",
            key: "createdtime",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.createdtime ?
                    moment(params.row.createdtime).format("YYYY-MM-DD") :
                    "";
                })(this)
              );
            }
          }
        ],
        columnsStaffCon: [{
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "工号",
            key: "staffNumber"
          },
          {
            title: "员工名称",
            key: "staffName"
          },
          {
            title: "工时",
            key: "workHour"
          },
          {
            title: "项目角色",
            key: "roleName"
          }
        ],
        columnsTaskCon: [{
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
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
          }
        ],
        // 项目总监
        projInspectorModal: false,
        projInspector: {
          name: "",
          staffNumber: "",
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        columnsProjInspector: [{
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  let _code =
                    (vm.projInspector.pageNum - 1) * vm.projInspector.pageSize +
                    params.index +
                    1;
                  return _code;
                })(this)
              );
            }
          },
          {
            title: "工号",
            key: "staffNumber"
          },
          {
            title: "姓名",
            key: "name"
          },
          {
            title: "部门",
            key: "deptName"
          },
          {
            title: "性别",
            key: "genderCode"
          }
        ],
        projInspectorData: []
      };
    },
  
    methods: {
      init() {
        let me = this;
        this.getProj();
        this.getRoleCategory();
        privilege(me.privilegeData).then(function(result) {
          me.privilegeData = result;
        });
      },
      //点击出现 请求项目经理模态框
      getProjManageModalShow() {
        this.managers.staffNumber = "";
        this.managers.name = "";
        this.managerModal = true;
        this.getProjManagers();
      },
      seach() {
        this.pageNum = 1;
        this.getProj();
      },
      //请求项目经理
      getProjManagers() {
        if (this.projectId != "") {
          this.managers.projectId = this.projectId;
        } else {
          this.managers.projectId = "";
        }
        ApiGetProjManagers(this.managers).then(res => {
          if (res.code == "success") {
            this.projManagerData = res.data;
            this.managers.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
  
      // 保存项目经理信息
      currentProjManager(currentRow, oldCurrentRow) {
        this.managerCon = currentRow;
      },
      // 项目经理信息显示到页面
      managerSave() {
        this.managerModal = false;
        if (this.projectEditModal) {
          this.formEditProject.projManager = this.managerCon.staffId;
          this.formEditProject.projManagerName = this.managerCon.name;
          this.formEditProject.deptIdManager = this.managerCon.deptId
        } else {
          this.formNewProject.projManager = this.managerCon.staffId;
          this.managerStaffName = this.managerCon.name;
          this.formNewProject.deptIdManager = this.managerCon.deptId;
        }
      },
      /**
       *  是否主要责任部门方法
       *  @param  { Fun} h createElement 构建页面元素
       *  @param  { Array } root 树的根节点
       *  @param  { Object } node 当前节点
       *  @param  { Object } data 当前节点的数据
       * */
  
      renderContent(h, {
        root,
        node,
        data
      }) {
        return h(
          "span", {
            style: {
              display: "inline-block",
              width: "100%"
            }
          }, [
            h("span", [h("span", data.title)]),
            h(
              "i-switch", {
                style: {
                  display: "inline-block",
                  float: "right",
                  marginRight: "100px"
                },
                props: {
                  value: false
                },
                on: {
                  "on-change": value => {
                    this.onChangeDepSwitch(data, value);
                  }
                }
              }, [
                h(
                  "span", {
                    props: {
                      slot: "open"
                    }
                  },
                  "ON"
                ),
                h(
                  "span", {
                    props: {
                      slot: "close"
                    }
                  },
                  "OFF"
                )
              ]
            )
          ]
        );
      },
      // 项目 分页
      handlePage(value) {
        this.pageNum = value;
        this.getProj();
      },
      handlePageSize(value) {
        this.pageSize = value;
        this.getProj();
      },
      // 项目 客户分页
      handleClientPage(value) {
        this.client.pageNum = value;
        this.getProjCli();
      },
      handleClientPageSize(value) {
        this.client.pageSize = value;
        this.getProjCli();
      },
      // 所有客户分页
      handleClientAllPage(value) {
        this.clientAll.pageNum = value;
        this.addApiGetClient();
      },
      handleClientAllPageSize(value) {
        this.clientAll.pageSize = value;
        this.addApiGetClient();
      },
      // 项目下的员工分页
      handleStaffPorPage(value) {
        this.staffPor.pageNum = value;
        this.getProjStaff();
      },
      handleStaffPorPageSize(value) {
        this.staffPor.pageSize = value;
        this.getProjStaff();
      },
      // 项目下的部门分页
      handleDeptmentPage(value) {
        this.deptment.pageNum = value;
        this.getProjDept();
      },
      handledDptmentPageSize(value) {
        this.deptment.pageSize = value;
        this.getProjDept();
      },
      // 项目下的任务分页
      handleTaskPage(value) {
        this.task.pageNum = value;
        this.getProjTaskList();
      },
      handleTaskPageSize(value) {
        this.task.pageSize = value;
        this.getProjTaskList();
      },
      // 项目经理 分页
      handlePageManagers(value) {
        this.managers.pageNum = value;
        this.getProjManagers();
      },
      handlePageSizeManagers(value) {
        this.managers.pageSize = value;
        this.getProjManagers();
      },
      // 项目总监分页
      handlePageprojInspector(value) {
        this.projInspector.pageNum = value;
        this.getProjInspector();
      },
      handlePageSizeprojInspector(value) {
        this.projInspector.pageSize = value;
        this.getProjInspector();
      },
      // 选择项目类型触发事件
      projChange() {
        this.$Notice.warning({
          title:'提示',
          desc:  '注意：修改项目类型请同时修改项目下任务类型，否则将会造成统计报表数据错误！ ',
          duration: 0
        });
      },
      // 点击新建项目
      newProject() {
        this.projectId = "";
        this.projectModal = true;
        this.template = "";
        this.templateList = [];
        this.handleReset("formNewProject");
        this.getDictPriority();
        this.getDictProjCategory();
        this.getDictProjStatus();
        this.getProjTemplate();
        this.managerStaffName = "";
        this.managerprojInspectorName = "";
      },
      // 请求 项目级别
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
      // 请求 项目分类
      getDictProjCategory() {
        let dictCode = "PROJ_CATEGORY";
        let _this = this;
        ApiGetDict(dictCode).then(function(res) {
          if (res.code == "success") {
            _this.projCategoryList = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求项目状态
      getDictProjStatus() {
        let dictCode = "PROJ_STATUS";
        let _this = this;
        ApiGetDict(dictCode).then(function(res) {
          if (res.code == "success") {
            _this.projStatusList = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求 项目任务分类
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
      // 请求 项目任务状态
      getDictTaskStatus() {
        let dictCode = "TASK_STATUS";
        ApiGetDict(dictCode).then(res => {
          if (res.code == "success") {
            this.projTaskStatusList = res.data;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求 项目模版
      getProjTemplate() {
        ApiGetProjTemplate().then(res => {
          if (res.code == "success") {
            this.templateList = res.data;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求 项目列表
      getProj() {
        let _this = this;
        ApiGetProj({
          projectName: _this.projectName,
          contractCode: _this.contractCode,
          projManagerName: _this.projManagerName,
          projInspectorName: _this.projInspectorName,
          pageNum: _this.pageNum,
          pageSize: _this.pageSize
        }).then(function(res) {
          if (res.code == "success") {
            _this.projectData = res.data;
            _this.total = res.total;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      //添加项目
      postProj(name) {
        this.projectId = "";
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.formNewProject.planStart && this.formNewProject.planFinish) {
              if (
                moment(this.formNewProject.planFinish).isBefore(
                  this.formNewProject.planStart
                )
              ) {
                this.$Message.error("计划完成日期不能早于计划开始日期!");
                return false;
              }
            }
            if (
              this.formNewProject.actualStart &&
              this.formNewProject.actualFinish
            ) {
              if (
                moment(this.formNewProject.actualFinish).isBefore(
                  this.formNewProject.actualStart
                )
              ) {
                this.$Message.error("实际完成日期不能早于实际开始日期!");
                return false;
              }
            }
  
            if (
              this.formNewProject.establishDate &&
              this.formNewProject.closeDate
            ) {
              if (
                moment(this.formNewProject.closeDate).isBefore(
                  this.formNewProject.establishDate
                )
              ) {
                this.$Message.error("关闭时间不能早于立项时间!");
                return false;
              }
            }
            if (this.formNewProject.projManager == "") {
              this.$Message.error("请选择项目经理!");
              return false;
            }
            if (this.formNewProject.projInspector == "") {
              this.$Message.error("请选择项目总监!");
              return false;
            }
            delete this.formNewProject.projectId;
            delete this.formNewProject.roleId;
            delete this.formNewProject.privList;
            if (this.formNewProject.planStart) {
              this.formNewProject.planStart = moment(
                this.formNewProject.planStart
              ).format("YYYY-MM-DD");
            } else {
              delete this.formNewProject.planStart;
            }
  
            if (this.formNewProject.planFinish) {
              this.formNewProject.planFinish = moment(
                this.formNewProject.planFinish
              ).format("YYYY-MM-DD");
            } else {
              delete this.formNewProject.planFinish;
            }
  
            if (this.formNewProject.actualStart) {
              this.formNewProject.actualStart = moment(
                this.formNewProject.actualStart
              ).format("YYYY-MM-DD");
            } else {
              delete this.formNewProject.actualStart;
            }
  
            if (this.formNewProject.actualFinish) {
              this.formNewProject.actualFinish = moment(
                this.formNewProject.actualFinish
              ).format("YYYY-MM-DD");
            } else {
              delete this.formNewProject.actualFinish;
            }
            if (this.formNewProject.establishDate) {
              this.formNewProject.establishDate = moment(
                this.formNewProject.establishDate
              ).format("YYYY-MM-DD");
            } else {
              delete this.formNewProject.establishDate;
            }
  
            if (this.formNewProject.closeDate) {
              this.formNewProject.closeDate = moment(
                this.formNewProject.closeDate
              ).format("YYYY-MM-DD");
            } else {
              delete this.formNewProject.closeDate;
            }
  
            let _this = this;
            ApiPostProj(qs.stringify(_this.formNewProject)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("添加成功!");
                _this.projectModal = false;
                _this.getProj();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      },
      // 请求 项目详情
      getProjCon(projectId) {
        let _this = this;
        if (projectId) {
          ApiGetProjCon(projectId).then(function(res) {
            if (res.code == "success") {
              _this.formNewProject = res.data;
  
              _this.formNewProject.projectName = "";
              _this.formNewProject.contractCode = "";
              _this.formNewProject.projStatus = "";
              res.data.planStart == null ?
                " " :
                (_this.formNewProject.planStart = moment(
                  res.data.planStart
                ).format("YYYY-MM-DD"));
  
              res.data.planFinish == null ?
                " " :
                (_this.formNewProject.planFinish = moment(
                  res.data.planFinish
                ).format("YYYY-MM-DD"));
  
              res.data.actualStart == null ?
                " " :
                (_this.formNewProject.actualStart = moment(
                  res.data.actualStart
                ).format("YYYY-MM-DD"));
  
              res.data.actualFinish == null ?
                " " :
                (_this.formNewProject.actualFinish = moment(
                  res.data.actualFinish
                ).format("YYYY-MM-DD"));
  
              res.data.establishDate == null ?
                " " :
                (_this.formNewProject.establishDate = moment(
                  res.data.establishDate
                ).format("YYYY-MM-DD"));
  
              res.data.closeDate == null ?
                " " :
                (_this.formNewProject.closeDate = moment(
                  res.data.closeDate
                ).format("YYYY-MM-DD"));
  
              if (res.data.template) {
                _this.formNewProject.template = "true";
              } else {
                _this.formNewProject.template = "false";
              }
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      },
      //  编辑项目  请求项目详情
      getProjectCon(projectId) {
        let _this = this;
        _this.projectId = projectId;
        _this.projectEditModal = true;
        _this.tabsVal = "tabsVal1";
        _this.getDictPriority();
        _this.getDictProjCategory();
        _this.getDictProjStatus();
  
        ApiGetProjCon(projectId).then(function(res) {
          if (res.code == "success") {
            _this.projCategoryCode = res.data.projCategoryCode;
            _this.formEditProject = res.data;
            // 判断 项目级别字典 是否存在 当前 级别
            let priorityListArr = [];
            for (let i = 0; i < _this.priorityList.length; i++) {
              priorityListArr.push(_this.priorityList[i].dictionaryId);
            }
            if (!priorityListArr.includes(_this.formEditProject.priority)) {
              _this.formEditProject.priority = "";
              _this.formEditProject.priorityName = "";
            }
            // 判断 项目状态字典 是否存在 当前 状态
            let projStatusListArr = [];
            for (let i = 0; i < _this.projStatusList.length; i++) {
              projStatusListArr.push(_this.projStatusList[i].dictionaryId);
            }
            if (!projStatusListArr.includes(_this.formEditProject.projStatus)) {
              _this.formEditProject.projStatus = "";
              _this.formEditProject.projStatusName = "";
            }
  
            if (res.data.planStart) {
              _this.formEditProject.planStart = moment(res.data.planStart).format(
                "YYYY-MM-DD"
              );
            }
            if (res.data.planFinish) {
              _this.formEditProject.planFinish = moment(
                res.data.planFinish
              ).format("YYYY-MM-DD");
            }
            if (res.data.actualStart) {
              _this.formEditProject.actualStart = moment(
                res.data.actualStart
              ).format("YYYY-MM-DD");
            }
  
            if (res.data.actualFinish) {
              _this.formEditProject.actualFinish = moment(
                res.data.actualFinish
              ).format("YYYY-MM-DD");
            }
  
            if (res.data.establishDate) {
              _this.formEditProject.establishDate = moment(
                res.data.establishDate
              ).format("YYYY-MM-DD");
            }
            if (res.data.closeDate) {
              _this.formEditProject.closeDate = moment(res.data.closeDate).format(
                "YYYY-MM-DD"
              );
            }
  
            if (res.data.template) {
              _this.formEditProject.template = "true";
            } else {
              _this.formEditProject.template = "false";
            }
          }
        });
      },
      // 修改项目信息 后点击提交
      putProj(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (
              this.formEditProject.planStart &&
              this.formEditProject.planFinish
            ) {
              if (
                moment(this.formEditProject.planFinish).isBefore(
                  this.formEditProject.planStart
                )
              ) {
                this.$Message.error("计划完成日期不能早于计划开始日期!");
                return false;
              }
            }
            if (
              this.formEditProject.actualStart &&
              this.formEditProject.actualFinish
            ) {
              if (
                moment(this.formEditProject.actualFinish).isBefore(
                  this.formEditProject.actualStart
                )
              ) {
                this.$Message.error("实际完成日期不能早于实际开始日期!");
                return false;
              }
            }
            if (
              this.formEditProject.establishDate &&
              this.formEditProject.closeDate
            ) {
              if (
                moment(this.formEditProject.closeDate).isBefore(
                  this.formEditProject.establishDate
                )
              ) {
                this.$Message.error("关闭时间不能早于立项时间!");
                return false;
              }
            }
  
            if (this.formEditProject.planStart) {
              this.formEditProject.planStart = moment(
                this.formEditProject.planStart
              ).format("YYYY-MM-DD");
            } else {
              delete this.formEditProject.planStart;
            }
  
            if (this.formEditProject.planFinish) {
              this.formEditProject.planFinish = moment(
                this.formEditProject.planFinish
              ).format("YYYY-MM-DD");
            } else {
              delete this.formEditProject.planFinish;
            }
  
            if (this.formEditProject.actualStart) {
              this.formEditProject.actualStart = moment(
                this.formEditProject.actualStart
              ).format("YYYY-MM-DD");
            } else {
              delete this.formEditProject.actualStart;
            }
  
            if (this.formEditProject.actualFinish) {
              this.formEditProject.actualFinish = moment(
                this.formEditProject.actualFinish
              ).format("YYYY-MM-DD");
            } else {
              delete this.formEditProject.actualFinish;
            }
            if (this.formEditProject.establishDate) {
              this.formEditProject.establishDate = moment(
                this.formEditProject.establishDate
              ).format("YYYY-MM-DD");
            } else {
              delete this.formEditProject.establishDate;
            }
  
            if (this.formEditProject.closeDate) {
              this.formEditProject.closeDate = moment(
                this.formEditProject.closeDate
              ).format("YYYY-MM-DD");
            } else {
              delete this.formEditProject.closeDate;
            }
            let _this = this;
            ApiPutProj(qs.stringify(_this.formEditProject)).then(function(res) {
              if (res.code == "success") {
                _this.$Message.success("修改成功!");
                _this.projectEditModal = false;
                _this.getProj();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      },
      // 删除项目
      deletProj(projectId) {
        let _this = this;
        ApiDeletProj(projectId).then(function(res) {
          if (res.code == "success") {
            //如果当前表格数据只有一条，则请求上一页
            if (_this.projectData.length == 1) {
              _this.pageNum = _this.pageNum > 1 ? --_this.pageNum : 1;
            }
            _this.getProj();
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 点击 项目 查看按钮
      getProjectContent(projectId) {
        this.projectId = projectId;
        ApiGetProjCon(projectId).then(res => {
          if (res.code == "success") {
            this.formViewProject = res.data;
            this.formViewProject.template = this.formViewProject.template ?
              "是" :
              "否";
            this.projectConModal = true;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
        this.client.pageNum = 1;
        this.client.pageSize = 10;
        this.client.clientName = "";
  
        this.staffPor.pageNum = 1;
        this.staffPor.pageSize = 10;
        this.staffPor.staffNumber = "";
        this.staffPor.name = "";
  
        this.task.pageNum = 1;
        this.task.pageSize = 10;
        this.task.taskName = "";
        this.task.taskCode = "";
  
        this.deptment.pageNum = 1;
        this.deptment.pageSize = 10;
        this.deptment.deptName = "";
        this.deptment.deptCode = "";
  
        this.getProjCli();
        this.getProjDept();
        this.getProjStaff();
        this.getProjTaskList();
      },
      // 点击 切换 tabs
      onClickTabs(index) {
        if (index == 1) {
          // 项目客户
          this.client.pageNum = 1;
          this.client.pageSize = 10;
          this.client.clientName = "";
          this.getProjCli();
        } else if (index == 2) {
          // 项目部门
          this.deptment.pageNum = 1;
          this.deptment.pageSize = 10;
          this.deptment.deptName = "";
          this.deptment.deptCode = "";
          this.getProjDept();
        } else if (index == 3) {
          // 项目员工
          this.staffPor.pageNum = 1;
          this.staffPor.pageSize = 10;
          this.staffPor.staffNumber = "";
          this.staffPor.name = "";
          this.getProjStaff();
        } else if (index == 4) {
          // 项目任务
          this.task.pageNum = 1;
          this.task.pageSize = 10;
          this.task.taskName = "";
          this.task.taskCode = "";
          this.getProjTaskList();
        }
      },
      // 请求项目客户列表
      getProjCli() {
        let data = {
          projectId: this.projectId,
          pageNum: this.client.pageNum,
          pageSize: this.client.pageSize,
          clientName: this.client.clientName,
          clientCode: this.client.clientCode
        };
        ApiGetProjCli(data).then(res => {
          if (res.code == "success") {
            this.clientData = res.data;
            this.client.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      //请求项目部门列表
      getProjDept() {
        this.deptment.projectId = this.projectId;
        ApiGetProjDept(this.deptment).then(res => {
          if (res.code == "success") {
            this.projDepData = res.data;
            this.deptment.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求项目员工列表
      getProjStaff() {
        let data = {
          projectId: this.projectId,
          pageNum: this.staffPor.pageNum,
          pageSize: this.staffPor.pageSize,
          name: this.staffPor.name,
          staffNumber: this.staffPor.staffNumber
        };
        ApiGetProjStaff(data).then(res => {
          if (res.code == "success") {
            this.staffData = res.data;
            this.staffPor.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求项目任务列表
      getProjTaskList() {
        let data = {
          projectId: this.projectId,
          pageNum: this.task.pageNum,
          pageSize: this.task.pageSize,
          taskName: this.task.taskName,
          taskCode: this.task.taskCode
        };
        ApiGetProjTaskList(data).then(res => {
          if (res.code == "success") {
            this.taskData = res.data;
            this.task.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 点击 添加项目部门
      addPorjDep() {
        let _this = this;
        _this.departmentModal = true;
        ApiGetDepartmentTree().then(function(res) {
          if (res.code == "success") {
            _this.departmentTree = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      /**
       * 选择项目是否主要客户按钮
       * @param  { Object } data 当前数据
       * @param   { Boolean } value 返回当前开关状态
       */
      onChangeDepSwitch(data, value) {
        if (value) {
          data.main = true;
        } else {
          data.main = false;
        }
      },
      // 新建项目客户 保存方法
      postProjDept() {
        let _this = this;
        let projDeptList = [];
        let checkedNodes = _this.$refs.tree.getCheckedNodes();
        if (checkedNodes <= 0) {
          _this.$Message.warning("请选择要添加的部门!");
        } else {
          for (let i = 0; i < checkedNodes.length; i++) {
            let projDeptData = {};
            if (checkedNodes[i].main) {
              projDeptData.main = true;
            } else {
              projDeptData.main = false;
            }
            projDeptData.projectId = _this.projectId;
            projDeptData.deptId = checkedNodes[i].deptId;
            projDeptList.push(projDeptData);
          }
          ApiPostProjDept(projDeptList).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("添加成功!");
              _this.departmentModal = false;
              _this.getProjDept();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      },
      // 删除项目客户
      deletProjDept(deptId) {
        let _this = this;
        let id = _this.projectId + "/" + deptId;
        ApiDeletProjDept(id).then(function(res) {
          if (res.code == "success") {
            _this.$Message.success("删除成功!");
            _this.getProjDept();
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 添加项目客户
      addprojCli() {
        this.clientModal = true;
        this.selectionProjCli = [];
        this.clientAll.clientName = "";
        this.clientAll.pageNum = 1;
        this.clientAll.pageSize = 10;
        this.addApiGetClient();
      },
      addApiGetClient() {
        let data = {
          pageNum: this.clientAll.pageNum,
          pageSize: this.clientAll.pageSize,
          clientName: this.clientAll.clientName
        };
        ApiGetClient(data).then(res => {
          if (res.code == "success") {
            this.addClientData = res.data;
            this.clientAll.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      /**
       * 获取选中的数据
       * @param { Arr} selection 返回所有选中的data
       * @param { Object} row 返回当前选中data
       */
      onSelectProjCli(selection, row) {
        this.selectionProjCli = selection;
      },
      /**
       判断switch 开关 
       @param {index}   下标params.index是拿到table的行序列，可以取到对应的表格值  
       @param {Boolean} value 返回当前的状态 true | false
      */
      switch (index, value) {
        if (this.selectionProjCli.length > 0) {
          for (let i = 0; i < this.selectionProjCli.length; i++) {
            if (
              this.selectionProjCli[i].clientId ==
              this.addClientData[index].clientId
            ) {
              if (value) {
                this.selectionProjCli[i].main = true;
              } else {
                this.selectionProjCli[i].main = false;
              }
            }
          }
        } else {
          if (value) {
            this.addClientData[index].main = true;
          } else {
            this.addClientData[index].main = false;
          }
        }
      },
      // 保存 新建的项目客户
      postProjCli() {
        let _this = this;
        let projCliList = [];
        if (_this.selectionProjCli.length <= 0) {
          _this.$Message.warning("请选择要添加的客户!");
        } else {
          for (let i = 0; i < _this.selectionProjCli.length; i++) {
            let projCliData = {};
            if (_this.selectionProjCli[i].main) {
              projCliData.main = true;
            } else {
              projCliData.main = false;
            }
            projCliData.projectId = _this.projectId;
            projCliData.clientId = _this.selectionProjCli[i].clientId;
            projCliList.push(projCliData);
          }
          ApiPostProjCli(projCliList).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("添加成功!");
              _this.clientModal = false;
              _this.getProjCli();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      },
      // 删除项目客户
      deletProjCli(clientId) {
        let _this = this;
        let id = _this.projectId + "/" + clientId;
        ApiDeletProjCli(id).then(function(res) {
          if (res.code == "success") {
            _this.getProjCli();
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 请求 项目角色列表
      getRoleCategory() {
        let _this = this;
        ApiGetRoleCategory().then(function(res) {
          if (res.code == "success") {
            _this.roleCategoryData = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 点击项目 添加员工方法
      addprojStaffShow() {
        this.staffModal = true;
        this.staff.name = "";
        this.staff.staffNumber = "";
        this.staff.deptName = "";
        this.staff.pageNum = 1;
        this.staff.pageSize = 10;
        this.addprojStaff();
      },
      // 查询 项目员工方法
      addprojStaff() {
        let _this = this;
        _this.selectionProjCli = [];
        ApiGetProjStaffUnallocated({
          projectId: _this.projectId,
          name: _this.staff.name,
          staffNumber: _this.staff.staffNumber,
          deptName: _this.staff.deptName,
          pageNum: _this.staff.pageNum,
          pageSize: _this.staff.pageSize
        }).then(function(res) {
          if (res.code == "success") {
            _this.addStaffData = res.data;
            _this.staff.total = res.total;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 点击 修改项目员工信息
      editProjStaff(row) {
        this.editStaffForm.roleId = row.roleId;
        this.editStaffForm.projStaffId = row.projStaffId;
        this.editStaffForm.workHour = row.workHour;
        this.editProjStaffModal = true;
      },
      // 保存 修改完成后的 项目员工信息
      putPorjStaff() {
        let _this = this;
        ApiPutPorjStaff(qs.stringify(_this.editStaffForm)).then(function(res) {
          if (res.code == "success") {
            _this.$Message.success("修改成功!");
            _this.editProjStaffModal = false;
            _this.getProjStaff();
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      /**
       * 项目添加员工选择 员工类型
       * @param index  当前数据的下标
       * @param  {Number} value 当前选中的 项目角色Id
       */
      onChangeStaff(index, value) {
        let selectionProjCliLet = this.selectionProjCli;
        if (selectionProjCliLet.length > 0) {
          for (let i = 0; i < selectionProjCliLet.length; i++) {
            if (
              selectionProjCliLet[i].staffId == this.addStaffData[index].staffId
            ) {
              selectionProjCliLet[i].roleId = value;
              this.addStaffData[i].roleId = value;
            } else {
              this.addStaffData[index].roleId = value;
            }
          }
          this.selectionProjCli = selectionProjCliLet;
        } else {
          this.addStaffData[index].roleId = value;
        }
      },
      /**
       * 项目添加员工选择 工时
       * @param index  当前数据的下标
       * @param  { Number } value 当前输入的 工时
       */
      onBlurStaff(index, value) {
        if (this.selectionProjCli.length > 0) {
          for (let i = 0; i < this.selectionProjCli.length; i++) {
            if (
              this.selectionProjCli[i].staffId == this.addStaffData[index].staffId
            ) {
              this.selectionProjCli[i].workHour = value;
              this.addStaffData[i].workHour = value;
            } else {
              this.addStaffData[index].workHour = value;
            }
          }
        } else {
          this.addStaffData[index].workHour = value;
        }
      },
      // 添加 项目员工
      postProjStaff() {
        let _this = this;
        let projStaffList = [];
        if (_this.selectionProjCli.length <= 0) {
          _this.$Message.warning("请选择要添加的员工!");
        } else {
          for (let i = 0; i < _this.selectionProjCli.length; i++) {
            let projStaffData = {};
  
            projStaffData.projectId = _this.projectId;
            projStaffData.staffId = _this.selectionProjCli[i].staffId;
            projStaffData.roleId = _this.selectionProjCli[i].roleId;
            projStaffData.workHour = _this.selectionProjCli[i].workHour;
  
            if (
              _this.selectionProjCli[i].staffId &&
              _this.selectionProjCli[i].roleId
            ) {
              projStaffList.push(projStaffData);
            } else {
              _this.$Message.warning("请选择员工的项目角色!");
              return false;
            }
          }
          ApiPostProjStaff(projStaffList).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("添加成功!");
              _this.staffModal = false;
              _this.getProjStaff();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
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
        } else {
          ApiPutPorjTask(qs.stringify(data)).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功!");
              _this.getProjTaskList();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      },
      // 项目员工分页
      handlePageStaff(value) {
        this.staff.pageNum = value;
        this.addprojStaff();
      },
      handlePageSizeStaff(value) {
        this.staff.pageSize = value;
        this.addprojStaff();
      },
      // 删除 项目员工
      deletProjStaff(projStaffId) {
        let _this = this;
        ApiDeletProjStaff(projStaffId).then(function(res) {
          if (res.code == "success") {
            _this.getProjStaff();
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 添加 项目任务
      addProjTask() {
        let _this = this;
        _this.taskTemplateList = [];
        _this.projTaskId = "";
        _this.taskModal = true;
        _this.$refs["formProjectTask"].resetFields();
        _this.getDictPriority();
        _this.getDictTaskCategory();
        _this.getDictTaskStatus();
        _this.getProjTaskTemplate();
      },
      // 获取项目任务模版
      getProjTaskTemplate() {
        let _this = this;
        ApiGetProjTaskTemplate().then(function(res) {
          if (res.code == "success") {
            _this.taskTemplateList = res.data;
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 获取当前项目任务模版 详情
      getProjTaskTemplateCon(projTaskId) {
        let _this = this;
        if (projTaskId) {
          ApiGetProjTaskTemplateCon(projTaskId).then(function(res) {
            if (res.code == "success") {
              _this.formProjectTask = res.data;
              _this.formProjectTask.taskCode = "";
              _this.formProjectTask.taskName = "";
              _this.formProjectTask.taskStatus = "";
  
              if (_this.formProjectTask.startTime) {
                _this.formProjectTask.startTime = moment(
                  res.data.startTime
                ).format("YYYY-MM-DD");
              }
              if (_this.formProjectTask.finishTime) {
                _this.formProjectTask.finishTime = moment(
                  res.data.finishTime
                ).format("YYYY-MM-DD");
              }
  
              if (_this.formProjectTask.template) {
                _this.formProjectTask.template = "true";
              } else {
                _this.formProjectTask.template = "false";
              }
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      },
      // 修改项目任务，获取项目任务详情
      editProjTask(projTaskId) {
        let _this = this;
        _this.getDictPriority();
        _this.getDictTaskCategory();
        _this.getDictTaskStatus();
        ApiGetProjTaskTemplateCon(projTaskId).then(function(res) {
          if (res.code == "success") {
            _this.taskEditModal = true;
            _this.formEditProjectTask = res.data;
  
            let priorityListArr = [];
            for (let i = 0; i < _this.priorityList.length; i++) {
              priorityListArr.push(_this.priorityList[i].dictionaryId);
            }
            if (!priorityListArr.includes(_this.formEditProjectTask.taskPriority)) {
              _this.formEditProjectTask.taskPriority = "";
              _this.formEditProjectTask.priorityName = "";
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
  
            if (_this.formEditProjectTask.startTime) {
              _this.formEditProjectTask.startTime = moment(
                _this.formEditProjectTask.startTime
              ).format("YYYY-MM-DD");
            }
            if (_this.formEditProjectTask.finishTime) {
              _this.formEditProjectTask.finishTime = moment(
                _this.formEditProjectTask.finishTime
              ).format("YYYY-MM-DD");
            }
  
            if (_this.formEditProjectTask.template) {
              _this.formEditProjectTask.template = 'true';
            } else {
              _this.formEditProjectTask.template = 'false';
            }
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 新增 项目任务 添加保存
      postProjTask(name) {
        let _this = this;
        _this.formProjectTask.projectId = _this.projectId;
        _this.$refs[name].validate(valid => {
          if (valid) {
            if (
              _this.formProjectTask.startTime &&
              _this.formProjectTask.finishTime
            ) {
              if (
                (_this.formProjectTask.startTime = moment(
                  _this.formProjectTask.startTime
                ).format("YYYY-MM-DD")) >
                (_this.formProjectTask.finishTime = moment(
                  _this.formProjectTask.finishTime
                ).format("YYYY-MM-DD"))
              ) {
                _this.$Message.success("完成日期必须大于开始日期!");
                return false;
              }
            }
            if (_this.formProjectTask.startTime) {
              _this.formProjectTask.startTime = moment(
                _this.formProjectTask.startTime
              ).format("YYYY-MM-DD");
            } else {
              delete _this.formProjectTask.startTime;
            }
  
            if (_this.formProjectTask.finishTime) {
              _this.formProjectTask.finishTime = moment(
                _this.formProjectTask.finishTime
              ).format("YYYY-MM-DD");
            } else {
              delete _this.formProjectTask.finishTime;
            }
  
            delete _this.formProjectTask.projTaskId;
            delete _this.formProjectTask.createdby;
            delete _this.formProjectTask.createdtime;
            delete _this.formProjectTask.updatedby;
            delete _this.formProjectTask.updatedtime;
            ApiPostProjTask(qs.stringify(_this.formProjectTask)).then(function(
              res
            ) {
              if (res.code == "success") {
                _this.$Message.success("添加成功!");
                _this.taskModal = false;
                _this.getProjTaskList();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      },
      //修改项目任务 点击保存
      putPorjTask(name) {
        let _this = this;
        _this.$refs[name].validate(valid => {
          if (valid) {
            if (
              _this.formEditProjectTask.startTime &&
              _this.formEditProjectTask.finishTime
            ) {
              if (
                (_this.formEditProjectTask.startTime = moment(
                  _this.formEditProjectTask.startTime
                ).format("YYYY-MM-DD")) >
                (_this.formEditProjectTask.finishTime = moment(
                  _this.formEditProjectTask.finishTime
                ).format("YYYY-MM-DD"))
              ) {
                _this.$Message.success("完成日期必须大于开始日期!");
                return false;
              }
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
                _this.getProjTaskList();
              } else {
                if (resCode[res.code]) {
                  _this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      },
      // 删除项目任务
      deletProjTask(projTaskId) {
        let _this = this;
        ApiDeletProjTask(projTaskId).then(function(res) {
          if (res.code == "success") {
            _this.$Message.success("删除成功!");
            _this.getProjTaskList();
          } else {
            if (resCode[res.code]) {
              _this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 点击出现项目总监
      projInspectorModalShow() {
        this.projInspector.staffNumber = "";
        this.projInspector.name = "";
        this.projInspector.pageNum = 1;
        this.projInspector.pageSize = 10;
        this.projInspectorModal = true;
        this.getProjInspector();
      },
      // 请求项目总监
      getProjInspector() {
        if (this.projectId != "") {
          this.projInspector.projectId = this.projectId;
        } else {
          this.projInspector.projectId = "";
        }
        ApiGetProjManagers(this.projInspector).then(res => {
          if (res.code == "success") {
            this.projInspectorData = res.data;
            this.projInspector.total = res.total;
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      },
      // 保存项目总监信息
      currentProjInspector(currentRow, oldCurrentRow) {
        this.projInspectorCon = currentRow;
      },
      // 项目总监显示到页面上
      projInspectorSave() {
        this.projInspectorModal = false;
        if (this.projectEditModal) {
          this.formEditProject.projInspector = this.projInspectorCon.staffId;
          this.formEditProject.projInspectorName = this.projInspectorCon.name;
        } else {
          this.formNewProject.projInspector = this.projInspectorCon.staffId;
          this.managerprojInspectorName = this.projInspectorCon.name;
        }
      },
      // 重置项目
      resetProject() {
        this.projectName = "";
        this.contractCode = "";
        this.projManagerName = "";
        this.deptIdManager = "";
        this.projInspectorName = "";
        this.getProj();
      },
      // 重置 任务
      resetTask() {
        this.task.taskName = "";
        this.task.taskCode = "";
        this.getProjTaskList();
      },
      // 重置项目 客户
      resetClient() {
        this.client.clientName = "";
        this.getProjCli();
      },
      // 重置未添加的 项目客户
      resetAddClient() {
        this.clientAll.clientName = "";
      },
      // 重置项目员工
      resetStaff() {
        this.staffPor.name = "";
        this.staffPor.staffNumber = "";
        this.staffPor.pageNum = 1;
        this.staffPor.pageSize = 10;
        this.getProjStaff();
      },
      // 重置 未添加的项目员工
      resetProjStaff() {
        this.staff.name = "";
        this.staff.staffNumber = "";
        this.staff.deptName = "";
        this.staff.pageNum = 1;
        this.staff.pageSize = 10;
        this.addprojStaff();
      },
      // 重置 项目经理
      resetProjManagers() {
        this.managers.staffNumber = "";
        this.managers.name = "";
        this.getProjManagers();
      },
      // 重置 项目下的部门
      resetDeptment() {
        this.deptment.pageNum = 1;
        this.deptment.pageSize = 10;
        this.deptment.deptName = "";
        this.deptment.deptCode = "";
        this.getProjDept();
      },
      // 重置 项目总监
      resetProjInspector() {
        this.projInspector.staffNumber = "";
        this.projInspector.name = "";
        this.getProjInspector();
      },
      // 清除 form表单
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      // 导出
      getReportProjectExport() {
        let _data = {
          projectName: this.projectName,
          contractCode: this.contractCode,
          projManagerName: this.projManagerName,
          projInspectorName: this.projInspectorName
        };
        ApiGetReportProjectExport(_data).then(data => {
          if (!data) {
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `项目报表.xlsx`);
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
    mounted() {
      this.init();
    }
  };
</script>

<style lang="scss">
  @import "../../common/css/base";
  @import "../../common/css/variable.scss";
  .dep-p {
    text-align: right;
    margin-right: 40px;
  }
  
  .font-color {
    color: $font-dark-color;
  }
  
  .from-project {
    .ivu-date-picker {
      display: initial;
    }
    .ivu-input-number {
      width: 100%;
    }
    .ivu-input-group-prepend {
      width: 100px;
    }
  }
  
  .client-div {
    .ivu-input-group-prepend {
      width: 60px;
    }
  }
  
  .proj-content {
    .ivu-col {
      margin-bottom: 10px;
    }
    .ivu-alert {
      margin-top: 10px;
      margin-bottom: 0;
    }
  }
  
  .manager-a {
    float: right;
  }
  
  .pro-info {
    .ivu-alert {
      border-bottom-right-radius: 0px;
      border-bottom-left-radius: 0px;
      border-bottom: none;
    }
  }
  
  .manager-staff {
    .ivu-form-item-label:before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed3f14;
    }
  }
  
  .gorj-data-div {
    max-height: 590px;
    overflow: auto;
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
