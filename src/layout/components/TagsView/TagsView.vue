<template>
    <div>
        <el-tabs v-model="editableTabsValue" type="card" closable>
            <el-tab-pane
                v-for="item in visitedViews"
                :key="item.path"
                :label="item.title"
                :name="item.path"
            />
        </el-tabs>
    </div>
</template>

<script>
import path from "path";
import { defineComponent, computed, reactive, computed, toRefs, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    name: "TagsView",
    setup() {
        let route = useRoute();
        let sotre = useStore();
        let state = reactive({
            editableTabsValue: "1",
        });
        let visitedViews = computed(() => {
            return store.state.tagsView.visitedViews;
        });
        let routes = computed(() => {
            return store.state.permission.route;
        });
        let theme = computed(() => {
            return store.state.settings.theme;
        });

        let isActive = (route) => {
            return route.path === route.path;
        };
        let isAffix = (tag) => {
            return tag.meta && tag.meta.affix;
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
            const affixTags = (this.affixTags = filterAffixTags(this.routes));
            for (const tag of affixTags) {
                if (tag.name) {
                    store.dispatch("tagsView/addVisitedView", tag);
                }
            }
        };
        let addTags = () => {
            const { name } = route;
            if (name) {
                store.dispatch("tagsView/addView",route);
            }
            return false;
        };

        watch(() => {
            addTags();
            moveToCurrentTag();
        });
        onMounted(() => {
            initTags();
            addTags();
        });
        return {
            visitedViews,
            routes,
            theme,
            isActive,
            isAffix,
            filterAffixTags,
            initTags,
            addTags,
        };
    },
});
</script>

<style></style>
