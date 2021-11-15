<template>
    <div style="display: inline-block">
        <label class="radio-label" style="padding-left: 0">Filename: </label>
        <el-input
            v-model="filename"
            placeholder="Please enter the file name (default excel-list)"
            style="width: 345px"
            prefix-icon="el-icon-document"
        />
    </div>
</template>

<script>
import { reactive, defineComponent, toRefs, computed, getCurrentInstance } from "vue";
export default defineComponent({
    props: {
        value: {
            type: String,
            default: "",
        },
    },
    setup(props, context) {
        let filename = computed({
            get() {
                return this.value;
            },
            set(val) {
                context.$emit("input", val);
            },
        });
        return {
            filename,
        };
    },
});
</script>
