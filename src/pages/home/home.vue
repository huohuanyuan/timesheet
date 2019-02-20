/*
 * @Author: chengshanshan 
 * @Date: 2018-07-04 16:51:58 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2019-01-22 10:52:19
 * @instruction：首页
 */

<template>
  <div class="home-page">
    <Row :gutter="16">
      <Col :md="12" :sm="24">
      <!-- 待办中心 -->
      <div class="home-item todo-center">
        <h3 class="item-title">待办中心</h3>
        <div>
          <Tabs :animated="false" @on-click="tabChange">
            <TabPane label="待审批" name="54">
              <ul class="task-list" v-if="taskList.length>0">
                <li v-for="(item,index) in taskList" :key="index" class="list-cell" @click="toOperatePage">
                  <span>{{item.formCode}}</span>
                  <span>{{item.declareDate | moment}}</span>
                </li>
              </ul>
              <ul class="task-list" v-else>
                <li class="list-cell">暂无数据</li>
              </ul>
              <div class="page">
                <Page :total="taskPage.total" :current="taskPage.pageNum" :page-size="taskPage.pageSize" size="small" show-total @on-change="taskPageChange"></Page>
              </div>
                    <split></split>
            </TabPane>
            <TabPane label="待申报" name="52">
              <ul class="task-list" v-if="taskList.length>0">
                <li v-for="(item,index) in taskList" :key="index" class="list-cell" @click="toOperatePage">
                  <span>{{item.formCode}}</span>
                  <span>{{item.declareDate | moment}}</span>
                </li>
              </ul>
              <ul class="task-list" v-else>
                <li class="list-cell">暂无数据</li>
              </ul>
              <div class="page">
                <Page :total="taskPage.total" :current="taskPage.pageNum" :page-size="taskPage.pageSize" size="small" show-total></Page>
              </div>
                    <split></split>
            </TabPane>
            <TabPane label="过期锁定" name="53">
              <ul class="task-list" v-if="taskList.length>0">
                <li v-for="(item,index) in taskList" :key="index" class="list-cell" @click="toOperatePage">
                  <span>{{item.formCode}}</span>
                  <span>{{item.declareDate | moment}}</span>
                </li>
              </ul>
              <ul class="task-list" v-else>
                <li class="list-cell">暂无数据</li>
              </ul>
              <div class="page">
                <Page :total="taskPage.total" :current="taskPage.pageNum" :page-size="taskPage.pageSize" size="small" show-total></Page>
              </div>
                    <split></split>
            </TabPane>
            <TabPane label="审核失败" name="56">
              <ul class="task-list" v-if="taskList.length>0">
                <li v-for="(item,index) in taskList" :key="index" class="list-cell" @click="toOperatePage">
                  <span>{{item.formCode}}</span>
                  <span>{{item.declareDate | moment}}</span>
                </li>
              </ul>
              <ul class="task-list" v-else>
                <li class="list-cell">暂无数据</li>
              </ul>
              <div class="page">
                <Page :total="taskPage.total" :current="taskPage.pageNum" :page-size="taskPage.pageSize" size="small" show-total></Page>
              </div>
                    <split></split>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <split></split>
      <!-- 通知公告 -->
      <div class="home-item message-center">
        <h3 class="item-title">通知公告</h3>
        <div class="content">
          <ul class="message-list" v-if="annoList.length>0">
            <li v-for="(item,index) in annoList" :key="index" class="list-cell">
              <div class="message-label">
                <div class="date">
                  <p class="date-day"> {{item.dateStart | moment("DD")}}</p>
                  <p class="date-month">{{item.dateStart |moment("YYYY.MM")}}</p>
                </div>
                <div class="message-title">
                  {{item.title}}
                </div>
              </div>
              <div class="view-btn" @click="getAnno(item.annoId)">
                <p class="view-icon">         
                </p>
                <p class="view-tit">查看详情</p>
              </div>
            </li>
          </ul>
          <ul class="message-list" v-else>
            <li>暂无数据</li>
          </ul>
        </div>
      </div>
      <split></split>
      </Col>
      <Col :md="12" :sm="24">
      <Row :gutter="16">
        <Col :md="12" :sm="24">
        <!-- 时间 -->
        <div class="home-item time-center">
          <h3 class="item-title">当前时间</h3>
          <div class="content">
            <div class="time">
              <span class="time-h">{{nowTime | moment("HH:mm")}}</span>
              <span class="time-s">{{nowTime | moment("ss")}}</span>
            </div>
          </div>
        </div>
        <split></split>
        </Col>
        <Col :md="12" :sm="24">
        <!-- 天气-->
        <div class="home-item  weather-center">
          <h3 class="item-title">天气</h3>
          <div class="content">
            <iframe allowtransparency="true" frameborder="0" width="195" height="96" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=0&v=0&d=1&bd=0&k=&f=&ltf=009944&htf=cc0000&q=0&e=1&a=1&c=54511&w=195&h=96&align=center"></iframe>
          </div>
        </div>
        </Col>
      </Row>
      <split></split>
      <!-- 日历 -->
      <div class="home-item calendar-center">
        <h3 class="item-title">日历日程</h3>
        <div class="content">
          <tms-calendar @changeDate="emitChangeDate" @goToday="goToday"></tms-calendar>
        </div>
      </div>
      </Col>
    </Row>
    <!-- 公告详情 -->
        <Modal v-model="annoModal" title="公告详情">
      <div class="anno-div">
        <ul>
          <li>
            <label>标题：</label>
            <span>{{annoData.title}}</span>
          </li>
              <split></split>
          <li>
            <label>内容：</label>
            <span  v-html="annoData.content"></span>
          </li>
        </ul>
      </div>
        <p slot="footer">       
          <Button @click="annoModal=false">关闭</Button>
        </p>
    </Modal>

  </div>
