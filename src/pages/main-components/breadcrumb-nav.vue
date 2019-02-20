/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-05 11:32:40 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-07-05 11:33:26
 * @instructions 面包屑导航
 */

<template>
    <Breadcrumb>
        <BreadcrumbItem v-for="item in currentPath" :href="item.path" :key="item.name">{{item.title}}</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {
  props: {
    currentPath: Array
  }
};
</script>
