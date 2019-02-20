import main from '@/pages/main'


//不作为main组件的子页面展示的页面
export const loginRouter = {
  path: '/login',
  name: 'lOGIN',
  component: resolve => {
    require(['@/pages/login.vue'], resolve);
  }
};
export const textLogin = {
  path: '/testLogin',
  name: 'testLogin',
  component: resolve => {
    require(['@/pages/testLogin.vue'], resolve);
  }
};

export const page404 = {
  path: '/404',
  name: 'error404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => {
    require(['@/pages/error-page/404.vue'], resolve);
  }

};
export const page403 = {
  path: '/403',
  name: 'error403',
  meta: {
    title: '无权限访问'
  },
  component: resolve => {
    require(['@/pages/error-page/403.vue'], resolve);
  }

};
export const helpPage = {
  path: "/help",
  name: "HELP_DOC",
  meta: {
    title: "帮助文档"
  },
  component: resolve => {
    require(["@/pages/help.vue"], resolve);
  }
};
// 下载页面
export const downPage = {
  path: "/down",
  name: "DOWN_DOC",
  meta: {
    title: "APP下载"
  },
  component: resolve => {
    require(["@/pages/down.vue"], resolve);
  }
};
//作为main组件 但是不包含在左侧菜单中
export const otherRouter = {
  path: '/',
  name: 'main', 
  component: main,
  meta: {
    requireAuth: false
  },
  children: [{
      path: 'home',
      title: '首页',
      meta: {
        requireAuth: false,
        parents: 'main'
      },
      name: "HOME",
      component: resolve => {
        require(['@/pages/home/home.vue'], resolve);
      }
    },
    {
      path: 'ownspace',
      title: '个人中心',
      meta: {
        requireAuth: false,
        parents: 'main'
      },
      name: "OWN_SPACE",
      component: resolve => {
        require(['@/pages/own-space/own-space.vue'], resolve);
      }
    },
  ]
}
//main组件，左侧菜单
export const appRouter = [{ //系统管理
    path: '/system',
    name: 'SYS_MAN',
    component: main,
    title: "系统管理",
    meta: {
      requireAuth: true
    },
    children: [{
        path: 'admin-company',
        title: '公司管理',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "COMP_MAN",
        component: resolve => {
          require(['@/pages/system/admin-company.vue'], resolve);
        }
      },
      {
        path: 'dictionary',
        title: '词典配置',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "DIC_CONF",
        component: resolve => {
          require(['@/pages/system/dictionary.vue'], resolve);
        },
      },
      {
        path: 'calendar',
        title: '公司日历',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "SALE_MAN_SELF",
        component: resolve => {
          require(['@/pages/system/calendar.vue'], resolve);
        },
      },
      {
        path: 'admincalendar',
        title: '公司日历',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "SALE_MAN",
        component: resolve => {
          require(['@/pages/system/admin-calendar.vue'], resolve);
        },
      },
      {
        path: 'notice',
        title: '公告管理',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "BULL_MAN",
        component: resolve => {
          require(['@/pages/system/notice.vue'], resolve);
        }
      }, //公告管理模块
      {
        path: 'auditcycle',
        title: '审核周期管理',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "CYC_MAN",
        component: resolve => {
          require(['@/pages/system/auditcycle.vue'], resolve);
        }
      }, //工时审核周期模块
      {
        path: 'worktime',
        title: '工时配置',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "TS_CONF",
        component: resolve => {
          require(['@/pages/system/worktime.vue'], resolve);
        }
      },
      {
        path: 'company-info',
        title: '公司详情',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "COMP_MAN_SELF",
        component: resolve => {
          require(['@/pages/system/company-info.vue'], resolve);
        }
      },
      {
        path: 'parameter',
        title: '参数配置',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "PARAM_CONF",
        component: resolve => {
          require(['@/pages/system/parameter.vue'], resolve);
        }
      },
      {
        path: 'version-control',
        title: '版本控制',
        meta: {
          requireAuth: true,
          parents: 'SYS_MAN'
        },
        name: "CTRL_VER",
        component: resolve => {
          require(['@/pages/system/version-control.vue'], resolve);
        }
      }
    ]
  },
  { //用户管理
    path: '/competence',
    name: 'ORG_MAN',
    component: main,
    title: "组织结构",
    meta: {
      requireAuth: true
    },
    children: [{
        path: 'role',
        title: '角色管理',
        meta: {
          requireAuth: true,
          parents: 'ORG_MAN'
        },
        name: "ROLE_MAN",
        component: resolve => {
          require(['@/pages/competence/role.vue'], resolve);
        }
      },
      {
        path: 'department',
        title: '部门管理',
        meta: {
          requireAuth: true,
          parents: 'ORG_MAN'
        },
        name: "DEP_MAN",
        component: resolve => {
          require(['@/pages/competence/department.vue'], resolve);
        }
      },
      {
        path: 'user',
        title: '用户管理',
        meta: {
          requireAuth: true,
          parents: 'ORG_MAN'
        },
        name: "USER_MAN",
        component: resolve => {
          require(['@/pages/competence/user.vue'], resolve);
        }
      },
       {
         path: 'rank',
         title: '职级管理',
         meta: {
           requireAuth: true,
           parents: 'ORG_MAN'
         },
         name: "RANK_MAN",
         component: resolve => {
           require(['@/pages/competence/rank.vue'], resolve);
         }
       }
    ]
  },
  { //项目管理
    path: '/study',
    name: 'STD_MAN',
    component: main,
    title: "项目管理",
    meta: {
      requireAuth: true
    },
    children: [{
        path: 'client',
        title: '客户管理',
        meta: {
          requireAuth: true,
          parents: 'STD_MAN'
        },
        name: "CLI_MAN",
        component: resolve => {
          require(['@/pages/study/client.vue'], resolve);
        }
      },
      {
        path: 'task',
        title: '任务管理',
        meta: {
          requireAuth: true,
          parents: 'STD_MAN'
        },
        name: "TASK_MAN",
        component: resolve => {
          require(['@/pages/study/task.vue'], resolve);
        }
      },
      {
        path: 'project',
        title: '项目管理',
        meta: {
          requireAuth: true,
          parents: 'STD_MAN'
        },
        name: "STD_SUB_MAN",
        component: resolve => {
          require(['@/pages/study/project.vue'], resolve);
        }
      },

    ]

  },
  { //工时管理
    path: '/timesheet',
    name: 'TS_MAN',
    title: "工时管理",
    component: main,
    meta: {
      requireAuth: true
    },
    children: [{
        path: 'timedeclare',
        title: '工时申报',
        name: "TS_DCL",
        meta: {
          requireAuth: true,
          parents: 'TS_MAN'
        },
        component: resolve => {
          require(['@/pages/timesheet/time-declare.vue'], resolve);
        },
      },
      {
        path: 'timecheck',
        title: '工时审核',
        name: "TS_APV",
        meta: {
          requireAuth: true,
          parents: 'TS_MAN'
        },
        component: resolve => {
          require(['@/pages/timesheet/time-check.vue'], resolve);
        },
      },
      {
        path: 'stafftime',
        title: '员工工时',
        name: "TS_STAFF",
        meta: {
          requireAuth: true,
          parents: 'TS_MAN'
        },
        component: resolve => {
          require(['@/pages/timesheet/staff-time.vue'], resolve);
        },
      },
      {
        path: 'prostafftime',
        title: '项目员工工时',
        name: "TS_PROJ_STAFF",
        meta: {
          requireAuth: true,
          parents: 'TS_MAN'
        },
        component: resolve => {
          require(['@/pages/timesheet/pro-staff-time.vue'], resolve);
        },
      }
    ]
  },
  { //报表中心
    path: '/report',
    name: 'REP_MAN',
    title: "报表中心",
    component: main,
    meta: {
      requireAuth: true
    },
    children: [{
        path: 'staff-report',
        title: '员工工时明细报表',
        name: "REP_TS_DETAIL",
        meta: {
          requireAuth: true,
          parents: 'REP_MAN'
        },
        component: resolve => {
          require(['@/pages/report/staff-report.vue'], resolve);
        },
      },
      {
        path: 'staff-rate-report',
        title: '员工工时利用率表',
        name: "REP_TS_UR",
        meta: {
          requireAuth: true,
          parents: 'REP_MAN'
        },
        component: resolve => {
          require(['@/pages/report/staff-rate-report.vue'], resolve);
        },
      },
      {
        path: 'project-report',
        title: '项目员工工时报表',
        name: "REP_TS_PROJ",
        meta: {
          requireAuth: true,
          parents: 'REP_MAN'
        },
        component: resolve => {
          require(['@/pages/report/project-report.vue'], resolve);
        },
      },
      {
        path: 'project-tack-report',
        title: '项目任务工时报表',
        name: "REP_TS_TASK",
        meta: {
          requireAuth: true,
          parents: 'REP_MAN'
        },
        component: resolve => {
          require(['@/pages/report/project-tack-report.vue'], resolve);
        },
      },
      {
        path: 'staff-attendance-report',
        title: '员工考勤报表',
        name: "REP_ATT_DTL",
        meta: {
          requireAuth: true,
          parents: 'REP_MAN'
        },
        component: resolve => {
          require(['@/pages/report/staff-attendance-report.vue'], resolve);
        },
      },
      {
        path: 'staff-month-report',
        title: '员工项目月工时报表',
        name: "REP_DSPM_TS",
        meta: {
          requireAuth: true,
          parents: 'REP_MAN'
        },
        component: resolve => {
          require(['@/pages/report/staff-month-report.vue'], resolve);
        },
      }
    ]
  },
  { //考勤管理
    path: '/attendance',
    name: 'ATT_MAN',
    title: "考勤管理",
    component: main,
    meta: {
      requireAuth: true
    },
    children: [{
        path: 'attendanceGroup',
        title: '考勤组管理',
        name: "ATT_GRP_MAN",
        meta: {
          requireAuth: true,
          parents: 'ATT_MAN'
        },
        component: resolve => {
          require(['@/pages/attendance/attendance-group.vue'], resolve);
        },
      },
      {
        path: 'staffAttendance',
        title: '员工考勤管理',
        name: "ATT_USER_MAN",
        meta: {
          requireAuth: true,
          parents: 'ATT_MAN'
        },
        component: resolve => {
          require(['@/pages/attendance/staff-attendance.vue'], resolve);
        },
      },
      {
        path: 'leaveManage',
        title: '假期类型管理',
        name: "ATT_LEAVE_TYPE_MAN",
        meta: {
          requireAuth: true,
          parents: 'ATT_MAN'
        },
        component: resolve => {
          require(['@/pages/attendance/leave-manage.vue'], resolve);
        },
      },
      {
        path: 'apvGroup',
        title: '审批流程组管理',
        name: "ATT_APV_GROUP_MAN",
        meta: {
          requireAuth: true,
          parents: 'ATT_MAN'
        },
        component: resolve => {
          require(['@/pages/attendance/approval-group.vue'], resolve);
        },
      },
      {
        path: 'approval-process',
        title: '审批流程管理',
        name: "ATT_APV_PROC_MAN",
        meta: {
          requireAuth: true,
          parents: 'ATT_MAN'
        },
        component: resolve => {
          require(['@/pages/attendance/approval-process.vue'], resolve);
        },
      }
    ]

  }
];


// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  textLogin,
  loginRouter,
  otherRouter,
  ...appRouter,
  page404,
  page403,
  helpPage,
  downPage
]
