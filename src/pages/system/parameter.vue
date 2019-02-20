/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-02 09:19:23 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-01-21 09:43:14
 * @instructions 参数配置页面
 */
<template>
  <div class="parameter">
    <Form :model="parameter" :label-width="120" ref="parameter" :rules="parameterInline">
      <FormItem label="是否电子签名">
        <RadioGroup v-model="parameter.isComponyMaintain">
          <Radio label="true"> 是 </Radio>
          <Radio label="false"> 否 </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="dictionaryCode" label="考勤系统">
        <Select v-model="parameter.dictionaryCode" @on-change="dictionaryCodeChange">
          <Option v-for="item in priorityList" :value="item.dictionaryCode" :key="item.dictionaryId">{{ item.dictionaryName }}</Option>
        </Select>
      </FormItem>
       <FormItem label="工作日工时" prop="workHour">
            <InputNumber :min="1" :step="0.5" :formatter="value => `${value}小时`" :parser="value => value.replace('小时', '')" v-model="parameter.workHour"></InputNumber>
        </FormItem>
      <FormItem label="钉钉CorpId" v-if="divShow" prop="corpid">
        <Input v-model="parameter.corpid" placeholder=" "></Input>
      </FormItem>
      <FormItem label="钉钉Corpsecret" v-if="divShow" prop="corpsecret">
        <Input v-model="parameter.corpsecret" placeholder=" "></Input>
      </FormItem>
      <FormItem label="钉钉日基本工时" v-if="divShow" prop="standardHour">
        <InputNumber v-model="parameter.standardHour" :min="0" :max="24"></InputNumber>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="putCompanySystemData('parameter')">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { ApiGetDict } from "@/api/api";

import {
  ApiGetCompanySystemData,
  ApiPutCompanySystemData
} from "@/api/system/parameter-api";
export default {
  data() {
    return {
      divShow: false,
      priorityList: [], // 考勤来源
      parameter: {
        isComponyMaintain: "",
        corpid: "",
        corpsecret: "",
        dictionaryCode: "",
        standardHour: 0,
        workHour:0,
      },
      componyMaintain: {
        systemId: "",
        code: ""
      },
      corpid: {
        systemId: "",
        code: ""
      },
      corpsecret: {
        systemId: "",
        code: ""
      },
      dictionary: {
        systemId: "",
        code: ""
      },
      standard: {
        systemId: "",
        code: ""
      },
      workHour:{
        systemId: "",
        code: ""
      },
      parameterInline: {
        // isComponyMaintain: [
        //   { required: true, message: "请选择是否电子签名！", trigger: "change" }
        // ],
        dictionaryCode: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        corpid: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ],
        corpsecret: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ],
        standardHour: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 考勤来源
    getDictSource() {
      let dictCode = "ATTENDANCE_SYS";
      let _this = this;
      ApiGetDict(dictCode).then(function(res) {
        if (res.code == "success") {
          _this.priorityList = res.data;
          _this.getCompanySystemData();
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    /**
     *  选择 考勤来源
     *  @param value {String} 选择当前考勤的 value 值
     * */
    dictionaryCodeChange(value) {
      if (value == "DING_SYS") {
        this.divShow = true;
      } else {
        this.divShow = false;
      }
    },
    // 请求数据
    getCompanySystemData() {
      let _this = this;
      ApiGetCompanySystemData().then(function(res) {
        if (res.code == "success") {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].code == "IS_ELECTRONIC_SIGNATURE") {
              if (res.data[i].value == 1) {
                _this.parameter.isComponyMaintain = "true";
              } else {
                _this.parameter.isComponyMaintain = "false";
              }
              _this.componyMaintain.systemId = res.data[i].systemId;
              _this.componyMaintain.code = res.data[i].code;
            } else if (res.data[i].code == "CORPID") {
              _this.parameter.corpid = res.data[i].value;
              _this.corpid.systemId = res.data[i].systemId;
              _this.corpid.code = res.data[i].code;
            } else if (res.data[i].code == "CORPSECRET") {
              _this.parameter.corpsecret = res.data[i].value;
              _this.corpsecret.systemId = res.data[i].systemId;
              _this.corpsecret.code = res.data[i].code;
            } else if (res.data[i].code == "ATTENDANCE_SYS") {
              // 考勤来源
              _this.parameter.dictionaryCode = res.data[i].value;
              _this.dictionary.systemId = res.data[i].systemId;
              _this.dictionary.code = res.data[i].code;
              if (res.data[i].value == "DING_SYS") {
                _this.divShow = true;
              } else {
                _this.divShow = false;
              }
            } else if (res.data[i].code == "DING_WORK_TIME") {
              // 基本工时
              _this.parameter.standardHour = res.data[i].value * 1;
              _this.standard.systemId = res.data[i].systemId;
              _this.standard.code = res.data[i].code;
            }else if(res.data[i].code == "WORKDAY_HOUR"){
              // 工作日工时
              _this.parameter.workHour = res.data[i].value * 1;
              _this.workHour.systemId = res.data[i].systemId;
              _this.workHour.code = res.data[i].code;
            }
          }
        } else {
          if (resCode[res.code]) {
            _this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    // 修改后，保存
    putCompanySystemData(name) {
      let _this = this;

      if (_this.parameter.isComponyMaintain == "true") {
        _this.parameter.isComponyMaintain = 1;
      } else {
        _this.parameter.isComponyMaintain = 0;
      }
      if (_this.parameter.standardHour == null) {
        _this.parameter.standardHour = 0;
      }
      let letList = [
        {
          value: _this.parameter.isComponyMaintain,
          systemId: _this.componyMaintain.systemId,
          code: _this.componyMaintain.code
        },
        {
          value: _this.parameter.corpid,
          systemId: _this.corpid.systemId,
          code: _this.corpid.code
        },
        {
          value: _this.parameter.corpsecret,
          systemId: _this.corpsecret.systemId,
          code: _this.corpsecret.code
        },
        {
          value: _this.parameter.dictionaryCode,
          systemId: _this.dictionary.systemId,
          code: _this.dictionary.code
        },
        {
          value: _this.parameter.standardHour,
          systemId: _this.standard.systemId,
          code: _this.standard.code
        },
        {
          value: _this.parameter.workHour,
          systemId: _this.workHour.systemId,
          code: _this.workHour.code
        }
      ];
      _this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutCompanySystemData(letList).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success("修改成功!");
              _this.getCompanySystemData();
            } else {
              if (resCode[res.code]) {
                _this.$Message.error(resCode[res.code]);
              }
            }
          });
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.getDictSource();
    }
  },
  mounted() {
    this.getDictSource();
  }
};
</script>
<style lang="scss">
.parameter {
  .ivu-input-number {
    width: 100%;
  }
}
</style>
