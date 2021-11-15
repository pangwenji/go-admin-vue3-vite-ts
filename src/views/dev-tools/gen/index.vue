<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-position="left">
                    <el-form-item label="表名称" prop="tableName">
                        <el-input
                            v-model="queryParams.tableName"
                            placeholder="请输入表名称"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="菜单名称" prop="tableComment">
                        <el-input
                            v-model="queryParams.tableComment"
                            placeholder="请输入菜单名称"
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
                        <!-- <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handleGenTable"
            >生成</el-button> -->
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="info"
                            icon="el-icon-upload"
                            size="mini"
                            @click="openImportTable"
                            >导入</el-button
                        >
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleEditTable"
                            >修改</el-button
                        >
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
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
                    :data="tableList"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="序号" align="center" prop="tableId" width="50px" />
                    <el-table-column
                        label="表名称"
                        align="center"
                        prop="tableName"
                        :show-overflow-tooltip="true"
                        width="130"
                    />
                    <el-table-column
                        label="菜单名称"
                        align="center"
                        prop="tableComment"
                        :show-overflow-tooltip="true"
                        width="130"
                    />
                    <el-table-column
                        label="模型名称"
                        align="center"
                        prop="className"
                        :show-overflow-tooltip="true"
                        width="130"
                    />
                    <el-table-column label="创建时间" align="center" prop="createdAt" width="165">
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
                                type="text"
                                size="small"
                                icon="el-icon-edit"
                                @click="handleEditTable(scope.row)"
                                >编辑</el-button
                            >
                            <el-button
                                type="text"
                                size="small"
                                icon="el-icon-view"
                                @click="handlePreview(scope.row)"
                                >预览</el-button
                            >
                            <el-popconfirm
                                class="delete-popconfirm"
                                title="正在使用代码生成请确认?"
                                confirm-button-text="生成"
                                @onConfirm="handleToProject(scope.row)"
                            >
                                <el-button
                                    slot="reference"
                                    type="text"
                                    size="small"
                                    icon="el-icon-view"
                                    >代码生成</el-button
                                >
                            </el-popconfirm>

                            <el-popconfirm
                                class="delete-popconfirm"
                                title="正在使用【菜单以及API生成到数据库】请确认?"
                                confirm-button-text="写入DB"
                                @onConfirm="handleToDB(scope.row)"
                            >
                                <el-button
                                    slot="reference"
                                    type="text"
                                    size="small"
                                    icon="el-icon-view"
                                    >生成配置</el-button
                                >
                            </el-popconfirm>

                            <el-popconfirm
                                class="delete-popconfirm"
                                title="正在使用代码生成配置迁移脚本请确认?"
                                confirm-button-text="生成"
                                @onConfirm="handleToApiFile(scope.row)"
                            >
                                <el-button
                                    slot="reference"
                                    type="text"
                                    size="small"
                                    icon="el-icon-view"
                                    >生成迁移脚本</el-button
                                >
                            </el-popconfirm>

                            <el-popconfirm
                                class="delete-popconfirm"
                                title="确认删除数据项？"
                                @onConfirm="handleSingleDelete(scope.row)"
                            >
                                <el-button
                                    slot="reference"
                                    type="text"
                                    size="small"
                                    icon="el-icon-delete"
                                    >删除</el-button
                                >
                            </el-popconfirm>
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
            <!-- 预览界面 -->
            <el-dialog
                class="preview"
                :title="preview.title"
                :visible.sync="preview.open"
                fullscreen
            >
                <div class="el-dialog-container">
                    <div class="tag-group">
                        <!-- eslint-disable-next-line vue/valid-v-for -->
                        <el-tag v-for="(value, key) in preview.data" @click="codeChange(key)">
                            <template>
                                {{
                                    key.substring(
                                        key.lastIndexOf("/") + 1,
                                        key.indexOf(".go.template")
                                    )
                                }}
                            </template>
                        </el-tag>
                    </div>
                    <div id="codemirror">
                        <codemirror ref="cmEditor" :value="codestr" :options="cmOptions" />
                    </div>
                    <!-- <el-tabs v-model="preview.activeName" tab-position="left">
            <el-tab-pane
              v-for="(value, key) in preview.data"
              :key="key"
              :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.template'))"
              :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.template'))"
            >

              <pre class="pre"/>

            </el-tab-pane>
            </el-tabs> -->
                </div>
            </el-dialog>
            <import-table ref="importTB" @ok="handleQuery" />
        </template>
    </BasicLayout>
</template>

<script>
import {
    listTable,
    previewTable,
    delTable,
    toDBTable,
    toProjectTableCheckRole,
    apiToFile,
} from "@/api/tools/gen";
import importTable from "./importTable";
import { downLoadFile } from "@/utils/zipdownload";
import { codemirror } from "vue-codemirror";
import "codemirror/theme/material-palenight.css";

require("codemirror/mode/javascript/javascript");
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/go/go";
import "codemirror/mode/vue/vue";

