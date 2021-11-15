<template>
    <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        <el-table
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%; margin-top: 20px"
        >
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table>
    </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

import { reactive, defineComponent, toRefs, getCurrentInstance } from "vue";
export default defineComponent({
    name: "UploadExcel",
    components: { UploadExcelComponent },
    setup() {
        let state = reactive({
            tableData: [],
            tableHeader: [],
        });
        let {ctx} =getCurrentInstance()
        let beforeUpload = (file) => {
            const isLt1M = file.size / 1024 / 1024 < 10;
            if (isLt1M) {
                return true;
            }
            ctx.$message({
                message: "Please do not upload files larger than 1m in size.",
                type: "warning",
            });
            return false;
        };
        let handleSuccess = ({ results, header }) => {
            state.tableData = results;
            state.tableHeader = header;
        };
        return {
            ...toRefs(state),
            beforeUpload,
            handleSuccess
        };
    },
});
</script>
