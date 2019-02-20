#!/usr/bin/python
# ^_^ coding: utf-8 ^_^
from datetime import datetime
from fabric.api import *
from fabric.colors import *
import time
####多线程并发执行
env.parallel = True
#### 远程服务器信息
env.roledefs = {
'timesheet':['root@172.17.169.206:22']

}
env.password = 'kllk-1234'


###################timesheet_web部署##############################

@roles('timesheet')
def timesheet_web_deploy():
    ### 备份远程数据文件
    tag = datetime.now().strftime('%Y.%m.%d')
    remote_file = '/data/timesheet/static/dist'
    backup_file = '/data/code/backup/timesheet_web/dist%s'   % tag
    now_file = '/data/jenkins/workspace/timesheet_web/dist'
    ####遇到错误继续执行，不退出
    with settings(warn_only=True):
        ### 删除之前旧的备份
        run('rm -rf %s' % backup_file)
    ### 捕获异常，执行失败打印失败（红色），成功（绿色）
    try:
        get(remote_file,backup_file)
        with settings(warn_only=True):
            run('rm -rf %s' % remote_file)
        with lcd('/data/jenkins/workspace/timesheet_web/'):
            put('dist','/data/timesheet/static/')
            local('rm -rf dist')
        print green('successful')
    except SystemExit:
        print red('failure')

####################timesheet部署##############################


