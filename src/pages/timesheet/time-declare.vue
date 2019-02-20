/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:58:24 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-07-05 11:03:50
 * @instructions： 工时填报
 */

<template>
  <div class="time-declare-wrap">
    <declare-record v-show="showRegRecord"></declare-record>
    <declare-form v-show="showRegForm"></declare-form>
    <declared-view v-show="showRegView"></declared-view>
    <modify-declare-form v-show="showRegModify"></modify-declare-form>
  </div>
</template>
<script>
import DeclareRecord from "./components/declare-record";
import DeclareForm from "./components/declare-form";
import DeclaredView from "./components/declared-view";
import ModifyDeclareForm from "./components/modify-declare-form";

export default {
  components: {
    DeclareRecord,
    DeclareForm,
    DeclaredView,
    ModifyDeclareForm
  },
  watch: {
    $route(to, from) {
      this.$store.commit("showRegWrap", "regRecord");
      //请求工单列表
      this.$store.commit("getTsheetList");
    }
  },
  computed: {
    showRegRecord() {
      return this.$store.state.timeSheet.showRegWrap.regRecord;
    },
    showRegForm() {
      return this.$store.state.timeSheet.showRegWrap.regForm;
    },
    showRegView() {
      return this.$store.state.timeSheet.showRegWrap.regView;
    },
    showRegModify() {
      return this.$store.state.timeSheet.showRegWrap.regModify;
    },
    filterStatus() {
      return this.$store.state.timeSheet.declareFilterStatus;
    }
  },
  created() {
    this.$store.commit("showRegWrap", "regRecord");
    //请求工单列表
    this.$store.commit("getTsheetList", { status: this.filterStatus });
  }
};
</script>