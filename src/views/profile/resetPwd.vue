<template>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
            <el-button type="danger" size="mini" @click="close">关闭</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/admin/sys-user";
import { reactive, defineComponent,  toRefs, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        let state = reactive({
            test: "1test",
            user: {
                oldPassword: undefined,
                newPassword: undefined,
                confirmPassword: undefined,
            },
            // 表单校验
            rules: {
                oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
                newPassword: [
                    { required: true, message: "新密码不能为空", trigger: "blur" },
                    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
                ],
                confirmPassword: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { required: true, validator: equalToPassword, trigger: "blur" },
                ],
            },
        });

        let msgSuccess = (msg) => {};
        let msgError = (msg) => {};
        let { ctx } = getCurrentInstance();
        let submit = () => {
            ctx.$refs["form"].validate((valid) => {
                if (valid) {
                    updateUserPwd(this.user.oldPassword, this.user.newPassword).then((response) => {
                        if (response.code === 200) {
                            msgSuccess(response.msg);
                        } else {
                            msgError(response.msg);
                        }
                    });
                }
            });
        };
        let equalToPassword = (rule, value, callback) => {
            if (state.user.newPassword !== value) {
                callback(new Error("两次输入的密码不一致"));
            } else {
                callback();
            }
        };
        let store = useStore();
        let router = useRouter();
        let route = useRoute();
        let close = () => {
            store.dispatch("tagsView/delView", route);
            router.push({ path: "/index" });
        };
        return {
            ...toRefs(state),
            close,
            equalToPassword,
            submit,
            msgSuccess,
            msgError,
        };
    },
});
</script>
