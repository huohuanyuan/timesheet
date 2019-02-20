/*
 * @Author: chengshanshan 
 * @Date: 2018-07-02 09:56:07 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-07-05 14:03:28
 * @instructions： 系统使用手册
 */
<template>
  <div class="help-content">
  
  <h1>工时管理系统使用手册</h1>
<hr />

<h2>主界面介绍</h2>
<h3>登录界面</h3>
<p><img src="static/instruction-img/1529907668117.png" alt="Alt text" /></p>
</br>
<h3>主界面</h3>
<p>用户在登录页面输入用户名和密码进行登录，登录成功后即进入用户的主界面。  
</p>
<pre><code>  注：用户名为管理员登记的用户邮箱, 初始密码为：123456, 首次登录需要修改密码 
</code></pre>

<p><img src="static/instruction-img/1530003321158.png" alt="Alt text" /></p>
<p><strong>主要功能</strong>   
</p>
<p>1.&nbsp;页面导航，显示当前所在页面路径<br />
2.&nbsp;工时申报快捷入口，点击可以直接跳转到申报页面<br />
3.&nbsp;当前打开页签<br />
4.&nbsp;页签操作按钮，可选择“关闭所有”或者“关闭其他”<br />
5.&nbsp;待办中心，分类显示当前需要用户去处理的任务，点击可快速进行任务处理<br />
6.&nbsp;系统通知公告 <br />
7.&nbsp;日历日程      
</p>
</br>
<h3>个人中心页面</h3>
<p>点击用户名打开下拉列表选择“个人中心”，即进入个人中心页面。  <br />
<img src="static/instruction-img/1530003402062.png" alt="Alt text" /></p>
<p><strong>个人中心功能</strong>  
</p>
<p>1.&nbsp;修改个人头像<br />
2.&nbsp;修改密码<br />
3.&nbsp;查看用户参与项目<br />
4.&nbsp;查看用户工时<br />
5.&nbsp;查看用户考勤情况  <br />
6.&nbsp;查看用户假期信息 
</p>
</br>
<h2>功能介绍</h2>
<h3>系统管理</h3>
<h4>参数配置</h4>
<p><img src="static/instruction-img/1529994173599.png" alt="Alt text" /></p>
<p><strong>参数配置主要功能</strong>  
</p>
<p>1.&nbsp;设置工时审批是否需要进行电子签名，如果选择“是”，在进行工时审批是需要输入密码进行电子签名   
</p>
<p>2.&nbsp;设置考勤数据来源  
</p>
</br>
<h4>词典配置</h4>
<p><img src="static/instruction-img/1529994399533.png" alt="Alt text" />   
</p>
<p><strong>词典配置主要功能</strong>  
</p>
<p>1.&nbsp;词典类别分类，点击展示对应类别的词典数据  
</p>
<p>2.&nbsp;词典列表  
</p>
<p>3.&nbsp;添加词典数据  
</p>
</br>
<h4>公司管理</h4>
<p><img src="static/instruction-img/1530003608184.png" alt="Alt text" />   
</p>
<p><strong>公司管理主要功能</strong>  
</p>
<p>1.&nbsp;上传公司logo,上传的logo会出现在系统的左上角位置（如上图3标识位置）</p>
<p>2.&nbsp;公司信息修改     
</p>
</br>
<h4>公告管理</h4>
<p><img src="static/instruction-img/1530003694682.png" alt="Alt text" /></p>
<p><strong>公告管理主要功能</strong>  
</p>
<p>1.&nbsp;添加新的公告信息，添加新的公告信息时需要指定“开始时间”、“结束时间”、“状态”，只有在指定时间范围内并且公告状态为“发布”状态的公告信息才会在首页展示<br />
2.&nbsp;编辑公告<br />
3.&nbsp;关闭/发布公告<br />
4.&nbsp;删除公告<br />
5.&nbsp;通过“公告标题”、“状态”对公告信息进行检索  
</p>
</br>
<h4>工时周期管理</h4>
<p>工时周期管理主要用于设定员工的申报周期、申报时间、重报时间等信息，可以根据需要设置多个周期，添加员工到各个周期，实现申报周期灵活管理。    
</p>
<p><img src="static/instruction-img/1529997391547.png" alt="Alt text" /></p>
<p><strong>工时周期主要功能</strong>  
</p>
<p>1.&nbsp;添加工时周期    
</p>
<p><img src="static/instruction-img/1529997284500.png" alt="Alt text" />  
</p>
<p>申报周期可以选择每天、每周、每两周或者每月申报一次，申报日期可以指定为在申报结束的0-3天内进行申报，重报日期可以选择在申报被驳回的0-2天内进行重新申报。</p>
<blockquote>
<p>例如：申报周期名称为“周期一”，申报周期选择“周”,申报日期选择“2”,重报日期选择“2”，那么在2018年6月份第一个申报周期为2018-06-04——2018-06-10，在11日至12日可以进行这个周期的工时申报，如果在2018-06-13日工时申报被驳回，那么在14日至15日可以进行重新申报。</p>
</blockquote>
<p>2.&nbsp;修改当前工时周期信息<br />
   修改“申报周期”字段，如果当月周期尚未生成即时生效，如果当月周期已经生成则从下个月开始生成，修改申报日期和重报日期字段，即时生效。</p>
