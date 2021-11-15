<template>
    <div
        :class="classObj"
        class="app-wrapper"
        :style="{ '--current-color': $store.state.settings.theme }"
    >
        <div
            v-if="device === 'mobile' && sidebar.opened"
            class="drawer-bg"
            @click="handleClickOutside"
        />
        <sidebar
            class="sidebar-container"
            :style="{
                backgroundColor:
                    $store.state.settings.themeStyle === 'dark'
                        ? variables.menuBg
                        : variables.menuLightBg,
            }"
        />
        <div :class="{ hasTagsView: needTagsView }" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main />
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs } from "vue";
import { useStore } from "vuex";
import {RightPanel} from "@/components/RightPanel/index.vue";
import { Sidebar } from "./components/Sidebar/index.vue";
import { Settings } from "./components/Settings/index.vue";
import { Sidebar } from "./components/Sidebar/index.vue";
import { TagsView } from "./components/TagsView/TagsView.vue";
import { Navbar } from "./components/Navbar.vue";
// import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import { AppMain } from "./components/AppMain.vue";
import ResizeMixin from "./mixin/ResizeHandler";
import variables from "@/styles/variables.scss";
export default defineComponent({
    components: {
        RightPanel,
        Sidebar,
        AppMain,
    },
    mixins: [ResizeMixin],
    setup() {
        const store = useStore();
        const state = reactive({});
        const variables = () => {
            return variables;
        };
        const _theme = () => {
            return store.state.settings.theme;
        };
        const classObj = computed(() => {
            return {
                hideSidebar: !store.app.sidebar.open,
                openSidebar: store.app.device.open,
                withoutAnimation: store.app.sidebar.withoutAnimation,
                mobile: store.app.device === "mobile",
            };
        });
        return {
            classObj,
            variables,
            _theme,
        };
    },
});
</script>
<style lang="scss">
@import "@/styles/mixin.scss";
@import "@/styles/variables.scss";
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
