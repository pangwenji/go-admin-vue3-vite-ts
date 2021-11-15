<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true">
                    <el-form-item label="字典名称" prop="dictType">
                        <el-select v-model="queryParams.dictType" size="small">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.dictId"
                                :label="item.dictName"
                                :value="item.dictType"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字典标签" prop="dictLabel">
                        <el-input
                            v-model="queryParams.dictLabel"
                            placeholder="请输入字典标签"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select
                            v-model="queryParams.status"
                            placeholder="数据状态"
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
                            v-permisaction="['admin:sysDictData:add']"
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            >新增</el-button
                        >
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:sysDictData:edit']"
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            >修改</el-button
                        >
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:sysDictData:remove']"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            >删除</el-button
                        >
                    </el-col>
                </el-row>

                <el-table
                    v-loading="loading"
                    :data="dataList"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="字典编码" width="80" align="center" prop="dictCode" />
                    <el-table-column label="字典标签" align="center" prop="dictLabel" />
                    <el-table-column label="字典键值" align="center" prop="dictValue" />
                    <el-table-column label="字典排序" align="center" prop="dictSort" />
                    <el-table-column
                        label="状态"
                        align="center"
                        prop="status"
                        :formatter="statusFormat"
                    />
                    <el-table-column
                        label="备注"
                        align="center"
                        prop="remark"
                        :show-overflow-tooltip="true"
                    />
                    <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.createdAt) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                v-permisaction="['admin:sysDictData:edit']"
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                >修改</el-button
                            >
                            <el-button
                                v-permisaction="['admin:sysDictData:remove']"
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                >删除</el-button
                            >
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

                <!-- 添加或修改参数配置对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="字典类型">
                            <el-input v-model="form.dictType" :disabled="true" />
                        </el-form-item>
                        <el-form-item label="数据标签" prop="dictLabel">
                            <el-input
                                v-model="form.dictLabel"
                                placeholder="请输入数据标签"
                                :disabled="isEdit"
                            />
                        </el-form-item>
                        <el-form-item label="数据键值" prop="dictValue">
                            <el-input
                                v-model="form.dictValue"
                                placeholder="请输入数据键值"
                                :disabled="isEdit"
                            />
                        </el-form-item>
                        <el-form-item label="显示排序" prop="dictSort">
                            <el-input-number
                                v-model="form.dictSort"
                                controls-position="right"
                                :min="0"
                            />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio
                                    v-for="dict in statusOptions"
                                    :key="dict.value"
                                    :label="dict.value"
                                    >{{ dict.label }}</el-radio
                                >
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input
                                v-model="form.remark"
                                type="textarea"
                                placeholder="请输入内容"
                            />
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
import { listData, getData, delData, addData, updateData, exportData } from "@/api/admin/dict/data";
import { listType, getType } from "@/api/admin/dict/type";
import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    name: "SysDictDataManage",
    setup() {
        let route = useRoute();
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
            // 字典表格数据
            dataList: [],
            // 默认字典类型
            defaultDictType: "",
            // 弹出层标题
            title: "",
            isEdit: false,
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            statusOptions: [],
            // 类型数据字典
            typeOptions: [],
            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                dictName: undefined,
                dictType: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                dictLabel: [{ required: true, message: "数据标签不能为空", trigger: "blur" }],
                dictValue: [{ required: true, message: "数据键值不能为空", trigger: "blur" }],
                dictSort: [{ required: true, message: "数据顺序不能为空", trigger: "blur" }],
            },
        });

        let getType = (dictId) => {
            getType(dictId).then((response) => {
                state.queryParams.dictType = response.data.dictType;
                state.defaultDictType = response.data.dictType;
                getList();
            });
        };
        let getList = () => {
            state.loading = true;
            listData(state.queryParams).then((response) => {
                state.dataList = response.data.list;
                state.total = response.data.count;
                state.loading = false;
            });
        };

        let getTypeList = () => {
            listType({ pageSize: 1000 }).then((response) => {
                state.typeOptions = response.data.list;
            });
        };
        let getDicts = () => {
            getDicts("sys_normal_disable").then((response) => {
                state.statusOptions = response.data;
            });
        };
        onBeforeMount(() => {
            const dictId = route.params && route.params.dictId;
            getType(dictId);
            getTypeList();
            getDicts();
        });

        // 数据状态字典翻译
        let statusFormat = (row, column) => {
            return selectDictLabel(this.statusOptions, row.status);
        };
        // 取消按钮
        let cancel = () => {
            state.open = false;
            reset();
        };
        // 表单重置
        let reset = () => {
            this.form = {
                dictCode: undefined,
                dictLabel: undefined,
                dictValue: undefined,
                dictSort: 0,
                status: "2",
                remark: undefined,
            };
            resetForm("form");
        };
        /** 搜索按钮操作 */
        let handleQuery = () => {
            state.queryParams.pageIndex = 1;
            getList();
        };
        /** 重置按钮操作 */
        let resetQuery = () => {
            resetForm("queryForm");
            state.queryParams.dictType = this.defaultDictType;
            handleQuery();
        };
        /** 新增按钮操作 */
        let handleAdd = () => {
            reset();
            state.open = true;
            state.title = "添加字典数据";
            state.isEdit = false;
            state.form.dictType = state.queryParams.dictType;
        };
        // 多选框选中数据
        let handleSelectionChange = (selection) => {
            state.ids = selection.map((item) => item.dictCode);
            state.single = selection.length !== 1;
            state.multiple = !selection.length;
        };
        /** 修改按钮操作 */
        let handleUpdate = (row) => {
            reset();
            const dictCode = row.dictCode || this.ids;
            getData(dictCode).then((response) => {
                this.form = response.data;
                this.form.status = String(this.form.status);
                this.open = true;
                this.title = "修改字典数据";
                this.isEdit = true;
            });
        };
        let { ctx } = getCurrentInstance();
        /** 提交按钮 */
        let submitForm = () => {
            ctx.$refs["form"].validate((valid) => {
                if (valid) {
                    state.form.status = parseInt(this.form.status);
                    if (this.form.dictCode !== undefined) {
                        updateData(this.form).then((response) => {
                            if (response.code === 200) {
                                msgSuccess(response.msg);
                                state.open = false;
                                getList();
                            } else {
                                msgError(response.msg);
                            }
                        });
                    } else {
                        addData(this.form).then((response) => {
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

        let msgSuccess = (message) => {};
        let msgError = (message) => {};
        /** 删除按钮操作 */
        let handleDelete = (row) => {
            const dictCodes = (row.dictCode && [row.dictCode]) || this.ids;
            ctx.$confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delData({ ids: dictCodes });
                })
                .then((response) => {
                    // if (response.code === 200) {
                    //   this.msgSuccess(response.msg)
                    //   this.open = false
                    //   this.getList()
                    // } else {
                    //   this.msgError(response.msg)
                    // }
                })
                .catch(function () {});
        };
        /** 导出按钮操作 */
        let handleExport = () => {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return exportData(queryParams);
                })
                .then((response) => {
                    this.download(response.msg);
                })
                .catch(function () {});
        };
        return {
            ...toRefs(state),
            getType,
            getList,
            getTypeList,
            getDicts,
            statusFormat,
            reset,
            resetForm,
            cancel,
            handleQuery,
            resetQuery,
            handleAdd,
            handleSelectionChange,
            handleUpdate,
            submitForm,
            msgSuccess,
            msgError,
            handleExport,
        };
    },
});
</script>
