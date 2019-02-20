/*
 * @Author: chengshanshan 
 * @Date: 2018-07-04 16:29:56 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2019-02-14 11:05:28
 */

//异步请求返回code
export const resCode = {
  password_error: "密码错误!",
  email_duplication: "该邮箱已使用!",
  dept_exits: "该部门已存在!",
  dept_possess_user: "该部门下有用户存在，无法删除!",
  param_error: "参数错误!",
  unmodified: "信息未发生任何修改!",
  fail: "请求失败!",
  system_exception: "系统异常!",
  unauthorized: "没有权限!",
  offline: "已离线!",
  user_not_exist: "用户不存在!",
  expired: "密码过期!",
  reset_fail: "重置密码失败!",
  exists_name: "名称已存在!",
  incorrect_param: "批量导入时非法的参数!",
  using_role: "该角色正在使用，无法删除!",
  user_not_exist: "用户不存在!",
  not_activated: "账号未激活，请联系公司管理员!",
  lock_company: "公司未激活，请联系公司管理员!",
  exists_calender: "日历已存在，不允许重复生成!",
  has_declared: "该项目已提交工时申报单,无法删除!",
  exists_code: "编码已存在!",
  exists_staff_number: "工号重复!",
  exists_phone: "手机号已存在!",
  exists_mail: "邮箱已存在!",
  exists_contract_code: "合同编码已存在!",
  sys_busy: "系统繁忙，请稍后再试!",
  location_result_exception: "定位结果异常!",
  time_result_exception: "时间结果异常!",
  exists_apv_proc: "存在审批流程!",
  company_name_duplication: "公司名重复!",
  empty_role: "角色已创建，但未赋予权限，请在角色和权限配置页面进行配置!",
  lock_tsheet: "工单已锁定!",
  too_many: "您申报的工时超过99个审批人,请适量减少!",
  not_exists_line_manager: "上级领导不存在!",
  not_exists_proj_manager: "项目经理不存在!",
  un_apv_tsheet_form: "未审批的工时审批单!",
  un_apv_att_form: "该员工还有待审批的考勤工单, 不能删除!",
  exists_line_staff: "请先修改当前项目员工的直属领导，再删除!",
  exists_manage_project: "存在管理的项目!",
  exists_attend_group_name: "考勤组名称已存在！",
  exists_task_code: "任务编码已存在!",
  non_dept:"请选择部门"
}
// 左侧导航的icon ，和路由的name 对应
export const menuIcon = {
  HOME: "home",
  SYS_MAN: "gear-b",
  PARAM_CONF: "levels",
  DIC_CONF: "ios-book",
  TEXT_CONF: "paintbrush",
  COMP_MAN: "ios-settings-strong",
  BULL_MAN: "volume-high",
  USER_MAN: "lock-combination",
  ROLE_MAN: "person-add",
  DEP_MAN: "social-buffer",
  USER_MAN: "person",
  ORG_MAN: "lock-combination",
  STD_MAN: "ios-briefcase",
  STD_SUB_MAN: "briefcase",
  CLI_MAN: "android-contact",
  TASK_MAN: "android-list",
  TS_MAN: "clock",
  TS_DCL: "ios-compose",
  TS_APV: "android-checkbox",
  TS_STAFF: "android-checkbox",//员工工时
  TS_PROJ_STAFF:"android-checkbox",//项目员工工时
  ATT_MAN: "ios-paper",
  ATT_GRP_MAN: "ios-paper-outline",
  ATT_USER_MAN: "ios-list",
  ATT_LEAVE_TYPE_MAN: "cube",
  ATT_APV_GROUP_MAN: "ios-browsers",
  REP_MAN: "ios-settings-strong",
  REP_TS_DETAIL: "ios-people", //员工工时明细报表
  REP_TS_PROJ: "stats-bars", //项目工时报表
  REP_HA: "ios-people-outline",
  REP_FA: "ios-albums",
  REP_TS_UR: "ios-paper",
  TS_CONF: "pinpoint", //手动同步
  CYC_MAN: "clock", //工时周期管理
  COMP_MAN_SELF: "ios-pricetags", //公司管理
  SALE_MAN_SELF: "calendar", //日历管理
  SALE_MAN: "calendar", //日历管理
  REP_TS_TASK: "ios-crop", // 项目任务工时报表
  ATT_APV_PROC_MAN: "ios-medical-outline", // 审批流程管理
  REP_ATT_DTL: "android-contacts", // 员工考勤报表
  CTRL_VER: "speakerphone", // 版本控制
  RANK_MAN: 'android-people', // 职级管理
  REP_DSPM_TS: 'ios-bookmarks' // 员工项目月工时报表
}
