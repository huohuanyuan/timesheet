/*
 * @Author: chengshanshan 
 * @Date: 2019-01-03 16:32:53 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-21 15:17:12
 * @instraction:项目字典树
 */

<template>
  <ul class="tree-list" style="positon:relative">
    <li class="leaf noly-node">
      <div class="node">
        <div>
          全部
        </div>
        <Poptip @on-popper-show="popperShow" v-if="dicAdd" v-model="popVisible.visible">
          <Icon type="android-add" size="20" style="cursor:pointer; margin: 3px 5px 0 0; "></Icon>
          <div slot="content">
            <Form ref="dicCategoryForm" :model="dicCategoryForm" label-position="top" :rules="dicCategoryRule">
              <FormItem label="新增职位" style="margin-bottom:10px" prop="positionName">
                <Input size="small" v-model.trim="dicCategoryForm.positionName"></Input>
              </FormItem>
              <Button long type="primary" size="small" @click="newCategory('dicCategoryForm')">保存</Button>
            </Form>
          </div>
        </Poptip>
      </div>
    </li>
    <ul class="tree-list">
      <li v-for="(item , index) in treeList" class="leaf" :key="item.positionId">
        <div :class="{'node':true,'active':index == currIndex}" @click="dicItemClick(index,item)">
          <div>
            {{ item.positionName }}
          </div>
          <div class="icons">
            <Poptip @on-popper-show="editPopShow(item,index)" v-if="dicEdit" v-model="popVisible['visible_'+index]">
              <Icon type="edit" size="16" style="cursor:pointer; margin: 5px;"></Icon>
              <div slot="content">
                <Form ref="editCategoryForm" :model="editCategoryForm" label-position="top" :rules="dicCategoryRule">
                  <FormItem label="修改父词典" style="margin-bottom:10px" prop="positionName">
                    <Input size="small" v-model.trim="editCategoryForm.positionName"></Input>
                  </FormItem>
                  <Button long type="primary" size="small" @click.stop="editCategory('editCategoryForm')">保存</Button>
                </Form>
              </div>
            </Poptip>
            <Poptip style="color:#000" confirm title="您确定要删除这条数据吗?" @on-ok="deleteCategory(item)">
              <Icon type="ios-trash-outline" size="20" style="cursor:pointer"></Icon>
            </Poptip>
          </div>
        </div>
      </li>
    </ul>
  </ul>
</template>

<script>
  export default {
    props: {
      treeList: {
        type: Array,
        default: []
      },
      dicAdd: {
        type: Boolean,
        default: false
      },
      dicEdit: {
        type: Boolean,
        default: false
      },
      dicDel: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currIndex: -1,
        dicCategoryForm: {
          positionName: ""
        },
        positionId: -1, //修改删除的项目字典id
        editCategoryForm: {
          positionName: ""
        },
        dicCategoryRule: {
          positionName: [{
            required: true,
            message: " ",
            trigger: "blur"
          }]
        },
        //关闭弹框
        popVisible: {
          visible: false,
        },
        editIndex: "",
  
      };
    },
    methods: {
      popperShow() {
        this.$refs["dicCategoryForm"].resetFields();
      },
      newCategory(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.$emit("newCategory", this.dicCategoryForm);
          }
        });
      },
      editPopShow(item, index) {
        this.positionId = item.positionId;
        this.editCategoryForm.positionName = item.positionName;
        this.editIndex = index;
      },
      editCategory() {
        this.$emit("editCategory", {
          positionName: this.editCategoryForm.positionName,
          positionId: this.positionId,
          editIndex: this.editIndex
        });
      },
      dicItemClick(index, item) {
        this.currIndex = index;
        this.$emit("dicItemClick", item);
      },
      deleteCategory(data) {
        this.$emit("deleteCategory", data.positionId);
      },
      //关闭弹框方法，父级组件调用
      popClose(key) {
        this.popVisible[key] = false;
      }
    },
    watch: {
      //根据treeList方法设置弹框的初始状态
      treeList: function(val, oldVal) {
        let len = val.length;
        let i = 0;
        while (i < len) {
          this.popVisible['visible_' + i] = false;
          i++;
        }
  
      }
    }
  };
</script>

<style lang="scss" scoped>
  .tree-list {
    ul {
      padding-left: 20px;
    }
    .leaf {
      position: relative;
      padding: 5px 5px 5px 20px;
      width: 100%;
      z-index: 1;
      line-height: 24px;
      .node {
        display: flex;
        justify-content: space-between;
        border: 1px solid #f5f7f9;
        background-color: #f5f7f9;
        border-radius: 5px;
        padding: 5px;
        color: #1F2833;
        &.active {
          color: #2B65F0;
          border: 1px solid #2B65F0;
        }
      }
      &.noly-node {
        padding-left: 0;
        &:before {
          border: none;
        }
        &:after {
          border: none;
        }
      }
      &:hover {
        cursor: pointer;
      }
      &:before {
        content: "";
        position: absolute;
        border-left: 1px dashed #ddd;
        height: 100%;
        top: -5px;
        left: -2px;
        width: 1px;
        z-index: 0;
      }
      &:after {
        content: "";
        position: absolute;
        border-top: 1px dashed #ddd;
        height: 20px;
        top: 18px;
        left: 0;
        width: 20px;
      }
    }
  }
</style>


