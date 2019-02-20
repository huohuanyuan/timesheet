<template>
  <div>
    <Row>
      <Button type="info" @click="showAddAttModel" v-if="privilegeData.ATT_GRP_ADD">新增</Button>
      <split></split>
    </Row>
    <!-- 考勤组列表start -->
    <Table :columns="attGroupCol" :data="attGroupData">

    </Table>
    <div class="page">
      <Page :total="attGroupPaging.total" size="small" :current="attGroupPaging.current" :page-size="attGroupPaging.size" show-elevator show-sizer show-total @on-change="changeAttGroupPage" @on-page-size-change='changeAttGroupPageSize'>
      </Page>
    </div>
    <!-- 考勤组列表end -->
    <!-- 新增考勤组信息modal -->
    <Modal v-model="newAttGroupModal" title="添加考勤组" width="800" class="att-modal">
      <Form ref="addAttForm" :model="addAttForm" :rules="addAttValidate" :label-width="120">
        <Row>
          <Col :xs="24" :sm="24">
          <FormItem label="考勤组名称" prop="attendanceGroupName">
            <Input type="text" v-model="addAttForm.attendanceGroupName"></Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="上班时间" prop="onDutyTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="addAttForm.onDutyTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="上班最晚时间" prop="onDutyLastTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="addAttForm.onDutyLastTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="下班时间" prop="offDutyTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="addAttForm.offDutyTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="基准工作时间" prop="workTime">
            <InputNumber :min="1" :step="0.5" :formatter="value => `${value}小时`" :parser="value => value.replace('小时', '')" v-model="addAttForm.workTime"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="午餐开始时间" prop="lunchStartTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="addAttForm.lunchStartTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="午餐结束时间" prop="lunchEndTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="addAttForm.lunchEndTime"></TimePicker>
          </FormItem>
          </Col>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="迟到不超过时间" prop="lateLimitTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="addAttForm.lateLimitTime"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <p slot="footer">
        <Button long type="primary" @click="addAttGroup('addAttForm')">保存</Button>
      </p>
    </Modal>
    <!-- 编辑考勤组信息start -->
    <Modal v-model="editAttGroupModal" title="编辑考勤组" width="800" class="att-modal">
      <Form ref="editAttForm" :model="editAttForm" :rules="editValidate" :label-width="120">
        <Row>
          <Col :xs="24" :sm="24">
          <FormItem label="考勤组名称" prop="attendanceGroupName">
            <Input type="text" v-model="editAttForm.attendanceGroupName"></Input>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="上班时间" prop="onDutyTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="editAttForm.onDutyTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="上班最晚时间" prop="onDutyLastTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="editAttForm.onDutyLastTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="下班时间" prop="offDutyTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="editAttForm.offDutyTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="基准工作时间" prop="workTime">
            <InputNumber :min="1" :step="0.5" :formatter="value => `${value}小时`" :parser="value => value.replace('小时', '')" v-model="editAttForm.workTime"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="午餐开始时间" prop="lunchStartTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="editAttForm.lunchStartTime"></TimePicker>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="午餐结束时间" prop="lunchEndTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="editAttForm.lunchEndTime"></TimePicker>
          </FormItem>
          </Col>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="迟到不超过时间" prop="lateLimitTime">
            <TimePicker :editable='false' :clearable='false' type="time" format="HH:mm:ss" v-model="editAttForm.lateLimitTime"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <p slot="footer">
        <Button long type="primary" @click="putAttendanceGroup('editAttForm')">保存</Button>
      </p>
    </Modal>
    <!-- 编辑考勤组信息end -->
    <!-- 地图选择modal -->
    <Modal v-model="mapModal" width="1200" class="map-model" title="地图选择" class-name="map-div">
      <baidu-map center="北京" :zoom="zoom" class="bm-view map" ak="TFGUKfDjqficY27C7P9v496z9TTt2Vig" @click="getClickInfo" :scroll-wheel-zoom="true" :isOpen="true" style="height: 500px">
        <!--  城市列表  -->
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"> </bm-city-list>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"> </bm-navigation>
        <!-- 地址标签 -->
        <bm-marker :position="attPosition" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
      </baidu-map>
      <div slot="footer" class="map-footer">
        <div>
          <span v-show="attPosition.address">{{attPosition.address}}</span>
          <span v-show="attPosition.lng">经度{{attPosition.lng}}</span>
          <span v-show="attPosition.lat">维度：{{attPosition.lat}}</span>
        </div>
        <Button type="primary" @click="savePosition">确定</Button>
      </div>
    </Modal>

    <!--  考勤点模态框  -->
    <Modal v-model="locationModal" width="800" title="考勤点">
      <Row :gutter="10">
        <Col :md="12" :sm="12">
        <Input v-model="location.address">
        <span slot="prepend"> 地址 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="12" :sm="12">
        <div>
          <Button type="info" @click="getAttendanceLocationList"> 查询 </Button>
          <Button @click="resetLocation"> 重置 </Button>
          <Button type="primary" @click="addLocationFun">新增</Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <split></split>
      <div>
        <Table stripe :columns="locationColumns" :data="locationData"></Table>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <!--  点击添加 考勤点模态框  -->
    <Modal v-model="addLocationModal" width="800" title="添加新考勤点" class="att-modal">
      <Form ref="addLocationForm" :model="addLocationForm" :rules="addLocationRule" :label-width="120">
        <Row>
          <Col :xs="24" :sm="24">
          <FormItem label="考勤范围精度" prop="accuracy">
            <InputNumber :min="1" v-model="addLocationForm.accuracy" :formatter="value => `${value}米`" :parser="value => value.replace('米', '')"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24">
          <FormItem label="考勤地点" class="location">
            <span> {{addLocationForm.address}} </span>
            <a @click="mapModalFun">选择考勤点</a>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12" v-show="addLocationForm.longitude">
          <FormItem label="经度">
            {{addLocationForm.longitude}}
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="纬度" v-show="addLocationForm.latitude">
            {{addLocationForm.latitude}}
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="postAttendanceGroup('addLocationForm')" long> 保存 </Button>
      </div>
    </Modal>
    <!--  修改考勤点 信息  -->
    <Modal v-model="editLocationModal" width="800" title="添加新考勤点" class="att-modal">
      <Form ref="editLocationForm" :model="editLocationForm" :rules="editLocationRule" :label-width="120">
        <Row>
          <Col :xs="24" :sm="24">
          <FormItem label="考勤范围精度" prop="accuracy">
            <InputNumber :min="1" v-model="editLocationForm.accuracy" :formatter="value => `${value}米`" :parser="value => value.replace('米', '')"></InputNumber>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="24">
          <FormItem label="考勤地点" class="location">
            <span> {{editLocationForm.address}} </span>
            <a @click="mapModalFun">选择考勤点</a>
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="经度">
            {{editLocationForm.longitude}}
          </FormItem>
          </Col>
          <Col :xs="24" :sm="12">
          <FormItem label="纬度">
            {{editLocationForm.latitude}}
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="putAttendanceLocation('addLocationForm')" long> 保存 </Button>
      </div>
    </Modal>
    <!-- 考勤组员工 midal-->
    <Modal v-model="groupMenberModal" width="800" class="map-model" title="考勤组员工">
      <Row :gutter="10">
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model="group.staffName">
        <span slot="prepend"> 姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model="group.staffNumber">
        <span slot="prepend"> 工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model="group.deptName">
        <span slot="prepend"> 部门 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <div>
          <Button type="info" @click="getAttendanceGroupSatff"> 查询 </Button>
          <Button @click="resetGroup"> 重置 </Button>
          <Button type="primary" @click="addGroupModalShow">新增</Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <div>
        <Table stripe :columns="columnsGroup" :data="groupData"></Table>
        <div class="page">
          <Page :total="group.total" size="small" :current="group.pageNum" :page-size="group.pageSize" show-elevator show-sizer show-total @on-change="handleGroupPage" @on-page-size-change='handleGroupPageSize'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="groupMenberModal=false">关闭</Button>
      </div>
    </Modal>
    <!-- 添加考勤组员工 -->
    <Modal v-model="addGroupModal" width="800" title="添加考勤组员工">
      <Row :gutter="10">
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model="nogroup.staffName">
        <span slot="prepend"> 姓名 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model="nogroup.staffNumber">
        <span slot="prepend"> 工号 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <Input v-model="nogroup.deptName">
        <span slot="prepend"> 部门 </span>
        </Input>
        <split></split>
        </Col>
        <Col :md="6" :sm="12" :xs="24">
        <div>
          <Button type="info" @click="getAttendanceGroupNoSatff"> 查询 </Button>
          <Button @click="resetNoGroup"> 重置 </Button>
        </div>
        <split></split>
        </Col>
      </Row>
      <split></split>
      <div>
        <Table stripe :columns="columnsNoGroup" :data="noGroupData" @on-select="onSelectStaff" @on-select-all="onSelectStaff" @on-select-cancel="onSelectStaff"></Table>
        <div class="page">
          <Page :total="nogroup.total" size="small" :current="nogroup.pageNum" :page-size="nogroup.pageSize" show-elevator show-sizer show-total @on-change="handleNoGroupPage" @on-page-size-change='handleNoGroupPageSize'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="putAttendanceGroupAddStaff">保存</Button>
      </div>
    </Modal>
    <!-- 查看考勤组详情 -->
    <Modal v-model="groupInfoModal" width="800" title="考勤组详情">
      <div class="group-info">
        <Row :gutter="16">
          <Col :xs="8" :sm="4">
          <div>考勤组名称</div>
          </Col>
          <Col :xs="16" :sm="20">
          <div>{{editAttForm.attendanceGroupName}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>上班时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.onDutyTime}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>上班最晚时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.onDutyLastTime}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>下班时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.offDutyTime}}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>基准工作时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.workTime}}小时</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>午餐开始时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.lunchStartTime }}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>午餐结束时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.lunchEndTime }}</div>
          </Col>
          <Col :xs="8" :sm="4">
          <div>迟到不超过时间</div>
          </Col>
          <Col :xs="16" :sm="8">
          <div>{{editAttForm.lateLimitTime }}</div>
          </Col>
        </Row>
        <Alert> 考勤组员工 </Alert>
        <Table stripe :columns="columnsSafttInfo" :data="staffInfoData">
        </Table>
        <div class="page">
          <Page :total="staffInfo.total" size="small" :current="staffInfo.pageNum" :page-size="staffInfo.pageSize" show-elevator show-sizer show-total @on-change="handleSafttInfoPage" @on-page-size-change='handleStaffInfoPageSize'>
          </Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="groupInfoModal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
