<template>
    <div id="tags-view-container" class="tags-view-container">
        <el-tabs v-model="editableTabsValue" type="card" @tab-remove="closeSelectedTag">
            <el-tab-pane
                v-for="item in visitedViews"
                :key="item.path"
                :closable="item.fullPath === '/dashboard' ? false : true"
                :name="item.fullPath"
            >
                <router-link
                    ref="tag"
                    slot="label"
                    tag="span"
                    class="tags-view-item"
                    :style="{ color: item.fullPath === $route.fullPath ? theme : '' }"
                    :to="{ path: item.path, query: item.query, fullPath: item.fullPath }"
                    @contextmenu.prevent.native="openMenu(item, $event)"
                >
                    {{ item.title }}
                </router-link>
            </el-tab-pane>
        </el-tabs>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <li
                class="tags-item"
                @click="refreshSelectedTag(selectedTag)"
                @mouseover="handleTagsOver(1)"
                @mouseleave="handleTagsLeave(1)"
            >
                刷新当前标签页
            </li>
            <li
                v-if="!isAffix(selectedTag)"
                class="tags-item"
                @click="closeSelectedTag(selectedTag)"
                @mouseover="handleTagsOver(2)"
                @mouseleave="handleTagsLeave(2)"
            >
                关闭当前标签页
            </li>
            <li
                class="tags-item"
                @click="closeOthersTags"
                @mouseover="handleTagsOver(3)"
                @mouseleave="handleTagsLeave(3)"
            >
                关闭其他标签页
            </li>
            <li
                class="tags-item"
                @click="closeAllTags(selectedTag)"
                @mouseover="handleTagsOver(4)"
                @mouseleave="handleTagsLeave(4)"
            >
                关闭全部标签页
            </li>
        </ul>
    </div>
</template>

