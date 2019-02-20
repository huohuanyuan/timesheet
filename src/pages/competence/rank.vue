/*
 * @Author: liuhaosheng 
 * @Date: 2019-01-21 13:15:47 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-21 17:15:57
 * 职级管理页面 
 */
<template>
    <div class="rank-wrap">
        <Row :gutter="16">
            <Col span="6">
            <epacs-dic-tree ref="dicTree" :dicAdd='dicAdd' :dicEdit="dicEdit" :dicDel="dicDel" :treeList="treeList" @newCategory="newCategory" @dicItemClick="dicItemClick" @editCategory="editCategory" @deleteCategory="deleteCategory"></epacs-dic-tree>
            </Col>
            <Col span="18">
            <div class="rank-top">
                <Row :gutter="16">
                    <!-- <Col span="6">
                    <Input v-model.trim="rank.name">
                    <span slot="prepend"> 名称 </span>
                    </Input>
                    </Col>
                    <Col span="6">
                    <div>
                        <Button type="info" @click=""> 查询 </Button>
                        <Button @click="reset"> 重置 </Button>
                    </div>
                    </Col> -->
                    <Col span="24">
                    <div class="span-right">
                        <Button type="primary" @click="addRank" :disabled='disabled'> 新增 </Button>
                    </div>
                    </Col>
                </Row>
            </div>
            <Table :columns="rankCol" :data="rankData"></Table>
            <div class="page">
                <Page :total="rank.total" size="small" :current="rank.pageNum" :page-size="rank.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
                </Page>
            </div>
            </Col>
        </Row>
        <!-- 新增级别 -->
        <Modal v-model="rankModal" :title="rankTitle" :width="600" :mask-closable="false">
            <Form ref="rankForm" :model="rankForm" :rules="rankInline" class="from-role" :label-width="100">
                <Row :gutter="16">
                    <Col span="24">
                    <FormItem label="级别名称" prop="positionLevelName">
                        <Input v-model="rankForm.positionLevelName"></Input>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem prop="timeRate" label="工时利用率">
                        <InputNumber :min="0" :step="0.5" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" v-model="rankForm.timeRate"></InputNumber>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" long @click="positionLe('rankForm')">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
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
                        vm.deletePositionLe(params.row.positionLevelId);
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
                        vm.$refs["rankForm"].resetFields();
                        vm.getRankCon(params.row.positionLevelId);
                    }
                }
            },
            "编辑"
        );
    };
    import EpacsDicTree from "./../../components/epacs-dic-tree";
    import {
        resCode
    } from "@/api/code";
    import qs from "qs";
    
    import {
        ApiGetPosition,
        ApiPostPosition,
        ApiPutPosition,
        ApiDeletePosition,
        ApiGetPositionLevel,
        ApiPostPositionLe,
        ApiPutPositionLe,
        ApiGetLevel,
        ApiDeletePositionLe
    } from "@/api/competence/rank-api";
    
    export default {
        components: {
            EpacsDicTree
        },
        data() {
            return {
                disabled: true,
                dicAdd: true,
                dicEdit: true,
                dicDel: true,
                rank: {
                    total: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                treeList: [],
                rankCol: [{
                        title: "序号",
                        width: 60,
                        render: (h, params) => {
                            return h(
                                "div",
                                (function(vm) {
                                    let _code =
                                        (vm.rank.pageNum - 1) * vm.rank.pageSize +
                                        params.index +
                                        1;
                                    return _code;
                                })(this)
                            );
                        }
                    },
                    {
                        title: "级别名称",
                        key: "positionLevelName",
                        align: 'center'
                    },
                    {
                        title: "工时利用率",
                        key: "timeRate",
                        align: 'center'
                    },
                    {
                        title: "操作",
                        width: 150,
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                // editButton(this, h, params),
                                // deleteButton(this, h, params)
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
                rankData: [],
                positionId: '',
                rankModal: false,
                rankTitle: '',
                rankForm: {
                    timeRate: 0
                },
                rankInline: {
                    positionLevelName: [{
                        required: true,
                        message: " ",
                        trigger: "blur"
                    }],
                    timeRate: [{
                        required: true,
                        message: " ",
                        type: "number",
                        trigger: "blur"
                    }]
                },
                isEdit: false,
            }
        },
        methods: {
            // 分页
            handlePage(value) {
                this.rank.pageNum = value;
                this.getPositionLevel();
            },
            handlePageSize(value) {
                this.rank.pageSize = value;
                this.getPositionLevel();
            },
            // 查询公司所有职位
            getPosition() {
                ApiGetPosition().then(res => {
                    if (res.code == "success") {
                        this.treeList = res.data;
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 新建
            newCategory(datas) {
                ApiPostPosition(qs.stringify(datas)).then(res => {
                    if (res.code == "success") {
                        this.getPosition();
                        //关闭弹框
                        this.$refs.dicTree.popClose("visible");
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 修改
            editCategory(datas) {
                let _datas = {
                    positionId: datas.positionId,
                    positionName: datas.positionName
                };
                ApiPutPosition(qs.stringify(_datas)).then(res => {
                    if (res.code == "success") {
                        this.getPosition();
                        //关闭弹框
                        this.$refs.dicTree.popClose(`visible_${datas.editIndex}`);
                        this.$Message.success("修改成功!");
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 删除
            deleteCategory(positionId) {
                ApiDeletePosition(positionId).then(res => {
                    if (res.code == "success") {
                        this.getPosition();
                        this.$Message.success("删除成功!");
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 查询职位下所有职级
            dicItemClick(data) {
                this.disabled = false;
                this.positionId = data.positionId;
                this.getPositionLevel();
            },
            getPositionLevel() {
                ApiGetPositionLevel(this.positionId, this.rank).then(res => {
                    if (res.code == "success") {
                        this.rankData = res.data;
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 添加 级别
            addRank() {
                this.isEdit = false;
                this.rankTitle = '新增职位级别';
                this.rankModal = true;
                this.$refs["rankForm"].resetFields();
            },
            // 新增 /修改 级别点击保存
            positionLe(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        if (!this.isEdit) {
                            this.rankForm.positionId = this.positionId;
                            delete this.rankForm.positionLevelId;
                            ApiPostPositionLe(qs.stringify(this.rankForm)).then(res => {
                                if (res.code == "success") {
                                    this.$Message.success("新建成功！");
                                    this.getPositionLevel();
                                    this.rankModal = false;
                                } else {
                                    if (resCode[res.code]) {
                                        this.$Message.error(resCode[res.code]);
                                    }
                                }
                            });
                        } else {
                            ApiPutPositionLe(qs.stringify(this.rankForm)).then(res => {
                                if (res.code == "success") {
                                    this.$Message.success("修改成功！");
                                    this.getPositionLevel();
                                    this.rankModal = false;
                                } else {
                                    if (resCode[res.code]) {
                                        this.$Message.error(resCode[res.code]);
                                    }
                                }
                            });
                        }
    
                    }
                });
            },
            // 点击编辑获取信息
            getRankCon(positionLevelId) {
                this.rankTitle = '修改职位级别';
                this.isEdit = true;
                ApiGetLevel(positionLevelId).then(res => {
                    if (res.code == "success") {
                        this.rankModal = true;
                        this.rankForm = res.data;
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            // 点击删除
            deletePositionLe(positionLevelId) {
                ApiDeletePositionLe(positionLevelId).then(res => {
                    if (res.code == "success") {
                        if (this.rankData.length == 1) {
                            this.rank.pageNum = this.rank.pageNum > 1 ? --this.rank.pageNum : 1;
                        }
                        this.$Message.success("删除成功！");
                        this.getPositionLevel();
                    } else {
                        if (resCode[res.code]) {
                            this.$Message.error(resCode[res.code]);
                        }
                    }
                });
            },
            reset() {
    
            }
        },
        watch: {
            $route(to, from) {}
        },
        mounted() {
            this.getPosition()
        }
    }
</script>

<style lang="scss" scoped>
    .rank-wrap {
        .rank-top {
            margin-bottom: 20px;
        }
        .span-right {
            text-align: right;
        }
    }
    
    .from-role {
        .ivu-input-number {
            width: 100%;
        }
    }
</style>
 
 
