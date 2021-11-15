<template>
    <!-- 导入表 -->
    <el-dialog title="导入表" :visible.sync="visible" width="800px" top="5vh">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="表名称" prop="tableName">
                <el-input
                    v-model="queryParams.tableName"
                    placeholder="请输入表名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="表描述" prop="tableComment">
                <el-input
                    v-model="queryParams.tableComment"
                    placeholder="请输入表描述"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                    >搜索</el-button
                >
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-table
                ref="table"
                :data="dbTableList"
                height="260px"
                @row-click="clickRow"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="tableName" label="表名称" />
                <el-table-column prop="tableComment" label="表描述" />
                <el-table-column prop="createdAt" label="创建时间" />
                <el-table-column prop="updatedAt" label="更新时间" />
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageIndex"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
            />
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" @click="handleImportTable"
                >确 定</el-button
            >
            <el-button @click="visible = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { listDbTable, importTable } from "@/api/tools/gen";

import {
    reactive,
    defineComponent,
    toRefs,
    getCurrentInstance,
} from "vue";
import { getCodeImg } from "@/api/login";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";
export default defineComponent({
    props: [],
    setup(props, context) {
        let state = reactive({
            loading: false,
            // 遮罩层
            visible: false,
            // 选中数组值
            tables: [],
            // 总条数
            total: 0,
            // 表数据
            dbTableList: [],
            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                tableName: undefined,
                tableComment: undefined,
            },
        });

        // 显示弹框
        let show = () => {
            getList();
            state.visible = true;
        };
        let { ctx } = getCurrentInstance();
        let clickRow = (row) => {
            ctx.$refs.table.toggleRowSelection(row);
        };
        // 多选框选中数据
        let handleSelectionChange = (selection) => {
            state.tables = selection.map((item) => item.tableName);
        };
        // 查询表数据
        let getList = () => {
            listDbTable(this.queryParams).then((res) => {
                if (res.code === 200) {
                    this.dbTableList = res.data.list;
                    this.total = res.data.count;
                }
            });
        };
        /** 搜索按钮操作 */
        let handleQuery = () => {
            state.queryParams.pageIndex = 1;
            getList();
        };
        /** 重置按钮操作 */
        let resetQuery = () => {
            resetForm("queryForm");
            handleQuery();
        };
        let msgSuccess = (msg) => {};
        /** 导入按钮操作 */
        let handleImportTable = () => {
            state.loading = true;
            state.visible = true;
            importTable({ tables: state.tables.join(",") }).then((res) => {
                msgSuccess(res.msg);
                if (res.code === 200) {
                    state.visible = false;
                    context.$emit("ok");
                }
                state.loading = false;
            });
        };
        return {
            ...toRefs(state),
            handleImportTable,
            msgSuccess,
            handleQuery,
            resetQuery,
            getList,
            handleSelectionChange,
        };
    },
});
</script>
