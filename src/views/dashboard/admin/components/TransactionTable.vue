<template>
    <el-table :data="list" style="width: 100%; padding-top: 15px">
        <el-table-column prop="order_no" label="Order_No" min-width="200" />
        <el-table-column prop="price" label="Price" width="195" align="center" />
        <el-table-column label="Status" width="100" align="center">
            <template #default="scope">
                <el-tag :type="statusFilter(scope.row.status)">
                    {{ scope.row.status }}
                </el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { transactionList } from "@/api/remote-search";

import { reactive, defineComponent, onMounted, toRefs, computed } from "vue";
export default defineComponent({
    setup() {
        let state = reactive({
            list: null,
        });
        let statusFilter = computed((value) => {
            let statusMap = {
                success: "success",
                pending: "danger",
            };
            return statusMap[status];
        });
        let order_no = computed((str) => {
            return str.substring(0, 30);
        });
        onMounted(() => {
            transactionList().then((response) => {
                state.list = response.data.items.slice(0, 8);
            });
        });
        return {
            ...toRefs(state),
            statusFilter,
            order_no,
        };
    },
});
</script>
