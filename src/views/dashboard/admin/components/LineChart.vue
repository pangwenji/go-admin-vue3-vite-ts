<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

import { reactive, defineComponent, onMounted, watch, toRefs, getCurrentInstance } from "vue";
import { getCodeImg } from "@/api/login";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";
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
            default: "350px",
        },
        autoResize: {
            type: Boolean,
            default: true,
        },
        chartData: {
            type: Object,
            required: true,
        },
    },
    setup() {
        let state = reactive({
            chart: null,
        });
        let chartData = ref("");
        let initChart = () => {
            state.chart = echarts.init(this.$el, "macarons");
            setOptions(chartData);
        };
        let setOptions = ({ expectedData, actualData } = {}) => {
            state.chart.setOption({
                xAxis: {
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    boundaryGap: false,
                    axisTick: {
                        show: false,
                    },
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true,
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                    padding: [5, 10],
                },
                yAxis: {
                    axisTick: {
                        show: false,
                    },
                },
                legend: {
                    data: ["expected", "actual"],
                },
                series: [
                    {
                        name: "expected",
                        itemStyle: {
                            normal: {
                                color: "#FF005A",
                                lineStyle: {
                                    color: "#FF005A",
                                    width: 2,
                                },
                            },
                        },
                        smooth: true,
                        type: "line",
                        data: expectedData,
                        animationDuration: 2800,
                        animationEasing: "cubicInOut",
                    },
                    {
                        name: "actual",
                        smooth: true,
                        type: "line",
                        itemStyle: {
                            normal: {
                                color: "#3888fa",
                                lineStyle: {
                                    color: "#3888fa",
                                    width: 2,
                                },
                                areaStyle: {
                                    color: "#f3f8ff",
                                },
                            },
                        },
                        data: actualData,
                        animationDuration: 2800,
                        animationEasing: "quadraticOut",
                    },
                ],
            });
        };
        watch(chartData, (oldValue, newValue) => {
            setOptions(newValue);
        });
        onMounted(() => {
            this.$nextTick(() => {
                initChart();
            });
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
            chartData,
            initChart,
            setOptions,
        };
    },
});
</script>