<blockquote>
<p>例如：“周期一”的申报周期由“周”改为“月”，如果当月的周期已经生成（可点击“查看”按钮，查看当月周期是否已经生成），那么从下个月开始按照“月”生成周期；如果当月的周期尚未生成，则从当月开始按照“月”生成周期。</p>
</blockquote>
<p>3.&nbsp;查看周期信息，包括周期的基本信息，以及周期内的员工，以及以生成的周期<br />
4.&nbsp;点击“员工”为周期添加员工，添加到周期内的员工遵守对应周期规则进行工时申报<br />
5.&nbsp;生成工时周期，系统默认会每月自动生成周期，用户也可以在此选择月份手动生成该月的周期。   
</p>
<p><img src="static/instruction-img/1530000451874.png" alt="Alt text" /> <br />
6.&nbsp;删除工时周期    
</p>
</br>
<h4>手动同步</h4>
<p><img src="static/instruction-img/1530001370452.png" alt="Alt text" />     
</p>
<p><strong>手动同步主要功能</strong>  
</p>
<ol>
<li>获取对应时间段钉钉员工的考勤时间  
</li>
<li>将钉钉上的员工信息同步到工时系统，避免手动录入员工信息的操作。   
</li>
</ol>
</br>
<h4>日历管理</h4>
<p>日历管理主要用于设定公司的工作日、休息日    
</p>
<p><img src="static/instruction-img/1530002155296.png" alt="Alt text" /></p>
<ol>
<li>当天日期，点击可快速回到当月日历</li>
<li>日历翻页</li>
<li>公司工作日/休息日的设置  
</li>
</ol>
<p><img src="static/instruction-img/1530002251632.png" alt="Alt text" />  
</p>
<p>根据需要可以设定星期日至星期六为工作日，并且选择生效日期，如果选择“覆盖节假日”，那么工作日的设定会覆盖掉法定假节日的设定，所有设置从“生效日期”当天开始；<strong>重置日历</strong>用于清除某段时间的日历设置。
</p>
<p>4. 单独设置某一天的日期类型，可设置为“工作日/休息日/节假日/调班日”  
</p>
<p><img src="static/instruction-img/1530002712154.png" alt="Alt text" />  
</p>
<pre><code>注：只能对有效范围内的日期进行设定
</code></pre>
</br>
<h3>组织结构</h3>
<h4>角色管理</h4>
<p>系统默认提供8种角色，用户可以根据需要自行添加或者删除角色，并且进行角色权限配置
<img src="static/instruction-img/1530003841973.png" alt="Alt text" /></p>
<p><strong>角色管理主要功能</strong>  
</p>
<p>1.&nbsp;添加角色信息   
</p>
<p><img src="static/instruction-img/1530166316924.png" alt="Alt text" /></p>
<p>角色类型分为“行政”和“项目”两个类型，“项目”类型的角色，可以在进行项目管理是使用，选择角色模板，可为新添加的角色添加与模板角色相同的权限。   
</p>
<blockquote>
<p>例如：此处可以建立角色名称为“项目组长”的项目角色，使用”项目成员“的角色模板，在进行项目管理的时候就可以给员工指定“项目组长”这个角色。  
</p>
</blockquote>
<p>2.&nbsp;对角色进行权限分配    
</p>
<p><img src="static/instruction-img/1530167231369.png" alt="Alt text" /></p>
<blockquote>
<p>例如：在上一步骤创建了“项目组长”这个角色，使用了“项目成员”的角色模板，”项目组长“角色默认会配置和”项目成员“相同的权限，可以点击权限按钮，对权限进行添加或删除。</p>
</blockquote>
<p>3.&nbsp;修改角色信息<br />
4.&nbsp;删除角色  
</p>
</br>
<h4>部门管理</h4>
<p>部门管理用于建立公司组织结构  <br />
<img src="static/instruction-img/1530005252048.png" alt="Alt text" /></p>
<p><strong>部门管理主要功能</strong>  
</p>
<ol>
<li>公司组织结构树，点击对应部门则可以检索该部门下的子部门，或者在该部门下添加子部门。  
</li>
<li>添加部门   <br />
<img src="static/instruction-img/1530068524517.png" alt="Alt text" />   
</li>
</ol>
<p>给某个部门下添加子部门，则需要点击左边的公司组织结构树，进入到该部门下，则可以直接给该部门添加子部门。<br />
3. 查看部门信息 <br />
4. 修改部门信息<br />
5. 删除部门   
</p>
</br>
<h4>用户管理</h4>
<p>用户管理主要用于向部门当中添加员工 <br />
<img src="static/instruction-img/1530070818817.png" alt="Alt text" /></p>
<p><strong>用户管理主要功能</strong>  
</p>
<p>1.&nbsp;公司组织结构树，点击对应部门则可以检索该部门下的员工<br />
2.&nbsp;新增员工 <br />
<img src="static/instruction-img/1530068853910.png" alt="Alt text" />  
</p>
<p>在左边的公司组织结构选择对应部门，单击“新增”按钮，即可在该部门下添加员工，<strong>此处登记的“邮箱”即为用户登录系统的用户名</strong>  
</p>
<p>3.&nbsp;员工批量导入<br />
点击“下载模板”按钮，下载excel模板，录入员工信息后，点击“导入”，上传编辑好的员工信息表，即可完成员工信息的批量导入    
</p>
<p>4.&nbsp;导出系统中的员工信息  
</p>
<p>5.&nbsp;新添加的员工为“冻结”状态，点击“激活”，系统会向员工邮箱发送邮件，员工状态为“激活”时才可以登录使用系统   
</p>
<p>6.&nbsp;冻结员工账号，账号冻结后员工将无法再登录系统，也无法将员工添加到项目当中 
</p>
<h3>项目管理</h3>
<h4>客户管理</h4>
<p>添加公司客户信息，可以将项目与客户进行绑定。
<img src="static/instruction-img/1530088113820.png" alt="Alt text" /></p>
<p><strong>客户管理主要功能</strong>  
</p>
<p>1.&nbsp;添加客户信息  
</p>
<p><img src="static/instruction-img/1530168256712.png" alt="Alt text" />  
</p>
<blockquote>
<p>例如：此处可以创建名称为“客户1”的客户信息</p>
</blockquote>
<p>2.&nbsp;修改客户信息  
</p>
<p>3.&nbsp;删除客户  
</p>
</br>
<h4>项目管理</h4>
<p>添加项目信息，分配项目任务<br />
<img src="static/instruction-img/1530236266979.png" alt="Alt text" /></p>
<p><strong>项目管理主要功能</strong>   
</p>
<p>1.&nbsp;添加项目信息<br />
<img src="static/instruction-img/1530163617452.png" alt="Alt text" />  
</p>
<p><strong>审核类型</strong>选择“部门主管”，则该项目的工时审批由“部门经理”审批；选择“项目主管”，则该项目的工时审批由“项目经理”进行审批。  
</p>
<p><strong>是否模板</strong>选择“是”，当前建立的项目基本信息可以当做模板使用，再次添加项目时，可以直接选择模板，快速建立项目。</p>
<p>2.&nbsp;完善项目信息，在创建完项目之后，点击“编辑”完善项目信息   
</p>
<p>2.1  添加项目客户，并且设定是否为该项目的主要客户</p>
<p>
<img src="static/instruction-img/1530164892105.png" alt="Alt text" />   
</p>
<p><img src="static/instruction-img/1530164872024.png" alt="Alt text" />  
</p>
<blockquote>
<p>例如：此处可以添加“客户1”为项目客户，并且将其设为主要客户</p>
</blockquote>
<p>2.2  添加参与项目的部门，并且设定该部门是否主要部门，添加“项目部门”后，即可选择该部门的员工添加到项目之中
<img src="static/instruction-img/1530165000256.png" alt="Alt text" /><br />
<img src="static/instruction-img/1530165006605.png" alt="Alt text" />   
</p>
<blockquote>
<p>例如：此处可以将“摩亦医药技术有限公司”设为项目责任部门，并且将“部门2”设为主要责任部门，这样就可以在下一步添加项目员工时选择“摩亦医药技术有限公司”的员工添加到项目当中了。</p>
</blockquote>
<p>2.3 添加参与项目的员工，指定员工角色，分配工时</p>
<p>
<img src="static/instruction-img/1530167439238.png" alt="Alt text" />  
</p>
<p>点击项目员工列表中的<strong>“编辑”</strong>按钮，可以修改员工的工时和项目角色  
</p>
<p><img src="static/instruction-img/1530167659922.png" alt="Alt text" />   
</p>
<p>2.4 设置项目任务<br />
<img src="static/instruction-img/1530169091834.png" alt="Alt text" />   
</p>
<p>点击任务列表中的<strong>“编辑”</strong>按钮，可以修改项目任务的基本信息  
</p>
<p><img src="static/instruction-img/1530169098233.png" alt="Alt text" /></p>
<blockquote>
<p>例如：此处可以创建“任务1-1”、“任务1-2”两个任务</p>
</blockquote>
<p>3.&nbsp;以excel的格式导出所有项目信息
</p>
</br>
<h4>任务管理</h4>
<p>对所有项目的项目任务统一管理，支持导入、导出任务信息  
</p>
<p><img src="static/instruction-img/1530169867751.png" alt="Alt text" /></p>
<p><strong>任务管理主要功能</strong>   
</p>
<ol>
<li>
<p>导入任务信息  <br />
点击“下载模板”，下载模板表格，填写好任务信息后点击“导入”，上传excel文件即可导入任务信息。  
</p>
</li>
<li>
<p>导出任务列表  
</p>
</li>
</ol>
</br>
<h3>工时管理</h3>
<p><strong>工时申报单的几种状态解释：</strong>  
</p>
<ul>
<li>未提交：申报单保存为草稿，尚未进行申报操作</li>
<li>审核中：申报单已经提交申报，但还未进行审批</li>
<li>审核通过：申报单审核通过</li>
<li>审核失败：申报单审核未通过</li>
<li>过期锁定：申报单保存为草稿，过了申报截止日期，还未进行申报，就处于“过期锁定”状态，“过期锁定”状态的申报单需要审批者进行“解锁”操作后，才可以再次申报</li>
</ul>
</br>
<h4>工时申报</h4>
<p><img src="static/instruction-img/1530174521299.png" alt="Alt text" /></p>
<p><strong>工时申报主要功能</strong>  
</p>
<p>1.&nbsp;新增工时申报单   
</p>
<p>1.1 点击“新增”按钮，选择周期，点击“填报”，即可进行工时申报。  
</p>
<p><img src="static/instruction-img/1530174661942.png" alt="Alt text" /> </p>
<p>1.2 选择对应的项目和任务，填写对应工时，点击添加备注的按钮，添加当天的“工作汇报”和“问题总结”  
</p>
<p><img src="static/instruction-img/1530249140913.png" alt="Alt text" /></p>
<pre><code>有效工时:已申报工时/当天总工时，例如:19日的有效工时为4/8，表示19日的总工时为8,已经申报了4个工时。    
</code></pre>

