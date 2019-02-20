/*
 * @Author: chengshanshan 
 * @Date: 2018-07-03 15:29:56 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-07-05 11:26:50
 * @instructions：获取用户三级权限
 */

import { ApiGetPrivilege } from "@/api/api";
/** 
 * 获取当前menyuId
 */
function getRouterMenuId() {
    let name = localStorage.getItem("currentPageName");
    let menuList = JSON.parse(localStorage.getItem("menuList"));
    if (menuList) {
        for (let i = 0; i < menuList.length; i++) {
            if (name == menuList[i].menuPriv) {
                return menuList[i].menuId;
            } else {
                if (menuList[i].children && menuList[i].children.length > 0) {
                    let child = menuList[i].children;
                    for (let k = 0; k < child.length; k++) {
                        if (name == child[k].menuPriv) {
                            return child[k].menuId;
                        }
                    }
                }
            }
        }
    }
    return null;
}
/** 
 * 传入menuId，动态请求权限
 * @param { Object } defaultPriData:权限对象，key:权限对应code，value：false，例如：{ DEP_ADD: false, DEP_VIEW_SUPER: false}
 * @return { Object } 根据后台返回的列表判断是否有该权限，例如：{ DEP_ADD: false, DEP_VIEW_SUPER: true}
 */
export function privilege(defaultPriData) {
    let menuId = getRouterMenuId();
    if (menuId) {
        return new Promise((resolve, reject) => {
            ApiGetPrivilege(menuId).then(function (res) {
                if (res.code == "success") {
                    let privilege = {};
                    for (let i = 0, len = res.data.length; i < len; i++) {
                        privilege[res.data[i].menuPriv] = true;
                    }
                    for (let key in privilege) {
                        defaultPriData[key] = privilege[key];
                    }
                    resolve(defaultPriData);
                }
            });
        })
    }
}