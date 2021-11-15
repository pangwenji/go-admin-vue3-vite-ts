<template>
    <el-form>
        <el-form-item label="Name">
            <el-input v-model.trim="user.name" />
        </el-form-item>
        <el-form-item label="Email">
            <el-input v-model.trim="user.email" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">Update</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { defineComponent} from "vue";
export default defineComponent({
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    name: "",
                    email: "",
                };
            },
        },
    },
    setup(props, context) {
        let submit = () => {
            context.$message({
                message: "User information has been updated successfully",
                type: "success",
                duration: 5 * 1000,
            });
        };
        return {
            submit,
        };
    },
});
</script>