<p><img src="static/instruction-img/1530176520817.png" alt="Alt text" />  
</p>
<p>1.3  工时申报单填写完成后点击“申报”按钮，可以直接将申报单提交到审批；点击“保存”按钮，将该工时申报单保存为草稿  
</p>
<pre><code>  注：从周期的第一天开始可以进行工时填写并保存工单（不能申报），在申报周期内方可进行工单申报。
</code></pre>
<blockquote>
<p>例如：在工时周期管理功能中，设置的“周期一”，申报周期选择“周”，申报日期选择“2”，“周期一”在2018年6月份的第一个申报周期为2018-06-04——2018-06-10,那么从04日起可以进行“周期一”的工时填写并<strong>保存</strong>，在11日至12日进行<strong>申报</strong>。</p>
</blockquote>
<p>2.&nbsp;查看工时申报单   
</p>
<p><img src="static/instruction-img/1530177302810.png" alt="Alt text" />   
</p>
<pre><code>注：右上角有红色角标，表示有备注信息，点击可以查看详情   
</code></pre>

<p>3.&nbsp;修改工时申报单 <br />
<img src="static/instruction-img/1530177567002.png" alt="Alt text" />   
</p>
<pre><code>注：工时审批单只有在“未提交”、“审核失败”两种状态下可以修改
</code></pre>

