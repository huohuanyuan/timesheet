/*
 * @Author: chengshanshan 
 * @Date: 2018-09-20 10:58:43 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-20 11:01:12
 * @instraction:密码强度校验
 */

const regValidate = (rule, value, callback) => {
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (!reg.test(value)) {
        callback(new Error("密码必须包含数字和字母"))
    } else {
        callback()
    }

};
/**
 * 密码校验：长度为6-20，必须包含数字和字母
 */
let pwdValidate = [
    {
        required: true, message: '密码不能为空', trigger: 'blur'
    },
    {
        type: "string",
        min: 6,
        message: "密码长度不能小于6位",
        trigger: "blur"
    },
    {
        type: "string",
        max: 20,
        message: "密码长度不能大于20位",
        trigger: "blur"
    },
    { validator: regValidate, trigger: "blur" },

];
export default pwdValidate
