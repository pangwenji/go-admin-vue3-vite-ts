import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
import store, { globalDataProps } from "../store/loginStore";
import { getToken } from "../utils/auth";
// 创建实例
const service = axios.create({
    baseURL: "http://127.0.0.1:9527",
    timeout: 10000, // request timeout
});
//配置 请求拦截器
service.interceptors.request.use(
    (config: any) => {
        if (store.state.token) {
            config.headers["Authorization"] = "Bearer " + getToken();
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
//配置响应拦截器
service.interceptors.response.use(
    (response) => {
        const code = response.data.code;
        if (code === 401) {
            // store.dispatch('user/resetToken')
            if (location.href.indexOf("login") !== -1) {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            } else {
                ElMessageBox.confirm(
                    "登录状态已过期，您可以继续留在该页面，或者重新登录",
                    "系统提示",
                    {
                        confirmButtonText: "重新登录",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
            }
        } else if (code === 6401) {
            // store.dispatch('user/resetToken')
            ElMessageBox.confirm("登录状态已过期，您可以继续留在该页面，或者重新登录", "系统提示", {
                confirmButtonText: "重新登录",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
            return false;
        } else if (code === 400 || code === 403) {
            ElMessage({
                message: response.data.msg,
                type: "error",
                duration: 5 * 1000,
            });
        } else if (code !== 200) {
            ElMessage({
                message: response.data.msg,
                type: "error",
            });
            return Promise.reject("error");
        } else {
            return response.data;
        }
    },
    (error) => {
        if (error.message === "Network Error") {
            ElMessage({
                message: "服务器连接异常，请检查服务器！",
                type: "error",
                duration: 5 * 1000,
            });
            return;
        }
        ElMessage({
            message: error.message,
            type: "error",
            duration: 5 * 1000,
        });

        return Promise.reject(error);
    }
);
export default service;