<p>4.&nbsp;申报工时<br />
 对于“审核中”或者“审核失败”状态的工时申报单，点击列表当中的“申报”按钮也可以进行工时申报。 
</p>
<p>5.&nbsp;申报撤销<br />
处于“审核中”状态的工时申报单可以进行“撤销”操作。   
</p>
<p>6.&nbsp;删除工单<br />
处于“未提交”或者“审核失败”状态的工时申报单可以进行“删除”操作。   
</p>
<p>7.&nbsp;审核轨迹<br />
用于查看工单的审核轨迹   
</p>
</br>
<h4>工时审批</h4>
<p><img src="static/instruction-img/1530179901621.png" alt="Alt text" /></p>
<p><strong>工时审批主要功能</strong>  
</p>
<p>1.&nbsp;查看工时申报单  
</p>
<p>2.&nbsp;审核工时<br />
<img src="static/instruction-img/1530179530830.png" alt="Alt text" />    
</p>
<pre><code>注：在系统参数配置当中“是否电子签名”选择“是”，则此处在审核“批准”时需要进行电子签名（“拒绝”不需要电子签名）。 
</code></pre>

<p>3.&nbsp;查看审核轨迹  <br />
点击“审核轨迹”可以查看审核记录  
</p>
<p><img src="static/instruction-img/1530180108898.png" alt="Alt text" />    
</p>