<script>
import path from "path";

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
    setup() {
        let state = reactive({
            editableTabsValue: "/",
            top: 0,
            left: 0,
            selectedTag: {},
            affixTags: [],
            visible: false,
        });
        let store = useStore();
        let route = useRoute();
        let router = useRouter();
        let visitedViews = computed(() => {
            return store.state.tagsView.visitedViews;
        });

        let routes = computed(() => {
            return store.state.permission.routes;
        });
        let theme = computed(() => {
            return store.state.settings.theme;
        });
        let isActive = () => {
            const index = visitedViews.findIndex((item) => item.fullPath === this.$route.fullPath);
            const pathIndex = index > -1 ? index : 0;
            state.editableTabsValue = visitedViews[pathIndex].fullPath;
        };
        let addTags = () => {
            if (route.name) {
                store.dispatch("tagsView/addView", route);
                isActive();
            }
            return false;
        };
        let visible = (value) => {
            if (value) {
                document.body.addEventListener("click", this.closeMenu);
            } else {
                document.body.removeEventListener("click", this.closeMenu);
            }
        };
        let filterAffixTags = (routes, basePath = "/") => {
            let tags = [];
            routes.forEach((route) => {
                if (route.meta && route.meta.affix) {
                    const tagPath = path.resolve(basePath, route.path);
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: { ...route.meta },
                    });
                }
                if (route.children) {
                    const tempTags = filterAffixTags(route.children, route.path);
                    if (tempTags.length >= 1) {
                        tags = [...tags, ...tempTags];
                    }
                }
            });
            return tags;
        };
        let initTags = () => {
            const affixTags = (state.affixTags = filterAffixTags(routes));
            for (const tag of affixTags) {
                // Must have tag name
                if (tag.name) {
                    store.dispatch("tagsView/addVisitedView", tag);
                }
            }
        };

        let openMenu = (tag, e) => {
            let menuMinWidth = 105;
            let offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
            let offsetWidth = this.$el.offsetWidth; // container width
            let maxLeft = offsetWidth - menuMinWidth; // left boundary
            let left = e.clientX - offsetLeft + 15; // 15: margin right

            if (left > maxLeft) {
                state.left = maxLeft;
            } else {
                state.left = left;
            }

            state.top = e.clientY;
            state.visible = true;
            sate.selectedTag = tag;
        };
        let closeMenu = () => {
            this.visible = false;
        };

        let closeOthersTags = () => {
            router.push(state.selectedTag.path).catch((e) => e);
            store.dispatch("tagsView/delOthersViews", state.selectedTag).then(() => {
                moveToCurrentTag();
            });
        };
        let closeAllTags = (view) => {
            this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
                if (state.affixTags.some((tag) => tag.path === view.path)) {
                    return;
                }
                toLastView(visitedViews, view);
            });
        };
        let toLastView = (visitedViews, view) => {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
                this.$router.push(latestView.fullPath).catch((err) => err);
            } else {
                if (view.name === "Dashboard") {
                    this.$router.replace({ path: "/redirect" + view.fullPath });
                } else {
                    this.$router.push("/");
                }
            }
        };
        let isAffix = (tag) => {
            return tag.meta && tag.meta.affix;
        };

        let handleTagsOver = (index) => {
            const tags = document.querySelectorAll(".tags-item");
            const item = tags[index - 1];
            item.style.cssText = `color:${
                this.$store.state.settings.theme
            };background:${this.$store.state.settings.theme.colorRgb()}`;
        };
        let handleTagsLeave = (index) => {
            const tags = document.querySelectorAll(".tags-item");
            const item = tags[index - 1];
            item.style.cssText = `color:#606266`;
        };

        let moveToCurrentTag = () => {
            const tags = this.$refs.tag;
            this.$nextTick(() => {
                for (const tag of tags) {
                    if (tag.to.path === route.path) {
                        if (tag.to.fullPath !== route.fullPath) {
                            store.dispatch("tagsView/updateVisitedView", route);
                        }
                        break;
                    }
                }
            });
        };
        let refreshSelectedTag = (view) => {
            store.dispatch("tagsView/delCachedView", view).then(() => {
                const { fullPath } = view;
                this.$nextTick(() => {
                    router.replace({
                        path: "/redirect" + fullPath,
                    });
                });
            });
        };
        let closeSelectedTag = (view) => {
            const routerPath = view.fullPath ? view.fullPath : view;
            const index = visitedViews.findIndex((item) => item.fullPath === routerPath);
            if (index > -1) {
                const path = visitedViews[index];
                store.dispatch("tagsView/delView", path).then(({ visitedViews }) => {
                    if (this.editableTabsValue === path.fullPath) {
                        toLastView(visitedViews, path);
                    }
                });
            }
        };

        onMounted(() => {
            addTags();
            initTags();
            isActive();
        });
        watch(() => {
            addTags();
            visible();
        });
        return {
            ...toRefs(state),
            routes,
            visitedViews,
            theme,
            isActive,
            toLastView,
            isAffix,
            handleTagsOver,
            handleTagsLeave,
            moveToCurrentTag,
            refreshSelectedTag,
            closeSelectedTag,
            addTags,
            visible,
            filterAffixTags,
            initTags,
            openMenu,
            closeMenu,
            closeOthersTags,
            closeAllTags,
        };
    },
});

String.prototype.colorRgb = function () {
    let sColor = this.toLowerCase();
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        const sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "rgba(" + sColorChange.join(",") + ",0.2)";
    } else {
        return sColor;
    }
};
</script>

<style lang="scss" scoped>
.tags-view-container ::v-deep {
    height: 43px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    padding: 0 15px;
    box-sizing: border-box;
    .el-tabs__item {
        &:hover {
            color: #000;
        }
    }
    .tags-view-item {
        height: 40px;
        display: inline-block;
    }
    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;
            &:first-of-type {
                margin-left: 15px;
            }
            &:last-of-type {
                margin-right: 15px;
            }
            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;
                &::before {
                    content: "";
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 1px 2px 10px #ccc;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        li {
            list-style: none;
            line-height: 36px;
            padding: 2px 20px;
            margin: 0;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
            outline: 0;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>
