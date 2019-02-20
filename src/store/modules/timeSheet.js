import {
  ApiGetDeclareSheetList,
  ApiGetProTaskList,
  ApiGetStaffValidTime
} from "@/api/timesheet/timedeclare-api.js";
import {
  ApiGetCheckList
} from "@/api/timesheet/timecheck-api.js";
import {
  getdaysList
} from "common/js/tsheetDays";
import {
  resCode
} from "@/api/code";
import iView from 'iview';
import moment from "moment";

const declare = {
  state: {
    showRegWrap: {
      regForm: false, //显示工时填写的表格，
      regRecord: true, //显示已经申报或者保存的记录
      regView: false, //查看填写的工时
      regModify: false, //修改工时
    },
    showCheckWrap: {
      checkRecord: true, //显示需要审核工单的列表
      checkView: false, //查看工单详情
      checkModal: false, //审核工单
      allCheckInfo:false,//查看所有的审批单
      checkOpinion:false,//审批意见
    },
    declareListParams: {}, //申报表格请求参数
    declareTableData: [], //申报表格数据
    declareTableTotal: 0, //申报表格总条数
    tsheetView: { //已经保存或申报的工时查看
      dailies: [],
      form: {},
      total:{},
    },
    studyList: [],
    taskList: {},
    newTsheet: { //新建工时
      recordStart: "",
      recordEnd: "",
      declareEnd: 0, // 申报结束时间
      declareStart: 0, // 申报开始时间
      canSubmit: Boolean, // 是否显示申报按钮 
      tcycleId: 0
    },
    newTsheetData: [], //新建工时时的table数据，（初始值，每天的工时均为0）
    staffVaildTime: [], //个人有效工时
    checkListParams: {}, //审批工单时保存审批表格请求参数
    checkTableData: [], //审批表格数据
    checkListTotal: 0, //审批表格总条数
    checkFilterStatus: "", //筛选审批表格的状态参数，从首页任务中心跳转使用
    declareFilterStatus: "", //筛选申报表格的状态参数，从首页任务中心跳转使用
    isHandleReset: false, //HACK : watch变量，用来清空电子签名表单样式

  },
  mutations: {
    // 申报页面视图切换
    showRegWrap(state, name) {
      let _wrap = state.showRegWrap;
      for (let k in _wrap) {
        if (k == name) {
          _wrap[k] = true;

        } else {
          _wrap[k] = false;
        }
      }
    },
    // 审核页面视图切换
    showCheckWrap(state, name) {
      let _wrap = state.showCheckWrap;
      for (let k in _wrap) {
        if (k == name) {
          _wrap[k] = true;

        } else {
          _wrap[k] = false;
        }
      }
    },
    getStudyTaskList(state, params) {
      let me = this;
      ApiGetProTaskList(params).then(function (res) {        
        if (res.code == "success" && res.data) {
          state.studyList = res.data.projects;
          state.taskList = res.data.tasks;
        } else {
          state.studyList = [];
          state.taskList = {};
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      }).catch(function () {
        state.studyList = [];
        state.taskList = {};
      });
    },
    getTsheetList(state, params) {
      let defaultParams = {
        staffId: "",
        approverId: "",
        formCode: "",
        recordStart: "",
        recordEnd: "",
        status: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      if (params) {
        for (let k in params) {
          defaultParams[k] = params[k];
        }
      }
      if (defaultParams.recordStart) {
        defaultParams.recordStart = moment(defaultParams.recordStart).format("YYYY-MM-DD");
      } else {
        delete defaultParams.recordStart;
      }

      if (defaultParams.recordEnd) {
        defaultParams.recordEnd = moment(defaultParams.recordEnd).format("YYYY-MM-DD");
      } else {
        delete defaultParams.recordEnd;
      }


      ApiGetDeclareSheetList(defaultParams).then(function (res) {
        if (res.code == "success") {
          state.declareTableData = res.data;
          state.declareTableTotal = res.total;
        } else {
          //FIXME : 请求失败清空缓存
          state.declareTableData = [];
          state.declareTableTotal = 0;
          if (resCode[res.code]) {
            iView.Message.error(resCode[res.code]);
          }
        }
      }).catch(function () {
        //FIXME : 请求异常清空缓存
        state.declareTableData = [];
        state.declareTableTotal = 0;
      })
    },
    setNewTsheetData(state, params) {
      for (let key in params) {
        state.newTsheet[key] = params[key];
      }
      //置入新建工时时的table 初始值
      let _obj = {};
      _obj.study = "";
      _obj.task = "";
      _obj.times = {};
      _obj.workComment = {};
      _obj.issueComment = {};
      _obj.flag = "new"; //标志是新建数据，任务列表绘制select框
      let daysList = getdaysList(state.newTsheet.recordStart, state.newTsheet.recordEnd);
      for (let [index, elem] of daysList.entries()) {
        _obj.times[elem] = 0;
      }
      state.newTsheetData = new Array(_obj);
    },
    //获取个人有效工时
    getStaffValidTime(state, params) {
      let _obj = {};
      _obj.flag = "validTime"; //标志是有效工时，不计算在合计中
      ApiGetStaffValidTime(params).then(function (res) {
        if (res.code == "success" && res.data) {
          _obj.times = {};
          for (let [index, elem] of res.data.entries()) {
            let _day = moment(elem.workDate).format("YYYY-MM-DD");
            let _effHour = elem.effHour ? elem.effHour : 0;
            let _surplusEffHour = elem.surplusEffHour ? elem.surplusEffHour : 0
            _obj.times[_day] = _surplusEffHour + "/" + _effHour;
          }
          let daysList = getdaysList(state.newTsheet.recordStart, state.newTsheet.recordEnd);
          for (let [index, elem] of daysList.entries()) {
            if (!_obj.times[elem]) { //如果后台没有查到当前日期的有效工时，怎置入默认值0
              _obj.times[elem] = "0/0";
            }
          }
          state.staffVaildTime = new Array(_obj);
        } else {
          state.staffVaildTime = [];
          if (resCode[res.code]) {
            iView.Message.error(resCode[res.code]);
          }
        }
      }).catch(function () {
        state.staffVaildTime = [];
      })
    },
    //查看修改工单，置入table数据
    setTsheetViewData(state, params) {
      for (let key in params) {
        state.tsheetView[key] = params[key];
      }
    },
    getTimeCheckList(state, params) {
      let defaultParams = {
        staffId: "",
        formCode: "",
        recordStart: "",
        recordEnd: "",
        status: "",
        pageNum: 1,
        pageSize: 10,
      }
      if (params) {
        for (let k in params) {
          defaultParams[k] = params[k];
        }
      }
      if (defaultParams.recordStart) {
        defaultParams.recordStart = moment(defaultParams.recordStart).format("YYYY-MM-DD");
      } else {
        delete defaultParams.recordStart;
      }
      if (defaultParams.recordEnd) {
        defaultParams.recordEnd = moment(defaultParams.recordEnd).format("YYYY-MM-DD");
      } else {
        delete defaultParams.recordEnd;
      }


      ApiGetCheckList(defaultParams).then(function (res) {
        if (res.code == "success") {
          state.checkTableData = res.data;
          state.checkListTotal = res.total;
        } else {
          //FIXME : 请求失败清空缓存
          state.checkTableData = [];
          state.checkListTotal = 0;
          if (resCode[res.code]) {
            iView.Message.error(resCode[res.code]);
          }
        }
      }).catch(function () {
        //FIXME : 请求失败清空缓存
        state.checkTableData = [];
        state.checkListTotal = 0;
      })
    },
    //设置申报列表检索状态值，用于首页任务跳转时检索
    setDeclareFilterStatus(state, statusId) {
      state.declareFilterStatus = statusId;
    },
    //设置审核列表检索状态值，用于首页任务跳转时检索
    setCheckFilterStatus(state, statusId) {
      state.checkFilterStatus = statusId;
    },
    //HACK : 通过监听isHandleReset值的变化，清除数字签名表单的样式
    handleReset(state) {
      state.isHandleReset = !state.isHandleReset;
    },
    //保存审批列表请求参数
    setCheckListParams(state, params) {
      state.checkListParams = params;
    },
    //保存申报列表请求参数
    setDeclareListParams(state, params) {
      state.declareListParams = params;
    }

  }
}
export default declare;
