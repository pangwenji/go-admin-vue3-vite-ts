<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <div v-loading="loading" :style="'height:' + height">
                    <iframe
                        :src="src"
                        frameborder="no"
                        style="width: 100%; height: 100%"
                        scrolling="auto"
                    />
                </div>
            </el-card>
        </template>
    </BasicLayout>
</template>
<script>
import { reactive, defineComponent, onMounted, toRefs } from "vue";
export default defineComponent({
    name: "Swagger",
    setup() {
        let state = reactive({
            src: process.env.VUE_APP_BASE_API + "/swagger/index.html",
            height: document.documentElement.clientHeight - 94.5 + "px;",
            loading: true,
        });
        onMounted(() => {
            setTimeout(() => {
                state.loading = false;
            }, 230);
            window.onresize = function temp() {
                state.height = document.documentElement.clientHeight - 94.5 + "px;";
            };
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>
