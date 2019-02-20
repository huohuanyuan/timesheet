/*
 * @Author: liuhaosheng 
 * @Date: 2019-02-14 09:54:05 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-02-18 17:04:38
 * 员工项目月工时报表
 */
<template>
    <div class="month-div">
        <Row :gutter="16">
            <Col :md="6" :sm="8" :lg="4">
            <Row :gutter="16">
                <Tree :data="deptsDataTree" @on-select-change="depSelect"></Tree>
            </Row>
            </Col>
            <Col :md="18" :sm="16" :lg="20">
            <Row :gutter="16">
                <div>
                    <Col :xs="24" :sm="12" :md="6">
                    <Input v-model.sync="attendance.staffName">
                    <span slot="prepend"> 姓名 </span>
                    </Input>
                    <split></split>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6">
                    <Input v-model.sync="attendance.staffNumber">
                    <span slot="prepend"> 工号 </span>
                    </Input>
                    <split></split>
                    </Col>
                    <Col :sm="12" :md="6" :xs="24">
                    <div class="s-input-wrapper">
                        <label> 时间 </label>
                        <DatePicker :editable='false' type="month" v-model="attendance.yearMonth" :clearable="false"></DatePicker>
                    </div>
                    <split></split>
                    </Col>
                </div>
                <Col :xs="24" :sm="12" :md="6">
                <Button type="info" @click="getStaffMonthTsheet"> 查询 </Button>
                <Button @click="resetStaffMonth"> 重置 </Button>
                <Button type="primary" @click="downLoadFun"> 导出 </Button>
                </Col>
            </Row>
            <Row class="staff-wrap">
                <Col class="staff-title">
                <split></split>
                <h2>员工项目月工时报表</h2>
                <p>
                    <span> 制作人：{{ userName }}</span>
                    <span> 日期：{{ currentTime }}</span>
                </p>
                </Col>
                <Col span="24">
                <Table stripe :columns="columnsMonth" :data="staffData"></Table>
                <div class="page">
                    <Page :total="attendance.total" size="small" :current="attendance.pageNum" :page-size="attendance.size" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
                    </Page>
                </div>
                </Col>
            </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {
        ApiGeteportDepts,
        ApiGetStaffMonthTsheet,
        ApiGetReportStaffMonth
    } from "@/api/report/report-api";
    import moment from "moment";
    import split from "components/unit/split";
    import {
        resCode
    } from "@/api/code";
    import {
        privilege
    } from "common/js/privilege";
    export default {
        components: {
            split
        },
        data() {
            return {
                deptsDataTree: [],
                staffData: [],
                columnsMonth: [{
                        title: "序号",
                        width: 60,
                        align: "center",
                        render: (h, params) => {
                            return h(
                                "div",
                                (function(vm) {
                                    let _code =
                                        (vm.attendance.pageNum - 1) * vm.attendance.pageSize +
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
                        align: "center"
                    },
                    {
                        title: "姓名",
                        key: "staffName",
                        align: "center"
                    },
                    {
                        title: "部门",
                        key: "deptName",
                        align: "center"
                    },
                    {
                        title: "合同号",
                        key: "contractCode",
                        align: "center"
                    },
                    {
                        title: "年月",
                        key: "yearMonth",
                        align: "center"
                    },
                    {
                        title: "项目名称",
                        key: "projectName",
                        align: "center"
                    },
                    {
                        title: "有偿工时",
                        key: "paidWorkHours",
                        align: "center"
                    },
                    {
                        title: "无偿工时",
                        key: "freeWorkHours",
                        align: "center"
                    },
                ],
                attendance: {
                    total: 0,
                    pageNum: 1,
                    pageSize: 10,
                    deptId: '',
                    staffName: '',
                    staffNumber: '',
                    yearMonth: moment()
                        .subtract(1, "months")
                        .format("YYYY-MM")
                },
            }
        },
        methods: {
            // 分页
            handlePage(value) {
                this.attendance.pageNum = value;
                this.getStaffMonthTsheet();
            },
            handlePageSize(value) {
                this.attendance.pageSize = value;
                this.getStaffMonthTsheet();
            },
            //部门组织树上选中一个部门
            depSelect(msg) {
                this.attendance.deptId = msg[0].deptId;
                if (this.attendance.deptId != '') {
                    this.getStaffMonthTsheet();
                }
            },
            // 请求左侧 树形数据
            geteportDepts() {
                ApiGeteportDepts().then(res => {
                    if (res.code == "success") {
                        this.deptsDataTree = res.data;
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            getStaffMonthTsheet() {
                this.attendance.yearMonth = moment(this.attendance.yearMonth).format(
                    "YYYY-MM"
                );
                ApiGetStaffMonthTsheet(this.attendance).then(res => {
                    if (res.code == "success") {
                        this.staffData = res.data;
                        this.attendance.total = res.total;
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 导出
            downLoadFun() {
                if (this.attendance.deptId == "") {
                    this.$Message.warning("请选择部门!");
                    return false;
                }
                this.attendance.yearMonth = moment(this.attendance.yearMonth).format(
                    "YYYY-MM"
                );
    
                let _data = {
                    staffName: this.attendance.staffName,
                    staffNumber: this.attendance.staffNumber,
                    yearMonth: this.attendance.yearMonth,
                    deptId: this.attendance.deptId
                };
                ApiGetReportStaffMonth(_data).then(data => {
                    if (!data) {
                        return;
                    }
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let link = document.createElement("a");
                    link.style.display = "none";
                    link.href = url;
                    link.setAttribute("download", `员工项目月工时报表.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                });
            },
            // 重置
            resetStaffMonth() {
                this.attendance.pageNum = 1;
                this.attendance.staffName = '';
                this.attendance.staffNumber = '';
                this.attendance.yearMonth = moment()
                    .subtract(1, "months")
                    .format("YYYY-MM");
                this.getStaffMonthTsheet();
            }
        },
        computed: {
            userName() {
                return localStorage.getItem("name");
            },
            currentTime() {
                return moment(new Date().getTime()).format("YYYY-MM-DD");
            }
        },
        mounted() {
            this.geteportDepts();
        }
    }
</script>

<style lang="scss">
    @import "../../common/css/mixin";
    @import "../../common/css/base";
    .s-input-wrapper {
        @include datapick-label();
        @include select-label();
        @include clear-both();
    }
    
    .month-div {
        .staff-wrap {
            h2 {
                text-align: center;
            }
        }
    }
</style>


 
