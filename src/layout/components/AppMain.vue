<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
    name: "AppMain",
    setup() {
        let route = useRoute();
        let cachedViews = computed(() => {
            return store.state.tagsView.cachedViews;
        });
        let key = computed(() => {
            return route.path;
        });
        return { cachedViews, key };
    },
});
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 93px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header + .app-main {
    padding-top: 93px;
}

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 93px);
//   }

//   .fixed-header+.app-main {
//     padding-top: 93px;
//   }
// }
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