import {
    reactive,
    defineComponent,
    onMounted,
    watch,
    toRefs,
    onActivated,
    getCurrentInstance,
} from "vue";
import { getCodeImg } from "@/api/login";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";
export default defineComponent({
    name: "Gen",
    components: { importTable, codemirror },
    setup() {
        let state = reactive({
            cmOptions: {
                tabSize: 4,
                theme: "material-palenight",
                mode: "text/javascript",
                lineNumbers: true,
                line: true,
                // more CodeMirror options...
            },
            codestr: "",
            // 遮罩层
            loading: true,
            // 唯一标识符
            uniqueId: "",
            // 选中数组
            ids: [],
            // 选中表数组
            tableNames: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 表数据
            tableList: [],
            // 日期范围
            dateRange: "",
            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                tableName: undefined,
                tableComment: undefined,
            },
            // 预览参数
            preview: {
                open: false,
                title: "代码预览",
                data: {},
                activeName: "api.go",
            },
        });

        let addDateRange = () => {};
        /** 查询表集合 */
        let getList = () => {
            state.loading = true;
            listTable(addDateRange(state.queryParams, state.dateRange)).then((response) => {
                state.tableList = response.data.list;
                state.total = response.data.count;
                state.loading = false;
            });
        };
        let codeChange = (e) => {
            if (e.indexOf("js") > -1) {
                state.cmOptions.mode = "text/javascript";
            }
            if (
                e.indexOf("model") > -1 ||
                e.indexOf("router") > -1 ||
                e.indexOf("api") > -1 ||
                e.indexOf("service") > -1 ||
                e.indexOf("dto") > -1
            ) {
                state.cmOptions.mode = "text/x-go";
            }
            if (e.indexOf("vue") > -1) {
                state.cmOptions.mode = "text/x-vue";
            }
            state.codestr = state.preview.data[e];
        };
        /** 搜索按钮操作 */
        let handleQuery = () => {
            state.queryParams.pageIndex = 1;
            getList();
        };
        /** 生成代码操作 */
        let handleGenTable = (row) => {
            const ids = row.tableId || this.ids;
            if (ids === "") {
                this.msgError("请选择要生成的数据");
                return;
            }
            downLoadFile("/api/v1/gen/gencode/" + ids);
        };
        let { ctx } = getCurrentInstance();
        /** 打开导入表弹窗 */
        let openImportTable = () => {
            ctx.$refs.importTB.show();
        };
        /** 重置按钮操作 */
        let resetQuery = () => {
            state.dateRange = [];
            resetForm("queryForm");
            handleQuery();
        };
        /** 预览按钮 */
        let handlePreview = (row) => {
            previewTable(row.tableId).then((response) => {
                state.preview.data = response.data;
                state.preview.open = true;
                codeChange("template/api.go.template");
            });
        };
        let msgSuccess = (message) => {};
        let handleToProject = (row) => {
            toProjectTableCheckRole(row.tableId, false).then((response) => {
                msgSuccess(response.msg);
            });
        };
        let handleToApiFile = (row) => {
            apiToFile(row.tableId, true).then((response) => {
                msgSuccess(response.msg);
            });
        };
        let handleToDB = (row) => {
            toDBTable(row.tableId).then((response) => {
                msgSuccess(response.msg);
            });
        };
        // 多选框选中数据
        let handleSelectionChange = (selection) => {
            state.ids = selection.map((item) => item.tableId);
            state.tableNames = selection.map((item) => item.tableName);
            state.single = selection.length !== 1;
            state.multiple = !selection.length;
        };
        /** 修改按钮操作 */
        let router = useRouter();
        let handleEditTable = (row) => {
            const tableId = row.tableId || state.ids[0];
            router.push({ path: "/dev-tools/editTable", query: { tableId: tableId } });
        };

        let msgError = (message) => {};

        /** 删除按钮操作 */
        let handleDelete = (row) => {
            const tableIds = row.tableId || this.ids;
            ctx.$confirm('是否确认删除表编号为"' + tableIds + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delTable(tableIds);
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
        let handleSingleDelete = (row) => {
            const tableIds = row.tableId || state.ids;
            delTable(tableIds).then((response) => {
                if (response.code === 200) {
                    msgSuccess(response.msg);
                    state.open = false;
                    getList();
                } else {
                    msgError(response.msg);
                }
            });
        };
        let route = useRoute();
        onActivated(() => {
            const time = route.query.t;
            if (time !== null && time !== state.uniqueId) {
                state.uniqueId = time;
                resetQuery();
            }
        });
        onMounted(() => {
            getList();
        });

        return {
            ...toRefs(state),
            handleQuery,
            codeChange,
            getList,
            handleGenTable,
            resetQuery,
            handlePreview,
            msgSuccess,
            handleToProject,
            handleToApiFile,
            handleToDB,
            handleSelectionChange,
            router,
            msgError,
            handleDelete,
            handleSingleDelete,
        };
    },
});
</script>

<style lang="scss" scoped>
.el-dialog-container ::v-deep {
    overflow: hidden;
    .el-scrollbar__view {
        height: 100%;
    }
    .pre {
        height: 546px;
        overflow: hidden;
        .el-scrollbar {
            height: 100%;
        }
    }
    .el-scrollbar__wrap::-webkit-scrollbar {
        display: none;
    }
}
::v-deep .el-dialog__body {
    padding: 0 20px;
    margin: 0;
}
.tag-group {
    margin: 0 0 10px -10px;
}
.tag-group .el-tag {
    margin-left: 10px;
}

.el-tag {
    cursor: pointer;
}
</style>

<style lang="scss">
#codemirror {
    height: auto;
    margin: 0;
    overflow: auto;
}
.CodeMirror {
    border: 1px solid #eee;
    height: 600px;
}
</style>
