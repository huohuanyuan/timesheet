#!groovy
pipeline{
    agent any
    //定义仓库地址
    environment {
        REPOSITORY="git@47.93.138.189:it/timemanagement_vue.git"
    }

    stages {

        stage('获取代码'){
            steps {
                echo "start fetch code from git:${REPOSITORY}"
                git "${REPOSITORY}"
            }
        }

        stage('代码静态检查'){
            steps {
                //伪代码检查
                echo "start code check"
            }
        }       

        stage('编译'){
            steps {
                    //重新打包
                    sh '/usr/local/bin/npm  run build'
                }
        }

        
        stage('版本发布'){
            steps  {
                    //版本发布
                    sh 'fab -f fabfile.py  timesheet_web_deploy'
                   
                }
            
        }
                  

    }
}