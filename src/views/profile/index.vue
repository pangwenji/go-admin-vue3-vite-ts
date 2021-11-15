<template>
    <BasicLayout>
        <template #wrapper>
            <el-row :gutter="10">
                <el-col :span="6" :xs="24">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>个人信息</span>
                        </div>
                        <div>
                            <div class="text-center">
                                <userAvatar :user="user" />
                            </div>
                            <ul class="list-group list-group-striped">
                                <li class="list-group-item">
                                    <svg-icon icon-class="user" />用户名称
                                    <div class="pull-right">{{ user.username }}</div>
                                </li>
                                <li class="list-group-item">
                                    <svg-icon icon-class="phone" />手机号码
                                    <div class="pull-right">{{ user.phone }}</div>
                                </li>
                                <li class="list-group-item">
                                    <svg-icon icon-class="email" />用户邮箱
                                    <div class="pull-right">{{ user.email }}</div>
                                </li>
                                <li class="list-group-item">
                                    <svg-icon icon-class="tree" />所属部门
                                    <div class="pull-right">{{ deptName }}</div>
                                </li>
                                <li class="list-group-item">
                                    <svg-icon icon-class="peoples" />所属角色
                                    <div class="pull-right">{{ roleName }}</div>
                                </li>
                                <li class="list-group-item">
                                    <svg-icon icon-class="date" />创建日期
                                    <div class="pull-right">{{ user.createdAt }}</div>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="18" :xs="24">
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>基本资料</span>
                        </div>
                        <el-tabs v-model="activeTab">
                            <el-tab-pane label="基本资料" name="userinfo">
                                <userInfo :user="user" />
                            </el-tab-pane>
                            <el-tab-pane label="修改密码" name="resetPwd">
                                <resetPwd :user="user" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-col>
            </el-row>
        </template>
    </BasicLayout>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/admin/sys-user";

import { reactive, defineComponent, onMounted, toRefs } from "vue";
export default defineComponent({
    name: "Profile",
    components: { userAvatar, userInfo, resetPwd },
    setup() {
        let state = reactive({
            user: {},
            roleGroup: {},
            postGroup: {},
            deptGroup: {},
            activeTab: "userinfo",
            roleIds: undefined,
            postIds: undefined,
            roleName: undefined,
            postName: undefined,
            dept: {},
            deptName: undefined,
        });

        let getUser = () => {
            getUserProfile().then((response) => {
                state.user = response.data.user;
                state.roleIds = response.data.user.roleIds;
                state.roleGroup = response.data.roles;
                if (state.roleIds[0]) {
                    for (const key in state.roleGroup) {
                        if (state.roleIds[0] === state.roleGroup[key].roleId) {
                            state.roleName = state.roleGroup[key].roleName;
                        }
                    }
                } else {
                    state.roleName = "暂无";
                }
                state.dept = response.data.user.dept;
                state.deptName = state.dept.deptName;
            });
        };
        onMounted(() => {
            getUser();
        });
        return {
            ...toRefs(state),
            getUser,
        };
    },
});
</script>

<style lang="scss" scoped>
.list-group-item {
    padding: 18px 0;
}
.svg-icon {
    margin-right: 5px;
}
</style>
