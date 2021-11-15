<template>
    <div style="display: inline-block">
        <label class="radio-label">Cell Auto-Width: </label>
        <el-radio-group v-model="autoWidth">
            <el-radio :label="true" border> True </el-radio>
            <el-radio :label="false" border> False </el-radio>
        </el-radio-group>
    </div>
</template>

<script>
import { reactive, defineComponent, computed, toRefs, getCurrentInstance } from "vue";
export default defineComponent({
    props: {
        value: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, context) {
        let = computed({
            get() {
                return this.value;
            },
            set(val) {
                context.$emit("input", val);
            }
        });
        return {
            autoWidth,
        };
    },
});
</script>
