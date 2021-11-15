<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="用户名" prop="username"
                        ><el-input
                            v-model="queryParams.username"
                            placeholder="请输入用户名"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="状态" prop="status"
                        ><el-select
                            v-model="queryParams.status"
                            placeholder="系统登录日志状态"
                            clearable
                            size="small"
                        >
                            <el-option
                                v-for="dict in statusOptions"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="ip地址" prop="ipaddr"
                        ><el-input
                            v-model="queryParams.ipaddr"
                            placeholder="请输入ip地址"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="mini"
                            @click="handleQuery"
                            >搜索</el-button
                        >
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:sysLoginLog:remove']"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table
                    v-loading="loading"
                    :data="sysloginlogList"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column
                        label="用户名"
                        align="center"
                        prop="username"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        label="类型"
                        align="center"
                        prop="msg"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column
                        label="状态"
                        align="center"
                        prop="status"
                        :formatter="statusFormat"
                        width="100"
                    >
                        <template slot-scope="scope">
                            {{ statusFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="ip地址" align="center" prop="ipaddr">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>IP: {{ scope.row.ipaddr }}</p>
                                <p>归属地: {{ scope.row.loginLocation }}</p>
                                <p>浏览器: {{ scope.row.browser }}</p>
                                <p>系统: {{ scope.row.os }}</p>
                                <p>固件: {{ scope.row.platform }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ scope.row.ipaddr }}
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.loginTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                v-permisaction="['admin:sysLoginLog:remove']"
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
                />
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
import { delSysLoginlog, getSysLoginlog, listSysLoginlog } from "@/api/admin/sys-login-log";

import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    name: "SysLoginLogManage",
    setup() {
        let state = reactive({
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            isEdit: false,
            fileOpen: false,
            fileIndex: undefined,
            // 类型数据字典
            typeOptions: [],
            sysloginlogList: [],
            statusOptions: [],
            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                username: undefined,
                status: undefined,
                ipaddr: undefined,
                loginLocation: undefined,
                createdAtOrder: "desc",
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
        });

        let getList = () => {
            state.loading = true;
            getDeptList(state.queryParams).then((response) => {
                state.deptList = response.data;
                state.loading = false;
            });
        };

        // 取消按钮
        let cancel = () => {
            state.open = false;
            reset();
        };

        // 表单重置
        let reset = () => {
            state.form = {
                ID: undefined,
                username: undefined,
                status: undefined,
                ipaddr: undefined,
                loginLocation: undefined,
                browser: undefined,
                os: undefined,
                platform: undefined,
                loginTime: undefined,
                remark: undefined,
                msg: undefined,
            };
            resetForm("form");
        };
        let { ctx } = getCurrentInstance();
        let getImgList = () => {
            state.form[state.fileIndex] = ctx.$refs["fileChoose"].resultList[0].fullUrl;
        };
        let fileClose = () => {
            state.fileOpen = false;
        };
        let statusFormat = (row) => {
            return selectDictLabel(this.statusOptions, row.status);
        };
        // 文件
        /** 搜索按钮操作 */
        let handleQuery = () => {
            state.queryParams.pageIndex = 1;
            getList();
        };
        /** 重置按钮操作 */
        let resetQuery = () => {
            state.dateRange = [];
            resetForm("queryForm");
            handleQuery();
        };
        /** 新增按钮操作 */
        let handleAdd = () => {
            reset();
            state.open = true;
            state.title = "添加系统登录日志";
            state.isEdit = false;
        };
        // 多选框选中数据
        let handleSelectionChange = (selection) => {
            state.ids = selection.map((item) => item.id);
            state.single = selection.length !== 1;
            state.multiple = !selection.length;
        };
        /** 修改按钮操作 */
        let handleUpdate = (row) => {
            reset();
            const ID = row.id || this.ids;
            getSysLoginlog(ID).then((response) => {
                state.form = response.data;
                state.open = true;
                state.title = "修改系统登录日志";
                state.isEdit = true;
            });
        };
        let msgSuccess = (msg) => {};
        let msgError = (msg) => {};
        /** 删除按钮操作 */
        let handleDelete = (row) => {
            var Ids = (row.id && [row.id]) || this.ids;
            ctx.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delSysLoginlog({ ids: Ids });
                })
                .then((response) => {
                    if (response.code === 200) {
                        msgSuccess(response.msg);
                        state.open = false;
                        getList();
                    } else {
                        msgError(response.msg);
                    }
                })
                .catch(function () {});
        };

        onMounted(() => {
            getList();
            getDicts("sys_normal_disable").then((response) => {
                state.statusOptions = response.data;
            });
        });
        return {
            ...toRefs(state),
            getList,
            cancel,
            reset,
            getImgList,
            fileClose,
            statusFormat,
            handleQuery,
            resetQuery,
            handleAdd,
            handleSelectionChange,
            handleUpdate,
            msgSuccess,
            msgError,
            handleDelete,
        };
    },
});
</script>
