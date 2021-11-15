<template>
    <div v-if="!item.hidden" class="menu-wrapper">
        <template
            v-if="
                hasOneShowingChild(item.children, item) &&
                (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
                !item.alwaysShow
            "
        >
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item
                    :index="resolvePath(onlyOneChild.path)"
                    :class="{ 'submenu-title-noDropdown': !isNest }"
                >
                    <item
                        :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                        :title="onlyOneChild.meta.title"
                    />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu
            v-else
            ref="subMenu"
            :index="resolvePath(item.path)"
            popper-append-to-body
            :style="{ backgroundColor: '#000c17' }"
        >
            <template slot="title">
                <item
                    v-if="item.meta"
                    :icon="item.meta && item.meta.icon"
                    :title="item.meta.title"
                />
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
import { defineComponent, getCurrentInstance } from "vue";
export default defineComponent({
    name: "SidebarItem",
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true,
        },
        isNest: {
            type: Boolean,
            default: false,
        },
        basePath: {
            type: String,
            default: "",
        },
    },
    setup(props) {
        const { ctx } = getCurrentInstance();
        const hasOneShowingChild = (children = [], parent) => {
            const showingChildren = children.filter((item) => {
                if (item.hidden) {
                    return false;
                } else {
                    ctx.onlyOneChild = item;
                    return true;
                }
            });
            if (showingChildren.length === 1) {
                return true;
            }
            if (showingChildren.length === 0) {
                ctx.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
                return true;
            }

            return false;
        };
        const resolvePath = (routePath) => {
            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(ctx.basePath)) {
                return ctx.basePath;
            }
            return path.resolve(ctx.basePath, routePath);
        };

        return {
            hasOneShowingChild,
            resolvePath,
        };
    },
});
</script>
