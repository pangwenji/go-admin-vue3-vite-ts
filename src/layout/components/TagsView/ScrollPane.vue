<template>
    <el-scrollbar
        ref="scrollContainer"
        :vertical="false"
        class="scroll-container"
        @wheel.native.prevent="handleScroll"
    >
        <slot />
    </el-scrollbar>
</template>

<script>
const tagAndTagSpacing = 4; // tagAndTagSpacing

import {
    defineComponent,
    computed,
    getCurrentInstance,
    reactive,
    computed,
    toRefs,
    onMounted,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
    name: "ScrollPane",
    setup() {
        let state = reactive({
            left: 0,
        });
        let { ctx } = getCurrentInstance();
        let scrollWrapper = computed(() => {
            return ctx.$refs.scrollContainer.$refs.wrap;
        });
        let handleScroll = (e) => {
            const eventDelta = e.wheelDelta || -e.deltaY * 40;
            const $scrollWrapper = this.scrollWrapper;
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
        };
        let moveToTarget = (currentTag) => {
            const $container = this.$refs.scrollContainer.$el;
            const $containerWidth = $container.offsetWidth;
            const $scrollWrapper = this.scrollWrapper;
            const tagList = this.$parent.$refs.tag;

            let firstTag = null;
            let lastTag = null;

            // find first tag and last tag
            if (tagList.length > 0) {
                firstTag = tagList[0];
                lastTag = tagList[tagList.length - 1];
            }

            if (firstTag === currentTag) {
                $scrollWrapper.scrollLeft = 0;
            } else if (lastTag === currentTag) {
                $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
            } else {
                const currentIndex = tagList.findIndex((item) => item === currentTag);
                const prevTag = tagList[currentIndex - 1];
                const nextTag = tagList[currentIndex + 1];
                const afterNextTagOffsetLeft =
                    nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;
                const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing;
                if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
                    $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
                } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
                    $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
                }
            }
        };
        return {
            ...toRefs(state),
            scrollWrapper,
            handleScroll,
            moveToTarget,
        };
    },
});
</script>

<style lang="scss" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    ::v-deep {
        .el-scrollbar__bar {
            bottom: 0px;
        }
        .el-scrollbar__wrap {
            height: 49px;
        }
    }
}
</style>
