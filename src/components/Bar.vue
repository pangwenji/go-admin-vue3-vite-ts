<template>
    <div :style="{ padding: '0 0 32px 32px' }">
        <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
        <v-chart height="254" :data="arr" :force-fit="true" :padding="['auto', 'auto', '40', '50']">
            <v-tooltip />
            <v-axis />
            <v-bar position="x*y" />
        </v-chart>
    </div>
</template>

<script>
import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    name: "Bar",
    props: {
        title: {
            type: String,
            default: "",
        },
        list: {
            type: Array,
            default: () => {},
        },
        scale: {
            type: Array,
            default: () => {
                return [
                    {
                        dataKey: "x",
                        min: 2,
                    },
                    {
                        dataKey: "y",
                        title: "时间",
                        min: 1,
                        max: 22,
                    },
                ];
            },
        },
        tooltip: {
            type: Array,
            default: () => {
                return [
                    "x*y",
                    (x, y) => ({
                        name: x,
                        value: y,
                    }),
                ];
            },
        },
    },
    setup() {
        let state = reactive({
            arr: [],
        });
        onMounted(() => {
            setTimeout((_) => {
                this.arr = this.list;
            }, 300);
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>
