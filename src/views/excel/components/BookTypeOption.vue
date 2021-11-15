<template>
    <div style="display: inline-block">
        <label class="radio-label">Book Type: </label>
        <el-select v-model="bookType" style="width: 120px">
            <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
    </div>
</template>

<script>
import { reactive, defineComponent,computed, toRefs, getCurrentInstance } from "vue";
export default defineComponent({
    props: {
        value: {
            type: String,
            default: "xlsx",
        },
    },
    setup(props, context) {
        let state = reactive({
            options: ["xlsx", "csv", "txt"],
        });

        let bookType = computed({
            get() {
                return props.value;
            },
            set(val) {
                context.$emit("input", val);
            },
        });
        return {
            ...toRefs(state),
            bookType,
        };
    },
});
</script>
