<template>
    <div class="login-container" ref="appRef">
        <div class="login-weaper animated bounceInDown">
            <div class="login-left">
                <div class="login-time" v-text="currentTime" />
                <img
                    style="border-radius: 50%"
                    src="../../assets/login/create.jpeg"
                    alt=""
                    class="img"
                />
                <p class="title" v-text="sysInfo.sys_app_name" />
            </div>
            <div class="login-border">
                <div class="login-main">
                    <div class="login-title">用户登录</div>
                    <el-form
                        ref="loginForm"
                        :model="loginForms"
                        :rules="loginRules"
                        autocomplete="on"
                        label-position="left"
                    >
                        <el-form-item prop="username">
                            <svg-icon name="user" color="#999" />
                            <el-input
                                ref="username"
                                v-model="loginForms.username"
                                placeholder="用户名"
                                name="username"
                                type="text"
                                tabindex="1"
                                autocomplete="on"
                            />
                        </el-form-item>
                        <el-tooltip
                            v-model="capsTooltip"
                            content="Caps lock is On"
                            placement="right"
                            manual
                        >
                            <el-form-item prop="password">
                                <svg-icon name="password" />
                                <el-input
                                    :key="passwordType"
                                    ref="password"
                                    v-model="loginForms.password"
                                    :type="passwordType"
                                    placeholder="密码"
                                    name="password"
                                    tabindex="2"
                                    autocomplete="on"
                                    @keyup.native="checkCapslock"
                                    @blur="capsTooltip = false"
                                    @keyup.enter.native="handleLogin"
                                />
                                <span @click="showPwd">
                                    <svg-icon
                                        :name="passwordType === 'password' ? 'eye' : 'eye-open'"
                                    />
                                </span>
                            </el-form-item>
                        </el-tooltip>
                        <el-form-item prop="code" style="width: 66%; float: left">
                            <svg-icon name="validCode" />
                            <el-input
                                ref="username"
                                v-model="loginForms.code"
                                placeholder="验证码"
                                name="username"
                                type="text"
                                tabindex="3"
                                maxlength="5"
                                autocomplete="off"
                                style="width: 75%"
                                @keyup.enter.native="handleLogin"
                            />
                        </el-form-item>
                        <div
                            class="login-code"
                            style="
                                cursor: pointer;
                                width: 30%;
                                height: 48px;
                                float: right;
                                background-color: #f0f1f5;
                            "
                        >
                            <img
                                style="
                                    height: 48px;
                                    width: 100%;
                                    border: 1px solid rgba(0, 0, 0, 0.1);
                                    border-radius: 5px;
                                "
                                :src="codeUrl"
                                @click="getCode"
                            />
                        </div>

                        <el-button
                            :loading="loading"
                            type="primary"
                            style="width: 100%; padding: 12px 20px; margin-bottom: 30px"
                            @click.native.prevent="handleLogin"
                        >
                            <span v-if="!loading">登 录</span>
                            <span v-else>登 录 中...</span>
                        </el-button>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { getCodeImg } from "@/api/login";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        const { ctx } = getCurrentInstance();
        const store = useStore();
        const state = reactive({
            codeUrl: "",
            cookiePassword: "",
            refreshParticles: true,
            loginForms: {
                username: "admin",
                password: "123456",
                rememberMe: false,
                code: "",
                uuid: "",
            },
            loginRules: {
                username: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
                password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
                code: [{ required: true, trigger: "change", message: "验证码不能为空" }],
            },
            passwordType: "password",
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {},
            currentTime: null,
            sysInfo: "",
        });
        const route = useRoute();
        const router = useRouter();
        const getCode = () => {
            getCodeImg().then((res) => {
                if (res !== undefined) {
                    state.codeUrl = res.data;
                    state.loginForms.uuid = res.id;
                }
            });
        };
        onMounted(() => {
            getCode();
        });
        // 点击登录
        const handleLogin = () => {
            ctx.$refs.loginForm.validate((valid) => {
                if (valid) {
                    //  state.loading = true
                    store.dispatch("userLogin", state.loginForms);
                    router.push({ path: '/layout', query: state.otherQuery });
                    console.log('vvvvvvv')
                } else {
                    return false;
                }
            });
        };

        const checkCapslock = ({ shiftKey, key } = {}) => {
            if (key && key.length === 1) {
                if (
                    (shiftKey && key >= "a" && key <= "z") ||
                    (!shiftKey && key >= "A" && key <= "Z")
                ) {
                     state.capsTooltip = true;
                } else {
                     state.capsTooltip = false;
                }
            }
            if (key === "CapsLock" &&  state.capsTooltip === true) {
                 state.capsTooltip = false;
            }
        };

        const getOtherQuery = (query) => {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== "redirect") {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        };

        const showPwd = () => {
            if (state.passwordType === "password") {
                state.passwordType = "";
            } else {
                state.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        };

        watch(
            () => {},
            () => {
                if (route) {
                    const query = route.query;
                    state.redirect = query.redirect;
                    state.otherQuery = getOtherQuery(query);
                }
            },
            {
                deep: true,
            }
        );
        return {
            ...toRefs(state),
            getOtherQuery,
            showPwd,
            handleLogin,
            checkCapslock
        };
    },
});
</script>

<style lang="scss" scoped>
@import "@/styles/login/login.scss";
</style>
