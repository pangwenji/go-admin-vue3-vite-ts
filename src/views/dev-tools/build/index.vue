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
import { reactive, defineComponent, onMounted, toRefs} from "vue";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        let state = reactive({
            src: process.env.VUE_APP_BASE_API + "/form-generator/index.html",
            height: document.documentElement.clientHeight - 94.5 + "px;",
            loading: true,
        });

        onMounted(() => {
            setTimeout(() => {
                this.loading = false;
            }, 230);
            const that = this;
            window.onresize = function temp() {
                that.height = document.documentElement.clientHeight - 94.5 + "px;";
            };
        });
        return {
          ...toRefs(state),
        };
    },
});
</script>
