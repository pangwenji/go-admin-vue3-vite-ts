<template>
    <div>
        <el-row>
            <el-button
                v-permisaction="[`${addPermisaction}`]"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handleTap(1)"
                >新增</el-button
            >
            <el-button
                v-permisaction="[`${editPermisaction}`]"
                :disabled="editBtnDisabled"
                type="warning"
                size="small"
                plain
                icon="el-icon-edit"
                @click="handleTap(2)"
                >修改</el-button
            >
            <el-button
                v-permisaction="[`${deletePermisaction}`]"
                :disabled="deleteBtnDisabled"
                type="danger"
                size="small"
                plain
                icon="el-icon-delete"
                @click="handleTap(3)"
                >删除</el-button
            >
        </el-row>
        <el-row>
            <el-table
                ref="table"
                v-loading="tableLoading"
                :data="table.list"
                max-height="560"
                border
                size="medium"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column width="60" align="center" type="selection" />
                <el-table-column
                    v-for="item in theader"
                    :key="item.value"
                    :prop="item.value"
                    align="center"
                    :label="item.label"
                    :width="item.width ? item.width : 'auto'"
                >
                    <template slot-scope="scope">
                        <el-link
                            v-if="link.includes(item.value)"
                            type="primary"
                            @click="handleDialog(scope.row)"
                        >
                            {{ scope.row[item.value] }}
                        </el-link>
                        <span v-else>
                            <span v-if="item.value === 'createdAt' || item.value === 'updatedAt'">
                                {{ parseTime(scope.row[item.value]) }}
                            </span>
                            <span v-else>
                                {{ scope.row[item.value] }}
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="showAction"
                    fixed="right"
                    label="操作"
                    align="center"
                    width="auto"
                >
                    <template slot-scope="scope">
                        <slot name="action" :item="scope.row" />
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row v-if="showPage" type="flex" justify="end">
            <div class="mt">
                <el-pagination
                    :current-page="pageNo"
                    layout="total, prev, pager, next"
                    :page-size="pageSize"
                    :total="table.total"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-row>
        <CustomDialog
            ref="dialog"
            :dialog="dialog.open"
            :title="dialog.title + title"
            :cancel="dialog.cancel"
            :confirm="dialog.confirm"
            @cancel="handleDialogCancel"
            @confirm="handleDialogConfirm"
        >
            <template #content>
                <slot name="content" />
            </template>
        </CustomDialog>
    </div>
</template>

<script>
import request from "@/utils/request";
import moment from "moment";
import CustomDialog from "@/components/CustomDialog";

import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { getCodeImg } from "@/api/login";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";
export default defineComponent({
    name: "TableAction",
    components: {
        CustomDialog,
    },
    props: {
        addPermisaction: {
            type: String,
            default: "",
        },
        editPermisaction: {
            type: String,
            default: "",
        },
        deletePermisaction: {
            type: String,
            default: "",
        },
        theader: {
            type: Array,
            default: () => [],
        },
        link: {
            type: Array,
            default: () => [],
        },
        showBtn: {
            type: Boolean,
            default: true,
        },
        showSelect: {
            type: Boolean,
            default: false,
        },
        showAction: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "",
        },
        methods: {
            type: String,
            default: "",
        },
        showPage: {
            type: Boolean,
            default: true,
        },
        params: {
            type: Object,
            default: () => {},
        },
    },
    setup(props, context) {
        let state = reactive({
            editBtnDisabled: true,
            deleteBtnDisabled: true,
            dialog: {
                open: false,
                title: "查看",
                cancel: false,
                confirm: true,
            },
            type: 1,
            pageNo: 1,
            pageSize: 10,
            table: {
                list: [],
                total: 0,
            },
            selectId: [],
            dialogLoading: false,
            tableLoading: false,
        });
        let store = useStore();
        let theme = computed(() => {
            return store.state.settings.theme;
        });

        let parseTime = (str) => {
            if (str) {
                return moment(new Date(str)).format("YYYY-MM-DD HH:mm:ss");
            } else {
                return "";
            }
        };
        let getSelectIds = () => {
            return state.selectId;
        };
        let getList = () => {
            if (!state.methods) {
                return false;
            }
            loadingTableOpen();
            request({
                url: state.methods,
                method: "get",
                params: {
                    ...state.params,
                    page_no: state.pageNo,
                    page_size: state.pageSize,
                },
            })
                .then((ret) => {
                    if (ret.code === 200) {
                        state.table = ret.result;
                    }
                })
                .finally((_) => {
                    loadingTableClose();
                });
        };
        let handleSelectionChange = (e) => {
            if (e.length >= 1) {
                state.deleteBtnDisabled = false;
                state.editBtnDisabled = false;
            } else {
                state.deleteBtnDisabled = true;
                state.editBtnDisabled = true;
            }
            if (e.length >= 2) {
                state.editBtnDisabled = true;
            } else {
                state.editBtnDisabled = false;
            }
            state.selectId = e.map((item) => item);
        };
        let handleDialog = (e) => {
            state.dialog = {
                open: true,
                title: "查看",
                cancel: false,
                confirm: true,
            };
            state.type = 1;
            context.$emit("change", [e]);
        };
        let handleDialogCancel = () => {
            state.type = 1;
            state.dialog = {
                open: false,
                title: "查看",
                cancel: false,
                confirm: true,
            };
            context.$emit("dialogCancel");
        };
        let handleDialogConfirm = () => {
            // this.dialog.open = false
            context.$emit("dialogConfirm", this.type);
        };
        let handleTap = (index) => {
            switch (index) {
                case 1:
                    state.dialog = {
                        open: true,
                        title: "新建",
                        cancel: true,
                        confirm: true,
                    };
                    state.type = 2;
                    break;
                case 2:
                    state.dialog = {
                        open: true,
                        title: "修改",
                        cancel: true,
                        confirm: true,
                    };
                    state.type = 3;
                    context.$emit("change", state.selectId);
                    break;
                case 3:
                    context
                        .$confirm("确定删除所选项吗?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                        .then(() => {
                            state.type = 4;
                            context.$emit("dialogConfirm", state.type);
                        });
                    break;
            }
        };
        let refreshTable = () => {
            state.pageNo = 1;
            getList();
        };
        let handleCurrentChange = (currentPage) => {
            state.loading = true;
            state.pageNo = currentPage;
            getList();
        };
        let loadingDialogOpen = () => {
            state.dialogLoading = true;
        };
        let loadingDialogClose = () => {
            state.dialogLoading = false;
        };
        let loadingTableOpen = () => {
            state.tableLoading = true;
        };
        let loadingTableClose = () => {
            state.tableLoading = false;
        };
        onMounted(() => {
            getList();
        });
        return {
          ...toRefs(state),
            theme,
            loadingDialogOpen,
            loadingDialogClose,
            loadingTableOpen,
            loadingTableClose,
            handleDialog,
            handleSelectionChange,
            getList,
            getSelectIds,
            parseTime,
            handleDialogCancel,
            handleDialogConfirm,
            handleTap,
            refreshTable,
            handleCurrentChange,
        };
    },
});
</script>
<style lang="scss" scoped>
::v-deep .el-table {
    margin-top: 10px;
    thead {
        th {
            height: 60px;
        }
    }
    tbody {
        td:not(:first-child) {
            padding: 15px 20px;
        }
    }
}

.mt {
    margin-top: 10px;
}
</style>
