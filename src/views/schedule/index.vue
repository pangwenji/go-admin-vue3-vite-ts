<template>
    <div>
        <BasicLayout>
            <template #wrapper>
                <el-card class="box-card">
                    <el-form
                        ref="queryForm"
                        :model="queryParams"
                        :inline="true"
                        label-position="left"
                        label-width="68px"
                    >
                        <el-form-item label="名称" prop="jobName">
                            <el-input
                                v-model="queryParams.jobName"
                                placeholder="请输入名称"
                                clearable
                                size="small"
                                @keyup.enter.native="handleQuery"
                            />
                        </el-form-item>
                        <el-form-item label="任务分组" prop="jobGroup">
                            <el-select
                                v-model="queryParams.jobGroup"
                                placeholder="定时任务任务分组"
                                clearable
                                size="small"
                            >
                                <el-option
                                    v-for="dict in jobGroupOptions"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select
                                v-model="queryParams.status"
                                placeholder="定时任务状态"
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
                                v-permisaction="['job:sysJob:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                                >新增
                            </el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button
                                v-permisaction="['job:sysJob:edit']"
                                type="success"
                                icon="el-icon-edit"
                                size="mini"
                                :disabled="single"
                                @click="handleUpdate"
                                >修改
                            </el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button
                                v-permisaction="['job:sysJob:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                                >删除
                            </el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button
                                v-permisaction="['job:sysJob:log']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="handleLog"
                                >日志
                            </el-button>
                        </el-col>
                    </el-row>

                    <el-table
                        v-loading="loading"
                        :data="sysjobList"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column
                            label="编码"
                            align="center"
                            prop="jobId"
                            :show-overflow-tooltip="true"
                        />
                        <el-table-column
                            label="名称"
                            align="center"
                            prop="jobName"
                            :show-overflow-tooltip="true"
                        />
                        <el-table-column
                            label="任务分组"
                            align="center"
                            prop="jobGroup"
                            :formatter="jobGroupFormat"
                            width="100"
                        >
                            <template slot-scope="scope">
                                {{ jobGroupFormat(scope.row) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="cron表达式"
                            align="center"
                            prop="cronExpression"
                            :show-overflow-tooltip="true"
                        />
                        <el-table-column
                            label="调用目标"
                            align="center"
                            prop="invokeTarget"
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
                        <el-table-column
                            label="操作"
                            align="center"
                            class-name="small-padding fixed-width"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    v-permisaction="['job:sysJob:edit']"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)"
                                    >修改
                                </el-button>
                                <el-button
                                    v-if="scope.row.entry_id !== 0"
                                    v-permisaction="['job:sysJob:remove']"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleRemove(scope.row)"
                                    >停止
                                </el-button>
                                <el-button
                                    v-if="scope.row.entry_id == 0"
                                    v-permisaction="['job:sysJob:start']"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleStart(scope.row)"
                                    >启动
                                </el-button>
                                <el-button
                                    v-permisaction="['job:sysJob:remove']"
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

                    <!-- 添加或修改对话框 -->
                    <el-dialog
                        v-dialogDrag
                        :title="title"
                        :visible.sync="open"
                        width="700px"
                        append-to-body
                    >
                        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="名称" prop="jobName">
                                        <el-input v-model="form.jobName" placeholder="名称" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="任务分组" prop="jobGroup">
                                        <el-select v-model="form.jobGroup" placeholder="请选择">
                                            <el-option
                                                v-for="dict in jobGroupOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="调用目标" prop="invokeTarget">
                                        <span slot="label">
                                            调用目标
                                            <el-tooltip placement="top">
                                                <div slot="content">
                                                    调用示例：func (t *EXEC) ExamplesNoParam(){..}
                                                    填写 ExamplesNoParam 即可；
                                                    <br />参数说明：目前不支持带参调用
                                                </div>
                                                <i class="el-icon-question" />
                                            </el-tooltip>
                                        </span>
                                        <el-input
                                            v-model="form.invokeTarget"
                                            placeholder="调用目标"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="目标参数" prop="args">
                                        <span slot="label">
                                            目标参数
                                            <el-tooltip placement="top">
                                                <div slot="content">
                                                    参数示例：有参：请以string格式填写；无参：为空；
                                                    <br />参数说明：目前仅支持函数调用
                                                </div>
                                                <i class="el-icon-question" />
                                            </el-tooltip>
                                        </span>
                                        <el-input v-model="form.args" placeholder="目标参数" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="cron表达式" prop="cronExpression">
                                        <el-input
                                            v-model="form.cronExpression"
                                            placeholder="cron表达式"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否并发" prop="concurrent">
                                        <el-radio-group v-model="form.concurrent" size="small">
                                            <el-radio-button label="0">允许</el-radio-button>
                                            <el-radio-button label="1">禁止</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="调用类型" prop="jobType">
                                        <el-radio-group v-model="form.jobType" size="small">
                                            <el-radio-button label="1">接口</el-radio-button>
                                            <el-radio-button label="2">函数</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24">
                                    <el-form-item label="执行策略" prop="misfirePolicy">
                                        <el-radio-group v-model="form.misfirePolicy" size="small">
                                            <el-radio-button label="1">立即执行</el-radio-button>
                                            <el-radio-button label="2">执行一次</el-radio-button>
                                            <el-radio-button label="3">放弃执行</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="状态" prop="status">
                                        <el-select v-model="form.status" placeholder="请选择">
                                            <el-option
                                                v-for="dict in statusOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="submitForm">确 定</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-dialog>
                </el-card>
            </template>
        </BasicLayout>
    </div>
</template>

<script>
import {
    addSysJob,
    delSysJob,
    getSysJob,
    listSysJob,
    updateSysJob,
    removeJob,
    startJob,
} from "@/api/job/sys-job";

import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    name: "SysJobManage",
    setup(props, context) {
        let state = reactive({
            // 遮罩层
            loading: true,
            id: 0,
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
            // 类型数据字典
            typeOptions: [],
            sysjobList: [],
            jobGroupOptions: [],
            statusOptions: [],
            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                jobName: undefined,
                jobGroup: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                jobId: [{ required: true, message: "编码不能为空", trigger: "blur" }],
                jobName: [{ required: true, message: "名称不能为空", trigger: "blur" }],
                jobGroup: [{ required: true, message: "任务分组不能为空", trigger: "blur" }],
                cronExpression: [
                    { required: true, message: "cron表达式不能为空", trigger: "blur" },
                ],
                invokeTarget: [{ required: true, message: "调用目标不能为空", trigger: "blur" }],
                status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
            },
        });
        let addDateRange = () => {};
        /** 查询参数列表 */
        let getList = () => {
            state.loading = true;
            listSysJob(addDateRange(state.queryParams, state.dateRange)).then((response) => {
                state.sysjobList = response.data.list;
                state.total = response.data.count;
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
                jobId: undefined,
                jobName: undefined,
                jobGroup: undefined,
                cronExpression: undefined,
                invokeTarget: undefined,
                args: undefined,
                misfirePolicy: 1,
                concurrent: 1,
                jobType: 1,
                status: undefined,
            };
            resetForm("form");
        };
        let jobGroupFormat = (row) => {
            return selectDictLabel(state.jobGroupOptions, row.jobGroup);
        };
        let statusFormat = (row) => {
            return selectDictLabel(state.statusOptions, row.status);
        };
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
            state.title = "添加定时任务";
            state.isEdit = false;
        };
        // 多选框选中数据
        let handleSelectionChange = (selection) => {
            state.ids = selection.map((item) => item.jobId);
            state.single = selection.length !== 1;
            state.multiple = !selection.length;
        };
        /** 修改按钮操作 */
        let handleUpdate = (row) => {
            reset();
            const jobId = row.jobId || state.ids;
            getSysJob(jobId).then((response) => {
                state.form = response.data;
                state.form.status = String(state.form.status);
                state.form.misfirePolicy = String(state.form.misfirePolicy);
                state.form.concurrent = String(state.form.concurrent);
                state.form.jobType = String(state.form.jobType);
                state.open = true;
                state.title = "修改定时任务";
                state.isEdit = true;
            });
        };
        let msgSuccess = (msg) => {};
        let msgError = (msg) => {};

        let { ctx } = getCurrentInstance();
        /** 提交按钮 */
        let submitForm = () => {
            ctx.$refs["form"].validate((valid) => {
                if (valid) {
                    if (state.form.jobId !== undefined) {
                        state.form.status = parseInt(state.form.status);
                        state.form.misfirePolicy = parseInt(state.form.misfirePolicy);
                        state.form.concurrent = parseInt(state.form.concurrent);
                        state.form.jobType = parseInt(state.form.jobType);
                        updateSysJob(state.form).then((response) => {
                            if (response.code === 200) {
                                msgSuccess(response.msg);
                                state.open = false;
                                getList();
                            } else {
                                msgError(response.msg);
                            }
                        });
                    } else {
                        state.form.status = parseInt(state.form.status);
                        state.form.misfirePolicy = parseInt(state.form.misfirePolicy);
                        state.form.concurrent = parseInt(state.form.concurrent);
                        state.form.jobType = parseInt(state.form.jobType);
                        addSysJob(state.form).then((response) => {
                            if (response.code === 200) {
                                msgSuccess(response.msg);
                                state.open = false;
                                getList();
                            } else {
                                msgError(response.msg);
                            }
                        });
                    }
                }
            });
        };
        /** 删除按钮操作 */
        let handleDelete = (row) => {
            const Ids = (row.jobId && [row.jobId]) || state.ids;
            this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delSysJob({ ids: Ids });
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
        /** 开始按钮操作 */
        let handleStart = (row) => {
            this.$confirm('是否确认启动编号为"' + row.jobId + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return startJob(row.jobId);
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
        /** 停止按钮操作 */
        let handleRemove = (row) => {
            this.$confirm('是否确认关闭编号为"' + row.jobId + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return removeJob(row.jobId);
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
        let router = useRouter();
        let handleLog = () => {
            router.push({ name: "job_log", params: {} });
        };
        onMounted(() => {
            getList();
            getDicts("sys_job_group").then((response) => {
                state.jobGroupOptions = response.data;
            });
            getDicts("sys_job_status").then((response) => {
                state.statusOptions = response.data;
            });
        });
        return {
            ...toRefs(state),
            addDateRange,
            getList,
            jobGroupFormat,
            statusFormat,
            handleQuery,
            resetQuery,
            handleAdd,
            handleSelectionChange,
            handleUpdate,
            msgSuccess,
            msgError,
            submitForm,
            handleDelete,
            handleStart,
            handleRemove,
            handleLog,
        };
    },
});
</script>
