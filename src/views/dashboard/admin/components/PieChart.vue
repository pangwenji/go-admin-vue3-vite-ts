<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import {
    reactive,
    defineComponent,
    onBeforeUnmount,
    getCurrentInstance,
    onMounted,
    toRefs,
} from "vue";
export default defineComponent({
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: "chart",
        },
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "300px",
        },
    },
    setup() {
        let state = reactive({
            chart: null,
        });
        let { ctx } = getCurrentInstance();
        let initChart = () => {
            state.chart = echarts.init(ctx.$el, "macarons");
            state.chart.setOption({
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                legend: {
                    left: "center",
                    bottom: "10",
                    data: ["Industries", "Technology", "Forex", "Gold", "Forecasts"],
                },
                series: [
                    {
                        name: "WEEKLY WRITE ARTICLES",
                        type: "pie",
                        roseType: "radius",
                        radius: [15, 95],
                        center: ["50%", "38%"],
                        data: [
                            { value: 320, name: "Industries" },
                            { value: 240, name: "Technology" },
                            { value: 149, name: "Forex" },
                            { value: 100, name: "Gold" },
                            { value: 59, name: "Forecasts" },
                        ],
                        animationEasing: "cubicInOut",
                        animationDuration: 2600,
                    },
                ],
            });
        };
        onMounted(() => {
            initChart();
        });
        onBeforeUnmount(() => {
            if (!state.chart) {
                return;
            }
            state.chart.dispose();
            state.chart = null;
        });
        return {
          ...toRefs(state),
          initChart
        };
    },
});
</script>