import split from "components/unit/split";
import {
  apiAddAttendanceGroup,
  apiGetAttGroupList,
  apiGetAttGroupDetail,
  ApiPutAttendanceGroup,
  ApiDeletAttendanceGroup,
  ApiGetAttendanceGroupSatff,
  ApiGetAttendanceGroupNoSatff,
  ApiPutAttendanceGroupAddStaff,
  ApiDeletAttendanceGroupStaff,
  ApiPostAttendanceGroup,
  ApiGetAttendanceLocationList,
  ApiDeletAttendanceLocation,
  ApiGetGroupLocation,
  ApiPutAttendanceLocation
} from "@/api/attendance/att-group-api.js";
import moment from "moment";
import Cookies from "js-cookie";
import qs from "qs";
import { resCode } from "@/api/code";
import { privilege } from "common/js/privilege";
const viewButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "success"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.viewAttGroup(params.row.attendanceGroupId);
        }
      }
    },
    "查看"
  );
};
const editButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "primary"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.getAttGroupDetail(params.row.attendanceGroupId);
        }
      }
    },
    "编辑"
  );
};
const deleteButton = (vm, h, params) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: "您确定要删除这条数据吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          vm.deleteAttGroup(params.row.attendanceGroupId);
        }
      }
    },
    [
      h(
        "Button",
        {
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
const deleteStaffButton = (vm, h, params) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: "您确定要删除这条数据吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          vm.deletAttendanceGroupStaff(params.row.staff_id);
        }
      }
    },
    [
      h(
        "Button",
        {
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
const attGroupMenber = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "info"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.viewAttGroupMenber(params.row.attendanceGroupId);
        }
      }
    },
    "考勤组员工"
  );
};
// 考勤点
const locationButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "warning"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.locationFun(params.row.attendanceGroupId);
        }
      }
    },
    "考勤点"
  );
};
//
const editLocaButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "primary"
      },
      style: {
        margin: "5px"
      },
      on: {
        click: () => {
          vm.getGroupLocation(params.row.attendanceLocationId);
        }
      }
    },
    "编辑"
  );
};
const deleteLocaButton = (vm, h, params) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: "您确定要删除这条数据吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          vm.deletAttendanceLocation(params.row.attendanceLocationId);
        }
      }
    },
    [
      h(
        "Button",
        {
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

export default {
  data() {
    return {
      privilegeData: {
        ATT_GRP_ADD: false //新增
      },
      locationModal: false,
      addLocationModal: false,
      editLocationModal: false,
      editAttGroupModal: false, //点击编辑出现的弹框
      newAttGroupModal: false,
      mapModal: false,
      groupMenberModal: false,
      zoom: 15,
      attPosition: {
        //定位经纬度
        lat: "",
        lng: "",
        address: ""
      },
      //添加考勤组数据
      addAttForm: {
        attendanceGroupName: "",
        onDutyTime: "09:00:00",
        offDutyTime: "17:00:00",
        onDutyLastTime: "",
        lateLimitTime: "",
        lunchStartTime: "12:00:00",
        lunchEndTime: "13:00:00",
        workTime: 8
      },
      //编辑考勤组数据
      editAttForm: {
        attendanceGroupName: "",
        onDutyTime: "",
        offDutyTime: "",
        onDutyLastTime: "",
        lateLimitTime: "",
        lunchStartTime: "",
        lunchEndTime: "",
        workTime: 0
      },
      //添加考勤组数据校验规则
      addAttValidate: {
        attendanceGroupName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            max: 64,
            message: "考勤组名称不能超过64位",
            trigger: "blur"
          }
        ],
        onDutyTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        offDutyTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        onDutyLastTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        lateLimitTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        lunchStartTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        lunchEndTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        workTime: [
          { required: true, type: "number", message: " ", trigger: "blur" }
        ]
      },
      editValidate: {
        attendanceGroupName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            max: 64,
            message: "考勤组名称不能超过64位",
            trigger: "blur"
          }
        ],
        onDutyTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        offDutyTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        onDutyLastTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        lateLimitTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        lunchStartTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        lunchEndTime: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        workTime: [
          { required: true, type: "number", message: " ", trigger: "blur" }
        ]
      },
      //考勤组list table 列
      attGroupCol: [
        {
          title: "序号",
          key: "name",
          width: 80,
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.attGroupPaging.pageNum - 1) * vm.attGroupPaging.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "考勤组名称",
          key: "attendanceGroupName"
        },
        {
          title: "创建人",
          key: "creatorName"
        },
        {
          title: "创建时间",
          key: "gmtCreate"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              viewButton(this, h, params),
              editButton(this, h, params),
              attGroupMenber(this, h, params),
              locationButton(this, h, params),
              deleteButton(this, h, params)
            ]);
          }
        }
      ],
      //考勤组list data
      attGroupData: [],
      //考勤组list 分页
      attGroupPaging: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      group: {
        //考勤组员工
        total: 0,
        pageNum: 1,
        pageSize: 10,
        staffName: "",
        staffNumber: "",
        deptName: "",
        attendanceGroupId: ""
      },
      columnsGroup: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.group.pageNum - 1) * vm.group.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "工号",
          key: "staff_number"
        },
        {
          title: "部门",
          key: "dept_name"
        },
        {
          title: "职位",
          key: "job"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [deleteStaffButton(this, h, params)]);
          }
        }
      ],
      groupData: [],
      addGroupModal: false,
      columnsNoGroup: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "工号",
          key: "staff_number"
        },
        {
          title: "部门",
          key: "dept_name"
        },
        {
          title: "职位",
          key: "job"
        }
      ],
      onSelectStaffList: [],
      noGroupData: [],
      nogroup: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        staffName: "",
        staffNumber: "",
        deptName: ""
      },
      groupInfoModal: false,
      staffInfoData: [],
      staffInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        attendanceGroupId: ""
      },
      columnsSafttInfo: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.staffInfo.pageNum - 1) * vm.staffInfo.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "工号",
          key: "staff_number"
        },
        {
          title: "部门",
          key: "dept_name"
        },
        {
          title: "职位",
          key: "job"
        }
      ],
      // 考勤点
      location: {
        attendanceGroupId: "",
        address: ""
      },
      locationData: [],
      locationColumns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "考勤地点",
          key: "address"
        },
        {
          title: "精度(米)",
          key: "accuracy"
        },
        {
          title: "纬度",
          key: "latitude"
        },
        {
          title: "经度",
          key: "longitude"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              editLocaButton(this, h, params),
              deleteLocaButton(this, h, params)
            ]);
          }
        }
      ],
      addLocationForm: {
        accuracy: 1,
        address: "",
        longitude: 0,
        latitude: 0
      },
      editLocationForm: {
        accuracy: 1,
        address: "",
        longitude: 0,
        latitude: 0
      },
      addLocationRule: {
        accuracy: [
          { required: true, type: "number", message: " ", trigger: "blur" }
        ]
      },
      editLocationRule: {
        accuracy: [
          { required: true, type: "number", message: " ", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init() {
      let me = this;
      this.getAttGroupList();
      //获取三级菜单权限
      privilege(me.privilegeData).then(function(result) {
        me.privilegeData = result;
      });
    },
    // 分页
    changeAttGroupPage(value) {
      this.attGroupPaging.pageNum = value;
      this.getAttGroupList();
    },
    changeAttGroupPageSize(value) {
      this.attGroupPaging.pageSize = value;
      this.getAttGroupList();
    },
    handleGroupPage(value) {
      this.group.pageNum = value;
      this.getAttendanceGroupSatff();
    },
    handleGroupPageSize(value) {
      this.group.pageSize = value;
      this.getAttendanceGroupSatff();
    },
    handleNoGroupPage(value) {
      this.nogroup.pageNum = value;
      this.getAttendanceGroupNoSatff();
    },
    handleNoGroupPageSize(value) {
      this.nogroup.pageSize = value;
      this.getAttendanceGroupNoSatff();
    },
    handleSafttInfoPage(value) {
      this.staffInfo.pageNum = value;
      this.staffInfoFun();
    },
    handleStaffInfoPageSize(value) {
      this.staffInfo.pageSize = value;
      this.staffInfoFun();
    },
    //打开添加考勤组modal
    showAddAttModel() {
      this.newAttGroupModal = true;
      this.$refs["addAttForm"].resetFields();
    },
    //点击地图获取经纬度
    getClickInfo(e) {
      this.attPosition.lng = e.point.lng;
      this.attPosition.lat = e.point.lat;
      //获取当前地理名称
      let point = new BMap.Point(e.point.lng, e.point.lat);
      let gc = new BMap.Geocoder();
      let me = this;
      gc.getLocation(point, function(rs) {
        var addComp = rs.addressComponents;
        me.attPosition.address =
          addComp.province +
          " " +
          addComp.city +
          "  " +
          addComp.district +
          "  " +
          addComp.street +
          " " +
          addComp.streetNumber;
      });
    },
    savePosition() {
      //   //经纬度和地址信息保存到表单信息中
      this.mapModal = false;
      if (this.addLocationModal) {
        this.addLocationForm.address = this.attPosition.address;
        this.addLocationForm.longitude = this.attPosition.lng;
        this.addLocationForm.latitude = this.attPosition.lat;
      } else {
        this.editLocationForm.address = this.attPosition.address;
        this.editLocationForm.longitude = this.attPosition.lng;
        this.editLocationForm.latitude = this.attPosition.lat;
      }
    },
    addAttGroup(name) {
      let _data = moment().format("YYYY-MM-DD");

      if (
        moment(`${_data} ${this.addAttForm.offDutyTime}`).format("X") >=
          moment(`${_data} ${this.addAttForm.lunchEndTime}`).format("X") &&
        moment(`${_data} ${this.addAttForm.lunchEndTime}`).format("X") >=
          moment(`${_data} ${this.addAttForm.lunchStartTime}`).format("X") &&
        moment(`${_data} ${this.addAttForm.lunchStartTime}`).format("X") >=
          moment(`${_data} ${this.addAttForm.lateLimitTime}`).format("X") &&
        moment(`${_data} ${this.addAttForm.lateLimitTime}`).format("X") >=
          moment(`${_data} ${this.addAttForm.onDutyLastTime}`).format("X") &&
        moment(`${_data} ${this.addAttForm.onDutyLastTime}`).format("X") >=
          moment(`${_data} ${this.addAttForm.onDutyTime}`).format("X")
      ) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.addAttForm.creatorId = Cookies.get("staffId");
            this.addAttForm.companyId = Cookies.get("companyId");
            apiAddAttendanceGroup(qs.stringify(this.addAttForm)).then(res => {
              if (res.code == "success") {
                this.newAttGroupModal = false;
                this.getAttGroupList(); //每次的刷新
              } else {
                if (resCode[res.code]) {
                  this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      } else {
        this.$Message.warning(
          "请按照时间顺序（上班时间 < 上班最晚时间 < 迟到不超过时间 < 午餐开始时间 < 午餐结束时间 < 下班时间 ）!"
        );
      }
    },
    //获取公司考勤表list
    getAttGroupList() {
      let me = this;
      let companyId = Cookies.get("companyId");
      apiGetAttGroupList(companyId, {
        pageSize: me.attGroupPaging.pageSize,
        pageNum: me.attGroupPaging.pageNum
      }).then(function(res) {
        if ((res.code = "success")) {
          me.attGroupData = res.data;
          me.attGroupPaging.pageNum = res.pageNum;
          me.attGroupPaging.total = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //获取考勤组详情
    getAttGroupDetail(attendanceGroupId) {
      apiGetAttGroupDetail(attendanceGroupId).then(res => {
        if ((res.code = "success")) {
          this.editAttGroupModal = true;
          this.editAttForm = res.data;
          this.editAttForm.workTime = Number(
            (this.editAttForm.workTime / 60).toFixed(2)
          );
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改考勤组信息
    putAttendanceGroup(name) {
      let _data = moment().format("YYYY-MM-DD");

      if (
        moment(`${_data} ${this.editAttForm.offDutyTime}`).format("X") >=
          moment(`${_data} ${this.editAttForm.lunchEndTime}`).format("X") &&
        moment(`${_data} ${this.editAttForm.lunchEndTime}`).format("X") >=
          moment(`${_data} ${this.editAttForm.lunchStartTime}`).format("X") &&
        moment(`${_data} ${this.editAttForm.lunchStartTime}`).format("X") >=
          moment(`${_data} ${this.editAttForm.lateLimitTime}`).format("X") &&
        moment(`${_data} ${this.editAttForm.lateLimitTime}`).format("X") >=
          moment(`${_data} ${this.editAttForm.onDutyLastTime}`).format("X") &&
        moment(`${_data} ${this.editAttForm.onDutyLastTime}`).format("X") >=
          moment(`${_data} ${this.editAttForm.onDutyTime}`).format("X")
      ) {
        this.$refs[name].validate(valid => {
          if (valid) {
            ApiPutAttendanceGroup(qs.stringify(this.editAttForm)).then(res => {
              if (res.code == "success") {
                this.$Message.success("修改成功!");
                this.editAttGroupModal = false;
                this.getAttGroupList();
              } else {
                if (resCode[res.code]) {
                  this.$Message.error(resCode[res.code]);
                }
              }
            });
          }
        });
      } else {
        this.$Message.warning(
          "请按照时间顺序（上班时间 < 上班最晚时间 < 迟到不超过时间 < 午餐开始时间 < 午餐结束时间 < 下班时间 ）!"
        );
      }
    },
    //删除考勤组
    deleteAttGroup(attendanceGroupId) {
      ApiDeletAttendanceGroup(attendanceGroupId).then(res => {
        if ((res.code = "success")) {
          //如果当前表格数据只有一条，则请求上一页
          if (this.attGroupData.length == 1) {
            this.attGroupPaging.pageNum =
              this.attGroupPaging.pageNum > 1
                ? --this.attGroupPaging.pageNum
                : 1;
          }
          this.getAttGroupList();
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //查看考勤组
    viewAttGroup(attendanceGroupId) {
      apiGetAttGroupDetail(attendanceGroupId).then(res => {
        if ((res.code = "success")) {
          this.groupInfoModal = true;
          this.editAttForm = res.data;
          this.editAttForm.workTime = Number(
            (this.editAttForm.workTime / 60).toFixed(2)
          );
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
      this.staffInfo.attendanceGroupId = attendanceGroupId;
      this.staffInfoFun();
    },
    //  查看详情下的考核组员工
    staffInfoFun() {
      ApiGetAttendanceGroupSatff(this.staffInfo).then(res => {
        if ((res.code = "success")) {
          this.staffInfoData = res.data;
          this.staffInfo.total = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 点击考勤组员工
    viewAttGroupMenber(attendanceGroupId) {
      this.groupMenberModal = true;
      this.group.attendanceGroupId = attendanceGroupId;
      this.group.total = 0;
      this.group.pageNum = 1;
      this.group.pageSize = 10;
      this.group.staffName = "";
      this.group.staffNumber = "";
      this.group.deptName = "";
      this.getAttendanceGroupSatff();
    },
    // 获取 考勤组员工
    getAttendanceGroupSatff() {
      ApiGetAttendanceGroupSatff(this.group).then(res => {
        if ((res.code = "success")) {
          this.groupData = res.data;
          this.group.total = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 打开添加员工model，初始化
    addGroupModalShow() {
      this.nogroup.total = 0;
      this.nogroup.pageNum = 1;
      this.nogroup.pageSize = 10;
      this.nogroup.staffName = "";
      this.nogroup.staffNumber = "";
      this.nogroup.deptName = "";
      this.addGroupModal = true;
      this.getAttendanceGroupNoSatff();
    },
    //  获取所有非考勤组员工
    getAttendanceGroupNoSatff() {
      ApiGetAttendanceGroupNoSatff(this.nogroup).then(res => {
        if ((res.code = "success")) {
          this.noGroupData = res.data;
          this.nogroup.total = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 多选框选择人员
    /*
          获取选中的数据
          @params 1 ： 返回所有选中的data
          @params 2 ： 返回当前选中data
      **/
    onSelectStaff(selection, row) {
      this.onSelectStaffList = selection;
    },
    //  增加考勤组员工
    putAttendanceGroupAddStaff() {
      if (this.onSelectStaffList.length <= 0) {
        this.$Message.warning("请选择要添加的人员!");
      } else {
        let staffIds = [];
        for (let i = 0; i < this.onSelectStaffList.length; i++) {
          staffIds.push(this.onSelectStaffList[i].staff_id);
        }
        let data = {
          attendanceGroupId: this.group.attendanceGroupId,
          staffIds: staffIds
        };
        ApiPutAttendanceGroupAddStaff(
          qs.stringify(data, { arrayFormat: "brackets" })
        ).then(res => {
          if ((res.code = "success")) {
            this.$Message.success("添加成功!");
            this.addGroupModal = false;
            this.getAttendanceGroupSatff();
          } else {
            if (resCode[res.code]) {
              this.$Message.error(resCode[res.code]);
            }
          }
        });
      }
    },
    // 删除考勤组员工
    deletAttendanceGroupStaff(staffId) {
      ApiDeletAttendanceGroupStaff(staffId).then(res => {
        if ((res.code = "success")) {
          //如果当前表格数据只有一条，则请求上一页
          if (this.groupData.length == 1) {
            this.group.pageNum =
              this.group.pageNum > 1 ? --this.group.pageNum : 1;
          }
          this.getAttendanceGroupSatff();
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //点击考勤点
    locationFun(attendanceGroupId) {
      this.locationModal = true;
      this.location.attendanceGroupId = attendanceGroupId;
      this.getAttendanceLocationList();
    },
    // 根据考勤组获取考勤点列表
    getAttendanceLocationList() {
      ApiGetAttendanceLocationList(this.location).then(res => {
        if ((res.code = "success")) {
          this.locationData = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 考勤点点击添加
    addLocationFun() {
      this.addLocationModal = true;
      this.$refs["addLocationForm"].resetFields();
      this.addLocationForm.address = "";
      this.addLocationForm.latitude = "";
      this.addLocationForm.longitude = "";
    },
    // 点击出现地图
    mapModalFun() {
      this.mapModal = true;
    },
    // 添加考勤点保存
    postAttendanceGroup(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.addLocationForm.address == "") {
            this.$Message.warning("请选择考勤地点!");
            return false;
          }
          this.addLocationForm.attendanceGroupId = this.location.attendanceGroupId;
          ApiPostAttendanceGroup(qs.stringify(this.addLocationForm)).then(
            res => {
              if ((res.code = "success")) {
                this.$Message.success("新建成功!");
                this.addLocationModal = false;
                this.getAttendanceLocationList();
              } else {
                if (resCode[res.code]) {
                  this.$Message.error(resCode[res.code]);
                }
              }
            }
          );
        }
      });
    },
    // 获取考勤点详情
    getGroupLocation(attendanceLocationId) {
      this.editLocationModal = true;
      ApiGetGroupLocation(attendanceLocationId).then(res => {
        if ((res.code = "success")) {
          this.editLocationForm = res.data;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改 考勤点 点击保存
    putAttendanceLocation(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutAttendanceLocation(qs.stringify(this.editLocationForm)).then(
            res => {
              if ((res.code = "success")) {
                this.$Message.success("考勤点修改成功!");
                this.editLocationModal = false;
                this.getAttendanceLocationList();
              } else {
                if (resCode[res.code]) {
                  this.$Message.error(resCode[res.code]);
                }
              }
            }
          );
        }
      });
    },
    // 删除考勤点
    deletAttendanceLocation(attendanceLocationId) {
      ApiDeletAttendanceLocation(attendanceLocationId).then(res => {
        if ((res.code = "success")) {
          this.$Message.success("考勤点删除成功!");
          this.getAttendanceLocationList();
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 清空
    resetGroup() {
      this.group.staffName = "";
      this.group.staffNumber = "";
      this.group.deptName = "";
      this.getAttendanceGroupSatff();
    },
    resetNoGroup() {
      this.nogroup.staffName = "";
      this.nogroup.staffNumber = "";
      this.nogroup.deptName = "";
      this.getAttendanceGroupNoSatff();
    },
    resetLocation() {
      this.location.address = "";
      this.getAttendanceLocationList();
    }
  },
  components: {
    split
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.init();
    }
  }
};
</script>
<style  lang='scss'>
@import "../../common/css/base";

.att-modal {
  .ivu-date-picker {
    width: 100%;
  }
  .ivu-input-number {
    width: 100%;
  }
}
.bm-view {
  width: 100%;
  height: 300px;
}
.map-model {
  .map-footer {
    display: flex;
    justify-content: space-between;
    div {
      span {
        padding: 0 5px;
      }
    }
    button {
      margin-left: 10px;
    }
  }
}
.btn-span {
  padding: 5px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 5px;
  color: #fff;
  margin-right: 8px;
}

.group-info {
  .ivu-col {
    margin-top: 10px;
  }
  .ivu-alert {
    margin-top: 20px;
    margin-bottom: 0;
  }
}
.location {
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
.map-div {
  z-index: 2000 !important ;
}
</style>

