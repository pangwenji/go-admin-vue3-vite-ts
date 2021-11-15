<template>
    <div :class="{ 'has-logo': showLogo }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="
                         _themeStyle === 'light'
                        ? variables.menuLightBg
                        : variables.menuBg
                "
                :text-color="
                    $store.state.settings.themeStyle === 'light' ? 'rgba(0,0,0,.65)' : '#fff'
                "
                :active-text-color="$store.state.settings.theme"
                :unique-opened="true"
                :collapse-transition="true"
                mode="vertical"
            >
                <sidebar-item
                    v-for="route in sidebarRouters"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { userStore } from "vuex";
import {Logo} from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/styles/variables.scss";
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
    name:"Sidebar",
    components: { SidebarItem, Logo },
    setup() {
        const variables = () => {
            return variables;
        };
        const route = useRoute();
        const store = userStore();
        const activeMenu = () => {
            if (route.meta.activeMenu) {
                return route.meta.activeMenu;
            }
            return route.path;
        };
        const showLogo = () => {
            return store.state.settings.sidebarLogo;
        };
        const sidebarRouters = store.state.sidebarRouters;
        const sidebar = store.state.sidebar;
        const _themeStyle = store.state.settings.themeStyle
        return {
            variables,
            activeMenu,
            showLogo,
            sidebarRouters,
            sidebar,
        };
    },
});
</script>