<h3>考勤管理</h3>
<h4>考勤组管理</h4>
<p>考勤分组管理，各组成员遵守对应考勤组的考勤规则</p>
<img src="static/instruction-img/1530233622941.png" alt="Alt text" />
<p><strong>考勤组管理主要功能</strong>  
</p>
<p>1.&nbsp;添加考勤组<br />
<img src="static/instruction-img/1530234459798.png" alt="Alt text" />    
</p>
<pre><code>注：可设置“上班最晚时间”，“迟到不超过时间”灵活管理考勤
</code></pre>

<p>2.&nbsp;给考勤组添加员工   <br />
考勤组创建完成后点击“考勤组员工”按钮即可给该考勤组内添加员工    
</p>
<h4>员工考勤管理</h4>
<p>查看员工考勤记录，数据来源于手机打卡</p>
<img src="static/instruction-img/20180913144703.png" alt="Alt text" />
<h4>假期类型管理</h4>
<img src="static/instruction-img/20180913145140.png" alt="Alt text" />
<p><strong>假期类型管理主要功能</strong>  
</p>
<p>1.&nbsp;编辑假期类型<br />
<img src="static/instruction-img/20180913145852.png" alt="Alt text" />    
</p>
<p>2.&nbsp;激活假期
</p>
<p>3.&nbsp;冻结假期
</p>
<h3>报表中心</h3>
<p>目前提供<strong>员工工时明细报表</strong>、<strong>员工工时利用率表<strong>、</strong>项目员工工时报表</strong>、<strong>项目任务工时报表</strong>  、<strong>员工考勤报表</strong>  
</p>
    <!-- 回到顶部 -->
     <BackTop></BackTop>
  </div>
</template>
<style scoped>
.help-content {
  padding: 20px;
   width: 1190px;
  margin: 0 auto;
}
/* RESET
=============================================================================*/

html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
}

/* BODY
=============================================================================*/

body {
  font-family: Helvetica, arial, freesans, clean, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
  padding: 20px;
  max-width: 960px;
  margin: 0 auto;
}

body>*:first-child {
  margin-top: 0 !important;
}

