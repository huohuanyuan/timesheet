<template>
    <div class="down-div">
        <p class="title">
            <span> 移动端 </span>
        </p>
        <div class="content-wrap">
            <div class="content">
                <div class="content-left">
                    <div class="down-logo-div"> <img src="./../common/img/down-logo.png" alt="logo">
                        <span> 摩亦TMS(工时管理系统) </span>
                    </div>
                    <h3> 功能配置/数据导入导出/审批流程/各类统计/通知提醒 </h3>
                    <p class="p-title">
                        摩亦-工时管理系统，是记录和跟踪员工在执行项目任务期间的工作内容和所耗费工时，通过有效性审核，其工作内容和员工工时用以实现对项目进度以及员工工时的统计、管理，以达到员工绩效考核、项目人员成本核算。
                    </p>
                    <div>
                        <div class="img">
                            <img src="./../common/img/ios.png" alt="">
                            <p> iOS </p>
                        </div>
                        <div class="img android-img">
                            <img src="./../common/img/android.png" alt="">
                            <p> Android </p>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <img src="./../common/img/iphone.png" alt="">
                </div>
            </div>
        </div>
        <div class="footer">
            <img src="./../common/img/footer.png" alt="">
        </div>
    </div>
</template>

<script>
export default {};
</script>
<style lang="scss">
.down-div {
  .title {
    text-align: center;
    padding: 80px 0;
    span {
      padding: 8px 30px;
      background: #2dd6aa;
      font-size: 22px;
      color: #fff;
      border-radius: 20px;
    }
  }
  .content-wrap {
    .content {
      width: 80%;
      margin: auto;
      h3 {
        font-size: 20px;
        margin-left: 7px;
      }
      .p-title {
        margin: 15px 0 0 7px;
        color: #666666;
        font-size: 16px;
      }
      .img {
        display: inline-block;
        text-align: center;
        font-size: 16px;
        color: #2c2c2c;
        margin-top: 25px;
        img {
          width: 100px;
          height: 100px;
        }
      }
      .android-img{
        margin-left: 50px;
      }
    }
    .content-left {
      display: inline-block;
      width: 60%;
      vertical-align: top;
    }
    .content-right {
      display: inline-block;
      width: 35%;
      margin-left: 3%;
    }
    .down-logo-div {
      position: relative;
      span {
        font-size: 26px;
        position: absolute;
        top: 15px;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    img {
      width: 100%;
    }
  }
}
</style>