</template>
<script>
import {
  ApiGetAnnoList,
  ApiGetAnno,
  ApiGetUpcomingList,
  ApiGetWeater
} from "@/api/home/home-api";

import { ApiGetDeclareSheetList } from "@/api/timesheet/timedeclare-api";

import { ApiGetCheckList } from "@/api/timesheet/timecheck-api";

import {
  ApiGetCaleRange
} from "@/api/system/calendar-api";

import moment from "moment";
import { resCode } from "@/api/code";
import Split from "components/unit/split";
import TmsCalendar from "components/tmsCalendar/tms-calendar";

export default {
  components: {
    Split,
    TmsCalendar
  },
  data() {
    return {
      annoList: [],
      upcomingData: {},
      annoModal: false,
      annoData: {},
      nowTime: moment(),
      currentTabNmber: 54, //当前所在tab
      taskList: [], //待审批list
      taskPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    };
  },
  methods: {
    init: function() {
      let me = this;
      //获取任务列表
      me.getTaskList(54);
      //获取公告
      me.getAnnoList();
      //获取天气
      me.ApiGetWeater();
      //显示时间
      setInterval(this.showTime, 1000);  
 
      //查询公司日历
      this.$store.commit("setCurrentDate", moment());
      this.$store.commit("getCompanyCalendar");
    },
    tabChange(name) {
      //tab切换
      this.currentTabNmber = name;
      this.taskPage.pageNum = 1;
      this.getTaskList(name);
    },
    //检索任务列表
    getTaskList(name) {
      let me = this;
      if(name==54){
        ApiGetCheckList({
            status: name,
        pageSize: me.taskPage.pageSize,
        pageNum: me.taskPage.pageNum
        }).then(function(res){
          if (res.code == "success") {
            me.taskList = res.data;
            me.taskPage.total = res.total;
          } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
        })
      }else{
      ApiGetDeclareSheetList({
        status: name,
        pageSize: me.taskPage.pageSize,
        pageNum: me.taskPage.pageNum
      }).then(function(res) {
        if (res.code == "success") {
          me.taskList = res.data;
          me.taskPage.total = res.total;
        } else {
          if (resCode[res.code]) {
            me.$Message.error(resCode[res.code]);
          }
        }
      })    
      }     
    },
    taskPageChange(pageNum) {
      this.taskPage.pageNum = pageNum;
      this.getTaskList(this.currentTabNmber);
    },
    // 获取公共列表
    getAnnoList() {
      let _this = this;
      ApiGetAnnoList().then(function(res) {
        if (res.code == "success") {
          _this.annoList = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 获取公告详情
    getAnno(annoId) {
      let _this = this;
      ApiGetAnno(annoId).then(function(res) {
        if (res.code == "success") {
          _this.annoModal = true;
          _this.annoData = res.data;
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 检索待办任务
    getUpcomingList() {
      let _this = this;
      ApiGetUpcomingList().then(function(res) {
        if (res.code == "success") {
          if (res.data) {
            _this.upcomingData = res.data;
          }
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //待办任务跳转 
    toOperatePage(){
      if(this.currentTabNmber == 54){
        //待审批跳转到审批页面    
      this.$router.push({ name: "TS_APV" });
      //请求工单列表，传入过滤条件
      this.$store.commit("setCheckFilterStatus", this.currentTabNmber);
      }else{
      //跳转到工时申报页面
      this.$router.push({ name: "TS_DCL" });
      //请求工单列表 ，传入过滤条件
      this.$store.commit("setDeclareFilterStatus", this.currentTabNmber);
      }   
    },
    /*
      获取天气
      和风天气文档地址：https://www.heweather.com/documents/api/s6/weather-now
      免费接口每天访问量：1000次
    */
    ApiGetWeater() {},   
    showTime() {
      this.nowTime = moment();
    },
    emitChangeDate(newdate) {
      this.$store.commit("setCurrentDate", newdate);
      this.$store.commit("getCompanyCalendar");
    },
    goToday() {
      this.$store.commit("setCurrentDate", moment());
    }
  },
  filters: {
    moment: function(data, formatString) {
      formatString = formatString || "YYYY-MM-DD";
      if (data) {
        return moment(data).format(formatString);
      } else {
        return "";
      }
    }
  },
   mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
@import "../../common/css/mixin";
@import "../../common/css/variable";
.home-page {
  background: #f5f7f9;
  margin: -20px -20px;
  padding: 20px;
  .home-item {
    background: #fff;
    .item-title {
      padding: 10px 20px;
    }
    .content {
      padding: 10px 20px;
    }
  }
  //待办中心
  .todo-center {
    .item-title{
      border-bottom: 1px solid $primary-color;
      color: $primary-color;
    }
    .ivu-tabs-bar {
      border-bottom: 1px solid $primary-color;
    }
    .ivu-tabs-nav-scroll {
      padding: 15px 0;
      text-align: center;
      .ivu-tabs-nav {
        float: none;
        display: inline-block;
        border: 1px solid $primary-color;
        border-radius: 20px;
        .ivu-tabs-ink-bar {
          display: none !important;
        }
        .ivu-tabs-tab {
          padding: 2px 20px;
          border-radius: 19px;
          margin: 0;
          &.ivu-tabs-tab-active {
            color: #fff;
            background: $primary-color;
          }
        }
      }
    }
    .task-list {
      .list-cell {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        padding: 5px 20px;
        cursor:pointer;
        transition:background-color .5s;
        &:hover{
          background-color: $bg-hover-color;
        }
      }
    }
  }
  //通知公告
  .message-center {
    .item-title {
      border-bottom: 2px solid $warning-color;
      color: $warning-color;
    }
    .message-list {
      .list-cell {
        display: flex;
        justify-content: space-between;
        border: 1px solid $border-dark-color; 
        margin-bottom: 10px;
        .message-label {
          display: flex;
          align-items: center;
          .date {
            padding: 5px 10px;
            color: #424857;
            background-color: #e5e5e5;
            .date-day {
              text-align: center;
              font-size: 30px;
              font-weight: bold;
            }
          }
          .message-title {
            padding: 0 10px;
            font-size: 14px;
          }
        }
        .view-btn {
          flex-shrink: 0;
          padding: 5px 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end; 
          border-left: 1px solid $border-dark-color;   
          cursor: pointer;     
          .view-icon{
          flex: auto;
          background: url("../../common/img/view-icon.svg") 0 0 no-repeat;
          background-size:contain 
          }
          .view-tit{
            padding-top: 2px;
            color:$light-dark-color;
            font-size: 12px;
            
          }
        
        }
      }
    }
  }
  //时间
  .time-center {
    .item-title {
      color: #000;
    }
    .content {
      height: 130px;
    }
    .time {
      margin: 10px;
      padding: 20px;
      text-align: center;
      @include bg-image("../../common/img/time-border");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      .time-h {
        color: $primary-color;
        font-size: 40px;
      }
      .time-s {
        color: $primary-color;
        font-size: 15px;
        font-weight: bold;
        padding: 0 5px;
      }
    }
  }
  //天气
  .weather-center {
    .item-title {
      color: #000;
    }
    .content {
      height: 130px;
    }
  }
  .calendar-center {
    .item-title {
      color: $success-color;
    }
  }
}
</style>