body>*:last-child {
  margin-bottom: 0 !important;
}

/* BLOCKS
=============================================================================*/

p, blockquote, ul, ol, dl, table, pre {
  margin: 15px 0;
}

/* HEADERS
=============================================================================*/

h1, h2, h3, h4, h5, h6 {
  margin: 20px 0 10px;
  padding: 0;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
}

h1 tt, h1 code, h2 tt, h2 code, h3 tt, h3 code, h4 tt, h4 code, h5 tt, h5 code, h6 tt, h6 code {
  font-size: inherit;
}

h1 {
  font-size: 28px;
  color: #000;
}

h2 {
  font-size: 24px;
  border-bottom: 1px solid #ccc;
  color: #000;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 16px;
}

h5 {
  font-size: 14px;
}

h6 {
  color: #777;
  font-size: 14px;
}

body>h2:first-child, body>h1:first-child, body>h1:first-child+h2, body>h3:first-child, body>h4:first-child, body>h5:first-child, body>h6:first-child {
  margin-top: 0;
  padding-top: 0;
}

a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
  margin-top: 0;
  padding-top: 0;
}

h1+p, h2+p, h3+p, h4+p, h5+p, h6+p {
  margin-top: 10px;
}

/* LINKS
=============================================================================*/

a {
  color: #4183C4;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* LISTS
=============================================================================*/

ul, ol {
  padding-left: 30px;
}

ul li > :first-child, 
ol li > :first-child, 
ul li ul:first-of-type, 
ol li ol:first-of-type, 
ul li ol:first-of-type, 
ol li ul:first-of-type {
  margin-top: 0px;
}

ul ul, ul ol, ol ol, ol ul {
  margin-bottom: 0;
}

dl {
  padding: 0;
}

dl dt {
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  padding: 0;
  margin: 15px 0 5px;
}

dl dt:first-child {
  padding: 0;
}

dl dt>:first-child {
  margin-top: 0px;
}

dl dt>:last-child {
  margin-bottom: 0px;
}

dl dd {
  margin: 0 0 15px;
  padding: 0 15px;
}

dl dd>:first-child {
  margin-top: 0px;
}

dl dd>:last-child {
  margin-bottom: 0px;
}

/* CODE
=============================================================================*/

pre, code, tt {
  font-size: 12px;
  font-family: Consolas, "Liberation Mono", Courier, monospace;
}

code, tt {
  margin: 0 0px;
  padding: 0px 0px;
  white-space: nowrap;
  border: 1px solid #eaeaea;
  background-color: #f8f8f8;
  border-radius: 3px;
}

pre>code {
  margin: 0;
  padding: 0;
  white-space: pre;
  border: none;
  background: transparent;
}

pre {
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  font-size: 13px;
  line-height: 19px;
  overflow: auto;
  padding: 6px 10px;
  border-radius: 3px;
}

pre code, pre tt {
  background-color: transparent;
  border: none;
}

kbd {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    background-color: #DDDDDD;
    background-image: linear-gradient(#F1F1F1, #DDDDDD);
    background-repeat: repeat-x;
    border-color: #DDDDDD #CCCCCC #CCCCCC #DDDDDD;
    border-image: none;
    border-radius: 2px 2px 2px 2px;
    border-style: solid;
    border-width: 1px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    line-height: 10px;
    padding: 1px 4px;
}

/* QUOTES
=============================================================================*/

blockquote {
  border-left: 4px solid #DDD;
  padding: 0 15px;
  color: #777;
}

blockquote>:first-child {
  margin-top: 0px;
}

blockquote>:last-child {
  margin-bottom: 0px;
}

/* HORIZONTAL RULES
=============================================================================*/

hr {
  clear: both;
  margin: 15px 0;
  height: 0px;
  overflow: hidden;
  border: none;
  background: transparent;
  border-bottom: 4px solid #ddd;
  padding: 0;
}

/* TABLES
=============================================================================*/

table th {
  font-weight: bold;
}

table th, table td {
  border: 1px solid #ccc;
  padding: 6px 13px;
}

table tr {
  border-top: 1px solid #ccc;
  background-color: #fff;
}

table tr:nth-child(2n) {
  background-color: #f8f8f8;
}

/* IMAGES
=============================================================================*/

img {
  max-width: 100%
}

</style>
